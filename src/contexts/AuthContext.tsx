
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id?: string;
  phone?: string;
  name?: string;
  email?: string;
  role?: 'jobseeker' | 'employer';
  profileComplete?: boolean;
  verified?: boolean;
  primaryCategory?: string;
  categories?: string[];
  subcategories?: string[];
  skills?: string[];
  bio?: string;
  location?: string;
  salaryBySubcategory?: Record<string, { amount: string; period: string }>;
  availability?: 'available' | 'busy' | 'offline';
  vehicle?: string;
  activeRole?: 'jobseeker' | 'employer'; // Current active role for dual-role users
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, otp?: string) => Promise<void>;
  verifyOTP: (otp: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setRole: (role: 'jobseeker' | 'employer') => void;
  switchRole: () => void;
  getCurrentUserRole: () => 'jobseeker' | 'employer' | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage on app start
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('fyke_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('fyke_user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const persistUser = (userData: User) => {
    try {
      localStorage.setItem('fyke_user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error persisting user:', error);
    }
  };

  const login = async (phone: string, otp?: string) => {
    try {
      setLoading(true);
      
      if (otp) {
        // Handle OTP verification during login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newUser: User = {
          id: `user_${Date.now()}`,
          phone,
          verified: true,
          profileComplete: false
        };
        
        persistUser(newUser);
        localStorage.removeItem('fyke_pending_phone');
        
        toast({
          title: "Login Successful!",
          description: "Welcome to Fyke Connect"
        });
      } else {
        // Handle sending OTP
        await new Promise(resolve => setTimeout(resolve, 1000));
        localStorage.setItem('fyke_pending_phone', phone);
        
        toast({
          title: "OTP Sent",
          description: "Please check your phone for the verification code",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: otp ? "Invalid OTP. Please try again." : "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otp: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const phone = localStorage.getItem('fyke_pending_phone');
      if (!phone) throw new Error('No pending phone verification');
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        phone,
        verified: true,
        profileComplete: false
      };
      
      persistUser(newUser);
      localStorage.removeItem('fyke_pending_phone');
      
      toast({
        title: "Welcome to Fyke!",
        description: "Your phone number has been verified successfully",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('fyke_user');
    localStorage.removeItem('fyke_return_intent');
    setUser(null);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user) throw new Error('No user to update');
      
      const updatedUser = { ...user, ...data };
      persistUser(updatedUser);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const setRole = (role: 'jobseeker' | 'employer') => {
    if (!user) return;
    
    const updatedUser = { 
      ...user, 
      role,
      activeRole: role,
      profileComplete: role === 'employer' ? true : user.profileComplete 
    };
    persistUser(updatedUser);
  };

  const switchRole = () => {
    if (!user?.role) return;
    
    // For now, users can only have one role, but this enables future dual-role functionality
    const newActiveRole: 'jobseeker' | 'employer' = user.activeRole === 'jobseeker' ? 'employer' : 'jobseeker';
    
    // Only switch if user actually has this role
    if (user.role === newActiveRole || user.role === 'employer') {
      const updatedUser = { ...user, activeRole: newActiveRole };
      persistUser(updatedUser);
      
      toast({
        title: "Role Switched",
        description: `Now viewing as ${newActiveRole === 'jobseeker' ? 'Job Seeker' : 'Employer'}`,
      });
    }
  };

  const getCurrentUserRole = (): 'jobseeker' | 'employer' | null => {
    return user?.activeRole || user?.role || null;
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    verifyOTP,
    logout,
    updateProfile,
    setRole,
    switchRole,
    getCurrentUserRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
