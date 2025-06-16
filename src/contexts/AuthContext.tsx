
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfile, AuthContextProps } from '@/types/auth';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[AuthContext] Error fetching user profile:', error);
        return null;
      }

      const profile: UserProfile = {
        id: data.id,
        user_id: data.id,
        role: data.role,
        profile_complete: data.profile_complete,
        name: data.name,
        phone: data.phone,
        email: data.email,
        avatar_url: data.profile_photo,
        availability: data.availability,
        location: data.location,
        bio: data.bio,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return profile;
    } catch (error) {
      console.error('[AuthContext] Exception fetching user profile:', error);
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
            console.error('[AuthContext] Error fetching profile on auth change:', error);
            setUserProfile(null);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[AuthContext] Initial session check:', session?.user?.id, error);
        
        if (session?.user) {
          setUser(session.user);
          const profile = await fetchUserProfile(session.user.id);
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('[AuthContext] Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const sendOTP = async (phone: string) => {
    const result = await supabase.auth.signInWithOtp({ phone });
    return { ...result, success: !result.error };
  };

  const verifyOTP = async (phone: string, token: string) => {
    const result = await supabase.auth.verifyOtp({
      phone,
      token,
      type: 'sms',
    });
    return { ...result, success: !result.error };
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
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('[AuthContext] Error checking for existing profile:', fetchError);
        throw fetchError;
      }

      const dbProfile: any = { id: user.id };
      if (profile.role) dbProfile.role = profile.role;
      if (profile.profile_complete !== undefined) dbProfile.profile_complete = profile.profile_complete;
      if (profile.name) dbProfile.name = profile.name;
      if (profile.phone) dbProfile.phone = profile.phone;
      if (profile.email) dbProfile.email = profile.email;
      if (profile.availability) dbProfile.availability = profile.availability;
      if (profile.location) dbProfile.location = profile.location;
      if (profile.bio) dbProfile.bio = profile.bio;

      let result;
      if (!existingProfile) {
        result = await supabase.from('profiles').insert(dbProfile);
      } else {
        result = await supabase.from('profiles').update(dbProfile).eq('id', user.id);
      }

      if (result.error) throw result.error;

      const updatedProfile = await fetchUserProfile(user.id);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('[AuthContext] Exception in updateUserProfile:', error);
      throw error;
    }
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
    signIn: sendOTP,
    signUp: sendOTP,
    signOut,
    verifyOTP,
    sendOTP,
    updateUserProfile,
    updateProfile: async (profile: Partial<UserProfile>) => {
      try {
        await updateUserProfile(profile);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    switchRole: async () => {
      if (!userProfile) return;
      const newRole = userProfile.role === 'jobseeker' ? 'employer' : 'jobseeker';
      await updateUserProfile({ role: newRole });
    },
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
