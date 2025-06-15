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
  role: 'jobseeker' | 'employer' | 'admin' | null;
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
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: any }>;
  signUp: (email: string, password: string, phone: string, name: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  switchRole: () => Promise<void>;
  setRole: (role: 'jobseeker' | 'employer' | 'admin') => Promise<void>;
  completeProfileSetup: (profileData: any) => Promise<void>;
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
      console.log('Fetching user profile for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      console.log('User profile fetched:', data);
      setUserProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  useEffect(() => {
    console.log('[AuthContext] Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[AuthContext] Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile after user is set
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 100);
        } else {
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('[AuthContext] Initial session check:', session?.user?.id);
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
      console.log('[AuthContext] Sending OTP to:', phoneNumber);
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
      console.error('[AuthContext] Send OTP error:', errorMessage);
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
      console.log('[AuthContext] Verifying OTP:', otpCode);
      const result = await firebaseAuthService.verifyOTP(otpCode);
      if (result.success) {
        console.log('[AuthContext] OTP verification successful');
        // The auth state change will be handled by the listener
        return { success: true };
      } else {
        console.error('[AuthContext] OTP verification failed:', result.error);
        toast({
          title: "Verification Failed",
          description: result.error || "Invalid OTP",
          variant: "destructive"
        });
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to verify OTP";
      console.error('[AuthContext] Verify OTP error:', errorMessage);
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
      
      localStorage.removeItem('fyke_phone');
      localStorage.removeItem('fyke_selected_role');
      localStorage.removeItem('fyke_selected_subcategories');
      
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

  const signOut = logout;

  const setRole = async (role: 'jobseeker' | 'employer' | 'admin') => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          profile_complete: role === 'employer' ? true : false
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile(user.id);
      
      toast({
        title: "Role Updated",
        description: `Your role has been set to ${role}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive"
      });
    }
  };

  const switchRole = async () => {
    if (!userProfile) return;
    const newRole = userProfile.role === 'jobseeker' ? 'employer' : 'jobseeker';
    await setRole(newRole);
  };

  const completeProfileSetup = async (profileData: any) => {
    if (!user) return;

    try {
      if (profileData.subcategories && profileData.subcategories.length > 0) {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', profileData.category)
          .single();

        if (categoryData) {
          await supabase
            .from('user_categories')
            .delete()
            .eq('user_id', user.id);

          for (const subcategory of profileData.subcategories) {
            const { data: subcategoryData } = await supabase
              .from('subcategories')
              .select('id')
              .eq('name', subcategory)
              .eq('category_id', categoryData.id)
              .single();

            if (subcategoryData) {
              await supabase
                .from('user_categories')
                .insert({
                  user_id: user.id,
                  category_id: categoryData.id,
                  subcategory_id: subcategoryData.id,
                  is_primary: profileData.subcategories[0] === subcategory
                });
            }
          }
        }
      }

      if (profileData.salaryBySubcategory) {
        for (const [subcategory, salaryInfo] of Object.entries(profileData.salaryBySubcategory)) {
          const salary = salaryInfo as { amount: string; period: string };
          
          const { data: subcategoryData } = await supabase
            .from('subcategories')
            .select('id, category_id')
            .eq('name', subcategory)
            .single();

          if (subcategoryData) {
            await supabase
              .from('wages')
              .upsert({
                user_id: user.id,
                category_id: subcategoryData.category_id,
                subcategory_id: subcategoryData.id,
                amount: parseFloat(salary.amount),
                period: salary.period
              });
          }
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          location: profileData.location,
          bio: profileData.bio,
          primary_category: profileData.category,
          profile_complete: true
        })
        .eq('id', user.id);

      if (error) throw error;

      await fetchUserProfile(user.id);
      
      toast({
        title: "Profile Complete",
        description: "Your profile has been successfully set up!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete profile setup",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'Not logged in' };

    try {
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
    setRole,
    completeProfileSetup
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
