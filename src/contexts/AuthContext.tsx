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
          alert('Error creating user profile: ' + (createError.message || createError.details || 'Unknown error'));
          return;
        }
        logger.info('[handleFirebaseUser] Successfully created new profile:', createdProfile);
        userData = createdProfile;
      } else if (existingProfile) {
        userData = existingProfile;
      } else {
        logger.error('[handleFirebaseUser] Error fetching profile:', fetchError);
        alert('Error fetching user profile: ' + (fetchError?.message || fetchError?.details || 'Unknown error'));
        return;
      }

      const authUser: AuthUser = {
        id: userData.id,
        phone: userData.phone || '',
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        role: userData.role || 'jobseeker',
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
      alert('Unexpected error during user profile creation: ' + (error?.message || error));
    }
  };

  const sendOTP = async (phone: string): Promise<{ error: unknown, testBypass?: boolean }> => {
    console.log('[sendOTP] called with phone:', phone, 'REACT_APP_TEST_MODE:', process.env.REACT_APP_TEST_MODE);
    if (process.env.REACT_APP_TEST_MODE === 'true') {
      const testPhones = ['7777777777', '8888888888', '9999999999'];
      const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
      console.log('[sendOTP] normalizedPhone:', normalizedPhone, 'testPhones:', testPhones);
      if (testPhones.includes(normalizedPhone)) {
        console.log('[sendOTP] Test bypass TRIGGERED for', normalizedPhone);
        logger.warn('Test-only OTP send bypass: showing OTP input immediately for', phone);
        setConfirmationResult(null);
        return { error: null, testBypass: true };
      } else {
        console.log('[sendOTP] Test bypass NOT triggered for', normalizedPhone);
      }
    }
    try {
      logger.info('Sending OTP to:', phone);
      
      // Format phone number for India (+91)
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      // In web environment, we need to set up recaptcha
      if (process.env.REACT_APP_TEST_MODE !== 'true') {
        if (!window.recaptchaVerifier) {
          window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: () => {
              logger.info('Recaptcha resolved');
            }
          });
        }
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
      return { error };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ error: unknown }> => {
    if (process.env.REACT_APP_TEST_MODE === 'true') {
      const testPairs = [
        { phone: '+917777777777', otp: '333333', uid: 'test-uid-77777' },
        { phone: '+918888888888', otp: '111111', uid: 'test-uid-88888' },
        { phone: '+919999999999', otp: '222222', uid: 'test-uid-99999' }
      ];
      const match = testPairs.find(pair => phone.replace(/\s+/g, '') === pair.phone && otp === pair.otp);
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
        if (process.env.REACT_APP_TEST_MODE === 'true' && typeof window !== 'undefined') {
          window.location.assign('/role-selection');
        }
        return { error: null };
      }
    }
    try {
      logger.info('Verifying OTP for:', phone);
      if (!confirmationResult) {
        return { error: new Error('No confirmation result found. Please request OTP again.') };
      }
      const result = await confirmationResult.confirm(otp);
      logger.info('OTP verified successfully:', result.user.uid);
      localStorage.removeItem('fyke_phone');
      setConfirmationResult(null);
      return { error: null };
    } catch (error) {
      logger.error('Verify OTP error:', error);
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
    }
  };

  const setRole = async (role: 'jobseeker' | 'employer') => {
    if (!user || !firebaseUser) {
      logger.error("SetRole Error: No user found");
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
      alert('No user or Firebase user found, cannot update profile');
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
        alert('Error updating profile: ' + (error.message || error.details || 'Unknown error'));
        return;
      }

      const updatedUser: AuthUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
      logger.info('[updateProfile] Profile updated successfully:', updatedUser);
    } catch (error) {
      logger.error('[updateProfile] An error occurred during profile update:', error);
      alert('Unexpected error during profile update: ' + (error?.message || error));
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
