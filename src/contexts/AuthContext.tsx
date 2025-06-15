
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, phone?: string, name?: string, role?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<{ error: any }>;
  switchRole: () => Promise<void>;
  setRole: (role: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const signUp = async (email: string, password: string, phone?: string, name?: string, role?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            phone: phone || '',
            name: name || '',
            role: role || 'jobseeker'
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Account created successfully! Please check your email to verify your account.');
      return { error: null };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Signed in successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        return;
      }
      
      setUser(null);
      setSession(null);
      setUserProfile(null);
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  const login = async (phone: string, otp: string) => {
    // For demo purposes, simulate OTP login
    try {
      // In production, you'd verify the OTP here
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${phone}@phone.fyke`,
        password: otp
      });

      if (error) {
        throw new Error('Invalid OTP');
      }

      toast.success('Login successful!');
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    await signOut();
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) return { error: 'No user logged in' };

      const { error } = await supabase
        .from('profiles')
        .upsert({ id: user.id, ...data })
        .select();

      if (error) {
        toast.error('Error updating profile');
        return { error };
      }

      await fetchUserProfile(user.id);
      toast.success('Profile updated successfully!');
      return { error: null };
    } catch (error: any) {
      toast.error('Error updating profile');
      return { error };
    }
  };

  const switchRole = async () => {
    if (!userProfile) return;
    
    const newRole = userProfile.role === 'jobseeker' ? 'employer' : 'jobseeker';
    await updateProfile({ role: newRole });
  };

  const setRole = async (role: string) => {
    await updateProfile({ role });
  };

  const isAuthenticated = !!user;
  const isAdmin = userProfile?.role === 'admin';

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    login,
    logout,
    updateProfile,
    switchRole,
    setRole,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
