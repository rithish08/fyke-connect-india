import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { firebaseAuthService } from '@/services/firebaseAuthService';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'jobseeker' | 'employer' | 'admin';
  verified: boolean;
  profile_complete: boolean;
  location: string | null;
  bio: string | null;
  availability: 'available' | 'busy' | 'offline';
  primary_category?: string;
  subcategories?: string[];
  salaryBySubcategory?: { [key: string]: { amount: string; period: string } };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  sendOTP: (phoneNumber: string) => Promise<{ success: boolean; error?: string }>;
  verifyOTP: (otpCode: string) => Promise<{ success: boolean; error?: string }>;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // alias for logout
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, phone: string, name: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  switchRole: () => Promise<void>;
  setRole: (role: 'jobseeker' | 'employer' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const isAuthenticated = !!user && !!session;

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetching to avoid blocking auth state changes
          setTimeout(() => {
            fetchUserProfile(session.user.id);
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

  const sendOTP = async (phoneNumber: string) => {
    try {
      const result = await firebaseAuthService.sendOTP(phoneNumber);
      if (result.success) {
        toast({
          title: "OTP Sent",
          description: `Verification code sent to +91 ${phoneNumber}`
        });
        return { success: true };
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send OTP",
          variant: "destructive"
        });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to send OTP";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const verifyOTP = async (otpCode: string) => {
    try {
      const result = await firebaseAuthService.verifyOTP(otpCode);
      if (result.success) {
        // Check if we need to assign a role from localStorage
        const selectedRole = localStorage.getItem('fyke_selected_role') as 'jobseeker' | 'employer' | null;
        
        if (selectedRole && user) {
          // Update the user profile with the selected role
          await updateProfile({ 
            role: selectedRole,
            profile_complete: selectedRole === 'employer' ? true : false
          });
          localStorage.removeItem('fyke_selected_role');
        }
        
        toast({
          title: "Phone Verified!",
          description: "Successfully authenticated"
        });
        return { success: true };
      } else {
        toast({
          title: "Verification Failed",
          description: result.error || "Invalid OTP",
          variant: "destructive"
        });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to verify OTP";
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive"
      });
      return { success: false, error: errorMessage };
    }
  };

  const login = async (phone: string, otp: string) => {
    const result = await verifyOTP(otp);
    if (!result.success) {
      throw new Error(result.error || 'OTP verification failed');
    }
  };

  const logout = async () => {
    try {
      firebaseAuthService.cleanup();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setUserProfile(null);
      setSession(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive"
      });
    }
  };

  // --- NEW: signOut for convention/compat
  const signOut = logout;

  // NEW: setRole method (updates profile and refetches)
  const setRole = async (role: 'jobseeker' | 'employer' | 'admin') => {
    if (!user) return;
    await updateProfile({ role });
    await fetchUserProfile(user.id);
  };

  // NEW: switchRole toggles between jobseeker and employer (not admin)
  const switchRole = async () => {
    if (!userProfile) return;
    const newRole = userProfile.role === 'jobseeker' ? 'employer' : 'jobseeker';
    await updateProfile({ role: newRole });
    await fetchUserProfile(userProfile.id);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Not logged in' };

    try {
      // Profile update -- fix naming: profile_complete, not profileComplete
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile(prev => prev ? { ...prev, ...updates } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated"
      });
      return { error: undefined };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
      return { error };
    }
  };

  // Keep email/password methods for admin access
  const signUp = async (email: string, password: string, phone: string, name: string, role: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          role
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    isAuthenticated,
    sendOTP,
    verifyOTP,
    login,
    logout,
    signOut,
    updateProfile,
    signUp,
    signIn,
    switchRole,
    setRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
