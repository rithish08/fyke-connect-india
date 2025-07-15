import React, { createContext, useContext, useState, useEffect } from 'react';
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
  sendOTP: (phone: string) => Promise<{ error: unknown }>;
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
          console.error('Error getting location:', error);
        }
      }
    };

    initGeolocation();

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mounted) return;
      
      console.log('Firebase auth state change:', firebaseUser?.uid);
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
          role: 'jobseeker',
          verified: false,
          profile_complete: false,
          availability: 'available',
          skills: [],
          categories: [],
          subcategories: [],
          wages: {},
          category_wages: {},
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }
        
        userData = createdProfile;
      } else if (existingProfile) {
        userData = existingProfile;
      } else {
        console.error('Error fetching profile:', fetchError);
        return;
      }

      const authUser: AuthUser = {
        id: userData.id,
        phone: userData.phone || '',
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        role: userData.role || 'jobseeker',
        verified: userData.verified || false,
        profileComplete: userData.profile_complete || false,
        profilePhoto: userData.profile_photo,
        location: userData.location,
        availability: userData.availability || 'available',
        skills: userData.skills || [],
        categories: userData.categories || [],
        subcategories: userData.subcategories || [],
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
      localStorage.setItem('fyke_user', JSON.stringify(authUser));
      console.log('Set user from Firebase/Supabase:', authUser);
    } catch (error) {
      console.error('Error in handleFirebaseUser:', error);
    }
  };

  const sendOTP = async (phone: string): Promise<{ error: unknown }> => {
    try {
      console.log('Sending OTP to:', phone);
      
      // Format phone number for India (+91)
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      // In web environment, we need to set up recaptcha
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
          callback: () => {
            console.log('Recaptcha resolved');
          }
        });
      }

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      localStorage.setItem('fyke_phone', formattedPhone);
      
      return { error: null };
    } catch (error) {
      console.error('Send OTP error:', error);
      // Reset recaptcha on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      return { error };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ error: unknown }> => {
    try {
      console.log('Verifying OTP for:', phone);
      
      if (!confirmationResult) {
        return { error: new Error('No confirmation result found. Please request OTP again.') };
      }

      const result = await confirmationResult.confirm(otp);
      console.log('OTP verified successfully:', result.user.uid);
      
      localStorage.removeItem('fyke_phone');
      setConfirmationResult(null);
      
      return { error: null };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { error };
    }
  };

  const logout = async () => {
    console.log('Logging out');
    try {
      await signOut(auth);
      localStorage.removeItem('fyke_user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const setRole = async (role: 'jobseeker' | 'employer') => {
    if (!user || !firebaseUser) {
      console.error("SetRole Error: No user found");
      return;
    }

    try {
      console.log(`Setting role to ${role} for user ${user.id}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('firebase_uid', firebaseUser.uid);

      if (error) {
        console.error('Error updating role in Supabase:', error);
        return;
      }

      setUser(currentUser => {
        if (!currentUser) return null;
        const updatedUser = { ...currentUser, role };
        localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
        console.log('Role updated successfully in context:', updatedUser);
        return updatedUser;
      });
    } catch (error) {
      console.error('Error setting role:', error);
    }
  };

  const switchRole = async () => {
    if (!user || !user.role) return;
    const newRole = user.role === 'jobseeker' ? 'employer' : 'jobseeker';
    await setRole(newRole); // Reuse the setRole logic
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user || !firebaseUser) {
      console.error('No user or Firebase user found, cannot update profile');
      return;
    }

    try {
      // Convert AuthUser fields to Supabase fields
      const supabaseUpdates: any = {};
      Object.entries(updates).forEach(([key, value]) => {
        switch (key) {
          case 'profileComplete':
            supabaseUpdates.profile_complete = value;
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
            supabaseUpdates.salary_by_subcategory = value;
            break;
          case 'category_wages':
            supabaseUpdates.category_wages = value;
            break;
          default:
            supabaseUpdates[key] = value;
        }
      });

      const { error } = await supabase
        .from('profiles')
        .update(supabaseUpdates)
        .eq('firebase_uid', firebaseUser.uid);

      if (error) {
        console.error('Error updating profile in Supabase:', error);
        return;
      }

      const updatedUser: AuthUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
      console.log('Profile updated successfully:', updatedUser);
    } catch (error) {
      console.error('An error occurred during profile update:', error);
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
