
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  user_id: string;
  role?: 'jobseeker' | 'employer' | 'admin';
  profile_complete?: boolean;
  first_name?: string;
  last_name?: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  availability?: string;
  location?: string;
  bio?: string;
  primary_category?: string;
  subcategories?: string[];
  created_at?: string;
  updated_at?: string;
}

interface AuthContextProps {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (phone: string) => Promise<{ error: any; data: any }>;
  signUp: (phone: string, additionalData?: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: any; data: any; success?: boolean }>;
  sendOTP: (phone: string) => Promise<{ error: any; data: any }>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error: any }>;
  switchRole: () => Promise<void>;
  setRole: (role: 'jobseeker' | 'employer') => Promise<void>;
  completeProfileSetup: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Exception fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          try {
            const profile = await fetchUserProfile(session.user.id);
            setUserProfile(profile);
          } catch (error) {
            console.error('[AuthContext] Error fetching profile:', error);
            setUserProfile(null);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (phone: string) => {
    return await supabase.auth.signInWithOtp({
      phone,
    });
  };

  const signUp = async (phone: string, additionalData?: any) => {
    return await supabase.auth.signInWithOtp({
      phone,
      options: {
        data: additionalData
      }
    });
  };

  const sendOTP = async (phone: string) => {
    return await supabase.auth.signInWithOtp({
      phone,
    });
  };

  const verifyOTP = async (phone: string, token: string) => {
    const result = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    
    return {
      ...result,
      success: !result.error
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserProfile(null);
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking for existing profile:', fetchError);
        throw fetchError;
      }

      let result;

      if (!existingProfile) {
        result = await supabase.from('profiles').insert({
          user_id: user.id,
          ...profile,
        });
      } else {
        result = await supabase
          .from('profiles')
          .update(profile)
          .eq('user_id', user.id);
      }

      if (result.error) {
        console.error('Error updating profile:', result.error);
        throw result.error;
      }

      const updatedProfile = await fetchUserProfile(user.id);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Exception in updateUserProfile:', error);
      throw error;
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    try {
      await updateUserProfile(profile);
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const switchRole = async () => {
    if (!userProfile) return;
    
    const newRole = userProfile.role === 'jobseeker' ? 'employer' : 'jobseeker';
    await updateUserProfile({ role: newRole });
  };

  const setRole = async (role: 'jobseeker' | 'employer') => {
    await updateUserProfile({ role });
  };

  const completeProfileSetup = async () => {
    await updateUserProfile({ profile_complete: true });
  };

  const value = {
    user,
    userProfile,
    loading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    verifyOTP,
    sendOTP,
    updateUserProfile,
    updateProfile,
    switchRole,
    setRole,
    completeProfileSetup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
