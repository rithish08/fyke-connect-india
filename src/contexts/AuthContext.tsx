
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  bio?: string;
  role: 'jobseeker' | 'employer';
  verified: boolean;
  profileComplete: boolean;
  profilePhoto?: string;
  location?: string;
  availability?: 'available' | 'busy' | 'offline';
  skills?: string[];
  salaryExpectation?: { min: number; max: number };
  category?: string;
  vehicle?: string;
  salaryPeriod?: 'daily' | 'weekly' | 'monthly';
  categories?: string[];
  primaryCategory?: string;
  subcategories?: string[];
  salaryBySubcategory?: Record<string, { amount: string; period: string; }>;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  sendOTP: (phone: string) => Promise<{ error: any }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ error: any }>;
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

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthSession(session);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
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

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthSession = async (session: Session) => {
    try {
      setSession(session);
      
      // Fetch or create user profile
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            id: session.user.id,
            phone: session.user.phone || '',
            email: session.user.email || '',
            role: 'jobseeker',
            verified: false,
            profile_complete: false,
            availability: 'available'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          return;
        }
        profile = newProfile;
      }

      if (profile) {
        const authUser: AuthUser = {
          id: profile.id,
          phone: profile.phone || '',
          name: profile.name || '',
          email: profile.email || '',
          bio: profile.bio || '',
          role: profile.role || 'jobseeker',
          verified: profile.verified || false,
          profileComplete: profile.profile_complete || false,
          profilePhoto: profile.profile_photo,
          location: profile.location,
          availability: profile.availability || 'available',
          skills: [],
          categories: [],
          subcategories: [],
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

  const sendOTP = async (phone: string) => {
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
        return { error };
      }

      localStorage.setItem('fyke_phone', formattedPhone);
      return { error: null };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { error };
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      console.log('Verifying OTP:', phone, otp);
      
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`;
      
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: 'sms'
      });

      if (error) {
        console.error('OTP verification error:', error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      localStorage.removeItem('fyke_user');
      localStorage.removeItem('fyke_phone');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setRole = async (role: 'jobseeker' | 'employer') => {
    if (user) {
      console.log('Setting role:', role);
      
      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          profile_complete: role === 'employer' ? true : user.profileComplete
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating role:', error);
        return;
      }

      const updatedUser = { 
        ...user, 
        role,
        profileComplete: role === 'employer' ? true : user.profileComplete
      };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
    }
  };

  const switchRole = async () => {
    if (user) {
      const newRole: 'jobseeker' | 'employer' = user.role === 'jobseeker' ? 'employer' : 'jobseeker';
      await setRole(newRole);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (user) {
      console.log('Updating profile:', updates);
      
      // Map updates to database columns
      const dbUpdates: any = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.bio !== undefined) dbUpdates.bio = updates.bio;
      if (updates.profileComplete !== undefined) dbUpdates.profile_complete = updates.profileComplete;
      if (updates.verified !== undefined) dbUpdates.verified = updates.verified;
      if (updates.availability !== undefined) dbUpdates.availability = updates.availability;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating profile:', error);
        return;
      }

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated,
      loading,
      sendOTP,
      verifyOTP,
      logout,
      setRole,
      switchRole,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
