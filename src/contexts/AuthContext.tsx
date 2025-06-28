import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { geolocationService } from '@/services/geolocationService';

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
  session: Session | null;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
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

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (currentSession && mounted) {
          await handleAuthSession(currentSession);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state change:', event, session?.user?.id);
        
        if (session) {
          await handleAuthSession(session);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setSession(null);
          setIsAuthenticated(false);
          localStorage.removeItem('fyke_user');
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [user]);

  const handleAuthSession = async (session: Session) => {
    try {
      setSession(session);
      
      // Fetch or create user profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      let profile = data;

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            phone: session.user.phone,
            name: null,
            email: session.user.email,
            bio: null,
            verified: false,
            profile_complete: false,
            availability: 'available',
            role: 'jobseeker' // Set default role instead of null
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }
        profile = newProfile;
      } else if (error) {
        // For any other errors, log them
        console.error('Error fetching profile:', error);
      }

      if (profile) {
        const authUser: AuthUser = {
          id: profile.id,
          phone: profile.phone || '',
          name: profile.name || '',
          email: profile.email || '',
          bio: profile.bio || '',
          role: profile.role || undefined,
          verified: profile.verified || false,
          profileComplete: profile.profile_complete || false,
          profilePhoto: profile.profile_photo,
          location: profile.location,
          availability: profile.availability || 'available',
          // Extended fields are not in the profiles table, so keep them from user
          skills: user.skills,
          categories: user.categories,
          subcategories: user.subcategories,
          salaryExpectation: user.salaryExpectation,
          category: user.category,
          vehicle: user.vehicle,
          salaryPeriod: user.salaryPeriod,
          primaryCategory: user.primaryCategory,
          salaryBySubcategory: user.salaryBySubcategory,
          category_wages: user.category_wages,
          latitude: user.latitude,
          longitude: user.longitude,
        };

        setUser(authUser);
        setIsAuthenticated(true);
        localStorage.setItem('fyke_user', JSON.stringify(authUser));
        console.log('Set user from Supabase:', authUser);
      }
    } catch (error) {
      console.error('Error in handleAuthSession:', error);
    }
  };

  const sendOTP = async (phone: string): Promise<{ error: unknown }> => {
    try {
      console.log('Sending OTP to:', phone);
      
      // Format phone number for India (+91)
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          shouldCreateUser: true
        }
      });

      if (error) {
        console.error('OTP send error:', error);
        
        // Handle specific error cases
        if (error.message && error.message.includes('Quota Exceeded')) {
          return { 
            error: new Error('SMS quota exceeded. Please try again later or contact support.') 
          };
        }
        
        if (error.message && error.message.includes('Database error saving new user')) {
          console.warn('Database error during user creation, but OTP might still be sent');
          // Don't return error here as the OTP might still be sent
          // The user can still try to verify the OTP
        }
        
        return { error };
      }

      localStorage.setItem('fyke_phone', formattedPhone);
      return { error: null };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { error };
    }
  };

  const verifyOTP = async (phone: string, otp: string): Promise<{ error: unknown }> => {
    try {
      console.log('Verifying OTP for:', phone);
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP verification error:', error);
        return { error };
      }

      if (data.session) {
        await handleAuthSession(data.session);
      }

      localStorage.removeItem('fyke_phone');
      return { error: null };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { error };
    }
  };

  const logout = async () => {
    console.log('Logging out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    }
    // The onAuthStateChange listener will handle setting state to null
  };

  const setRole = async (role: 'jobseeker' | 'employer') => {
    if (!user) {
      console.error("SetRole Error: No user found");
      return;
    }

    try {
      console.log(`Setting role to ${role} for user ${user.id}`);
      const { data, error } = await supabase
        .from('profiles')
        .update({ role: role })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setUser(currentUser => {
          if (!currentUser) return null;
          const updatedUser = { ...currentUser, role: data.role };
          localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
          console.log('Role updated successfully in context:', updatedUser);
          return updatedUser;
        });
      }
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
    if (!user || !session) {
      console.error('No user or session found, cannot update profile');
      return;
    }

    try {
      // Map frontend AuthUser fields to backend Supabase 'profiles' table columns
      const profileUpdates: { [key: string]: unknown } = {};
      for (const key in updates) {
        const value = updates[key as keyof AuthUser];
        switch (key) {
          case 'profileComplete':
            profileUpdates['profile_complete'] = value;
            break;
          case 'profilePhoto':
            profileUpdates['profile_photo'] = value;
            break;
          case 'salaryExpectation':
            profileUpdates['salary_expectation'] = value;
            break;
          case 'salaryPeriod':
            profileUpdates['salary_period'] = value;
            break;
          case 'primaryCategory':
            profileUpdates['primary_category'] = value;
            break;
          case 'subcategories':
            profileUpdates['subcategories'] = value;
            break;
          case 'salaryBySubcategory':
            profileUpdates['salary_by_subcategory'] = value;
            break;
          case 'category_wages': // handle new field
             profileUpdates['category_wages'] = value;
             break;
          default:
            profileUpdates[key] = value;
        }
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      if (data) {
        // Update the local user state with the latest data from the database
        const updatedUser: AuthUser = {
          ...user,
          ...updates, // Apply optimistic updates first
          // Then override with confirmed data from DB, mapping back to camelCase
          name: data.name,
          email: data.email,
          bio: data.bio,
          role: data.role,
          verified: data.verified,
          profileComplete: data.profile_complete,
          profilePhoto: data.profile_photo,
          location: data.location,
          availability: data.availability,
        };
        setUser(updatedUser);
        localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
        console.log('Profile updated successfully:', updatedUser);
      }
    } catch (error) {
      console.error('An error occurred during profile update:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
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
    </AuthContext.Provider>
  );
};
