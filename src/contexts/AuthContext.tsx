import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  User,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { supabase } from '@/integrations/supabase/client';
import { geolocationService } from '@/services/geolocationService';
import { logger } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Extend Window interface for recaptcha
declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

interface AuthUser {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  bio?: string;
  role?: 'jobseeker' | 'employer' | 'admin';
  verified: boolean;
  profileComplete: boolean;
  profilePhoto?: string;
  location?: string;
  availability?: 'available' | 'busy' | 'offline';
  skills?: string[];
  categories?: string[];
  subcategories?: string[];
  wages?: Record<string, { rate: number | string; unit: string; }>;
  salaryExpectation?: { min: number; max: number };
  category?: string;
  vehicle?: string;
  salaryPeriod?: 'daily' | 'weekly' | 'monthly';
  primaryCategory?: string;
  salaryBySubcategory?: Record<string, { amount: string; period: string; }>;
  category_wages?: Record<string, { rate: number | string; unit: string; }>;
  latitude?: number;
  longitude?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  firebaseUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  sendOTP: (phone: string) => Promise<{ error: unknown, testBypass?: boolean }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: unknown }>;
  logout: () => Promise<void>;
  setRole: (role: 'jobseeker' | 'employer') => Promise<void>;
  switchRole: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Utility to detect in-app browsers (e.g., Facebook, Instagram, WebView)
function isInAppBrowser() {
  const ua = navigator.userAgent || navigator.vendor;
  return (
    /FBAN|FBAV|Instagram|Line|WebView|wv|Messenger|Snapchat|MiuiBrowser|SamsungBrowser|Twitter/i.test(ua)
  );
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [location, setLocation] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null
  });
  const hasSetUser = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Initialize geolocation service
    const initGeolocation = async () => {
      if (geolocationService.isSupported() && user) {
        try {
          const currentLocation = await geolocationService.getCurrentLocation();
          if (mounted) {
            setLocation({
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude
            });
          }
        } catch (error) {
          logger.error('Error getting location:', error);
        }
      }
    };

    initGeolocation();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      logger.info('Firebase auth state change:', firebaseUser?.uid);
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        await handleFirebaseUser(firebaseUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('fyke_user');
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Suspicious state logging for tamper-proofing
  useEffect(() => {
    if (user === null && hasSetUser.current) {
      logger.warn('[SECURITY] User became null unexpectedly. Possible sabotage or logout.');
    }
    if (user !== null) {
      hasSetUser.current = true;
    }
    if (user) {
      if (!user.role) {
        logger.warn('[SECURITY] User is missing role. This should not happen after onboarding.');
      }
      if (user.role === 'jobseeker' && user.profileComplete === false) {
        // This is expected only during onboarding
        if (window.location.pathname !== '/profile-setup') {
          logger.warn('[SECURITY] Jobseeker profile marked incomplete outside onboarding. Possible sabotage.');
        }
      }
      if (user.role === 'employer' && user.profileComplete === false) {
        // This is expected only during minimal employer onboarding
        if (window.location.pathname !== '/profile-setup' && window.location.pathname !== '/role-selection') {
          logger.warn('[SECURITY] Employer profile marked incomplete outside onboarding. Possible sabotage.');
        }
      }
    }
  }, [user]);

  const handleFirebaseUser = async (firebaseUser: User) => {
    try {
      // Check if user profile exists in Supabase
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      let userData;
      if (!existingProfile && fetchError?.code === 'PGRST116') {
        // Create new user profile in Supabase
        const newProfile = {
          firebase_uid: firebaseUser.uid,
          phone: firebaseUser.phoneNumber || '',
          email: firebaseUser.email || '',
          name: '',
          bio: '',
          role: null,
          verified: false,
          profile_complete: false,
          availability: 'available',
          skills: [], // text[]
          categories: [], // text[]
          subcategories: [], // text[]
          wages: {}, // jsonb
          category_wages: {}, // jsonb
          salary_by_subcategory: {}, // jsonb
          vehicle: null,
          salary_expectation: null,
          salary_period: null,
          primary_category: null,
          location: null,
          latitude: null,
          longitude: null,
          profile_photo: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        logger.info('[handleFirebaseUser] Creating new profile with data:', newProfile);
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          logger.error('[handleFirebaseUser] Error creating profile in Supabase:', createError);
          toast({
            title: 'Error creating user profile',
            description: createError.message || createError.details || 'Unknown error',
            variant: 'destructive'
          });
          return;
        }
        logger.info('[handleFirebaseUser] Successfully created new profile:', createdProfile);
        userData = createdProfile;
      } else if (existingProfile) {
        userData = existingProfile;
      } else {
        logger.error('[handleFirebaseUser] Error fetching profile:', fetchError);
        toast({
          title: 'Error fetching user profile',
          description: fetchError?.message || fetchError?.details || 'Unknown error',
          variant: 'destructive'
        });
        return;
      }

      const authUser: AuthUser = {
        id: userData.id,
        phone: userData.phone || '',
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        role: userData.role ?? undefined, // Do not default to 'jobseeker' if null
        verified: !!userData.verified,
        profileComplete: !!userData.profile_complete,
        profilePhoto: userData.profile_photo,
        location: userData.location,
        availability: userData.availability || 'available',
        skills: Array.isArray(userData.skills) ? userData.skills : [],
        categories: Array.isArray(userData.categories) ? userData.categories : [],
        subcategories: Array.isArray(userData.subcategories) ? userData.subcategories : [],
        wages: userData.wages || {},
        salaryExpectation: userData.salary_expectation,
        category: userData.primary_category,
        vehicle: userData.vehicle,
        salaryPeriod: userData.salary_period,
        primaryCategory: userData.primary_category,
        salaryBySubcategory: userData.salary_by_subcategory || {},
        category_wages: userData.category_wages || {},
        latitude: userData.latitude,
        longitude: userData.longitude,
      };

      setUser(authUser);
      setIsAuthenticated(true);
      logger.info('[handleFirebaseUser] setUser and setIsAuthenticated(true) called');
      localStorage.setItem('fyke_user', JSON.stringify(authUser));
      logger.info('Set user from Firebase/Supabase:', authUser);
    } catch (error) {
      logger.error('Error in handleFirebaseUser:', error);
      toast({
        title: 'Unexpected error during user profile creation',
        description: error?.message || String(error),
        variant: 'destructive'
      });
    }
  };

  const sendOTP = async (phone: string): Promise<{ error: unknown, testBypass?: boolean }> => {
    console.log('[sendOTP] called with phone:', phone);
    
    // In-app browser detection
    if (isInAppBrowser()) {
      const error = new Error('Login is not supported in in-app browsers. Please open in Chrome, Safari, or your default browser.');
      logger.error('In-app browser detected:', navigator.userAgent);
      toast({
        title: 'Login not supported',
        description: 'Login is not supported in in-app browsers. Please open in Chrome, Safari, or your default browser.',
        variant: 'destructive'
      });
      return { error };
    }

    // Test mode bypass for specific test numbers
    const testPhones = ['7777777777', '8888888888', '9999999999'];
    const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
    console.log('[sendOTP] normalizedPhone:', normalizedPhone, 'testPhones:', testPhones);
    
    if (testPhones.includes(normalizedPhone)) {
      console.log('[sendOTP] Test bypass TRIGGERED for', normalizedPhone);
      logger.warn('Test-only OTP send bypass: showing OTP input immediately for', phone);
      setConfirmationResult(null);
      toast({
        title: 'Test OTP Bypass',
        description: `Test-only OTP send bypass: showing OTP input immediately for ${phone}`,
        variant: 'default'
      });
      return { error: null, testBypass: true };
    }
    
    try {
      logger.info('Sending OTP to:', phone);
      
      // Format phone number for India (+91)
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      // Always clear any existing recaptchaVerifier before creating a new one
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore errors when clearing recaptchaVerifier
        }
        window.recaptchaVerifier = null;
      }
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            logger.info('Recaptcha resolved');
          },
          'expired-callback': () => {
            logger.warn('Recaptcha expired');
            window.recaptchaVerifier = null;
          }
        });
      } catch (recaptchaError) {
        logger.error('Recaptcha failed to initialize:', recaptchaError);
        toast({
          title: 'Recaptcha Error',
          description: 'Recaptcha failed to initialize. Please disable ad blockers or try a different browser.',
          variant: 'destructive'
        });
        return { error: new Error('Recaptcha failed to initialize. Please disable ad blockers or try a different browser.') };
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      localStorage.setItem('fyke_phone', formattedPhone);
      
      return { error: null };
    } catch (error) {
      logger.error('Send OTP error:', error);
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      toast({
        title: 'OTP Send Error',
        description: error?.message || String(error),
        variant: 'destructive'
      });
      return { error };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ error: unknown }> => {
    // Test mode bypass for specific test numbers
    const testPairs = [
      { phone: '+917777777777', otp: '333333', uid: 'test-uid-77777' },
      { phone: '+918888888888', otp: '111111', uid: 'test-uid-88888' },
      { phone: '+919999999999', otp: '222222', uid: 'test-uid-99999' }
    ];
    
    const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
    const match = testPairs.find(pair => formattedPhone === pair.phone && otp === pair.otp);
    
    if (match) {
      logger.warn('Test-only OTP bypass: accepted', phone, otp);
      setConfirmationResult(null);
      // Simulate Firebase login
      const mockFirebaseUser = {
        uid: match.uid,
        phoneNumber: match.phone,
        email: '',
        displayName: '',
        photoURL: '',
        emailVerified: true,
        isAnonymous: false,
        providerData: [],
        getIdToken: async () => 'test-token',
        getIdTokenResult: async () => ({ token: 'test-token' }),
        reload: async () => {},
        delete: async () => {},
        toJSON: () => ({}),
        metadata: {},
        providerId: 'firebase',
        refreshToken: '',
      };
      await handleFirebaseUser(mockFirebaseUser as User);
      logger.info('[verifyOTP] Test bypass: called handleFirebaseUser for', match.phone);
      toast({
        title: 'Test OTP Bypass',
        description: `Test-only OTP bypass: accepted ${phone}, ${otp}`,
        variant: 'default'
      });
      return { error: null };
    }
    
    try {
      logger.info('Verifying OTP for:', phone);
      if (!confirmationResult) {
        toast({
          title: 'OTP Verification Error',
          description: 'No confirmation result found. Please request OTP again.',
          variant: 'destructive'
        });
        return { error: new Error('No confirmation result found. Please request OTP again.') };
      }
      const result = await confirmationResult.confirm(otp);
      logger.info('OTP verified successfully:', result.user.uid);
      localStorage.removeItem('fyke_phone');
      setConfirmationResult(null);
      return { error: null };
    } catch (error) {
      logger.error('Verify OTP error:', error);
      toast({
        title: 'OTP Verification Error',
        description: error?.message || String(error),
        variant: 'destructive'
      });
      return { error };
    }
  };

  const logout = async () => {
    logger.info('Logging out');
    try {
      await signOut(auth);
      localStorage.removeItem('fyke_user');
    } catch (error) {
      logger.error('Error logging out:', error);
      toast({
        title: 'Logout Error',
        description: error?.message || String(error),
        variant: 'destructive'
      });
    }
  };

  const setRole = async (role: 'jobseeker' | 'employer') => {
    if (!user || !firebaseUser) {
      logger.error("SetRole Error: No user found");
      toast({
        title: 'Set Role Error',
        description: 'No user found to set role.',
        variant: 'destructive'
      });
      return;
    }

    try {
      logger.info(`Setting role to ${role} for user ${user.id}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('firebase_uid', firebaseUser.uid);

      if (error) {
        logger.error('Error updating role in Supabase:', error);
        toast({
          title: 'Role Update Error',
          description: error.message || error.details || 'Unknown error',
          variant: 'destructive'
        });
        return;
      }

      setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, role };
        localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
        logger.info('Role updated successfully in context:', updatedUser);
        return updatedUser;
      });
    } catch (error) {
      logger.error('Error setting role:', error);
      toast({
        title: 'Role Update Error',
        description: error?.message || String(error),
        variant: 'destructive'
      });
    }
  };

  const switchRole = async () => {
    if (!user || !user.role) return;
    const newRole = user.role === 'jobseeker' ? 'employer' : 'jobseeker';
    await setRole(newRole); // Reuse the setRole logic
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user || !firebaseUser) {
      logger.error('No user or Firebase user found, cannot update profile');
      toast({
        title: 'Profile Update Error',
        description: 'No user or Firebase user found, cannot update profile.',
        variant: 'destructive'
      });
      return;
    }

    try {
      logger.info('[updateProfile] Incoming updates:', updates);
      // Convert AuthUser fields to Supabase fields
      const supabaseUpdates: Record<string, unknown> = {};
      Object.entries(updates).forEach(([key, value]) => {
        switch (key) {
          case 'profileComplete':
            supabaseUpdates.profile_complete = !!value;
            break;
          case 'profilePhoto':
            supabaseUpdates.profile_photo = value;
            break;
          case 'primaryCategory':
            supabaseUpdates.primary_category = value;
            break;
          case 'salaryExpectation':
            supabaseUpdates.salary_expectation = value;
            break;
          case 'salaryPeriod':
            supabaseUpdates.salary_period = value;
            break;
          case 'salaryBySubcategory':
            supabaseUpdates.salary_by_subcategory = value || {};
            break;
          case 'category_wages':
            supabaseUpdates.category_wages = value || {};
            break;
          case 'categories':
            supabaseUpdates.categories = Array.isArray(value) ? value : [];
            break;
          case 'subcategories':
            supabaseUpdates.subcategories = Array.isArray(value) ? value : [];
            break;
          case 'skills':
            supabaseUpdates.skills = Array.isArray(value) ? value : [];
            break;
          case 'wages':
            supabaseUpdates.wages = value || {};
            break;
          default:
            supabaseUpdates[key] = value;
        }
      });
      supabaseUpdates.updated_at = new Date().toISOString();
      logger.info('[updateProfile] Mapped supabaseUpdates:', supabaseUpdates);

      const { error } = await supabase
        .from('profiles')
        .update(supabaseUpdates)
        .eq('firebase_uid', firebaseUser.uid);

      if (error) {
        logger.error('[updateProfile] Error updating profile in Supabase:', error);
        toast({
          title: 'Profile Update Error',
          description: error.message || error.details || 'Unknown error',
          variant: 'destructive'
        });
        return;
      }

      // Fetch the latest profile from Supabase to ensure context is in sync
      const { data: latestProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .single();

      if (fetchError || !latestProfile) {
        logger.error('[updateProfile] Error fetching latest profile after update:', fetchError);
        toast({
          title: 'Profile Fetch Error',
          description: fetchError?.message || fetchError?.details || 'Unknown error',
          variant: 'destructive'
        });
        return;
      }

      const updatedUser: AuthUser = {
        id: latestProfile.id,
        phone: latestProfile.phone || '',
        name: latestProfile.name || '',
        email: latestProfile.email || '',
        bio: latestProfile.bio || '',
        role: latestProfile.role ?? undefined,
        verified: !!latestProfile.verified,
        profileComplete: !!latestProfile.profile_complete,
        profilePhoto: latestProfile.profile_photo,
        location: latestProfile.location,
        availability: latestProfile.availability || 'available',
        skills: Array.isArray(latestProfile.skills) ? latestProfile.skills : [],
        categories: Array.isArray(latestProfile.categories) ? latestProfile.categories : [],
        subcategories: Array.isArray(latestProfile.subcategories) ? latestProfile.subcategories : [],
        wages: latestProfile.wages || {},
        salaryExpectation: latestProfile.salary_expectation,
        category: latestProfile.primary_category,
        vehicle: latestProfile.vehicle,
        salaryPeriod: latestProfile.salary_period,
        primaryCategory: latestProfile.primary_category,
        salaryBySubcategory: latestProfile.salary_by_subcategory || {},
        category_wages: latestProfile.category_wages || {},
        latitude: latestProfile.latitude,
        longitude: latestProfile.longitude,
      };

      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
      logger.info('[updateProfile] Profile updated and context synced successfully:', updatedUser);
    } catch (error) {
      logger.error('[updateProfile] An error occurred during profile update:', error);
      toast({
        title: 'Profile Update Error',
        description: error?.message || String(error),
        variant: 'destructive'
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isAuthenticated,
        loading,
        sendOTP,
        verifyOTP,
        logout,
        setRole,
        switchRole,
        updateProfile,
      }}
    >
      {children}
      <div id="recaptcha-container"></div>
    </AuthContext.Provider>
  );
};
