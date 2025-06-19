
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
  isAuthenticated: boolean;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  setRole: (role: 'jobseeker' | 'employer') => void;
  switchRole: () => void;
  updateProfile: (updates: Partial<AuthUser>) => void;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage first
    const storedUser = localStorage.getItem('fyke_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('Restored user from localStorage:', parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('fyke_user');
      }
    }
    
    // Check for Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !user) {
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
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      const authUser: AuthUser = {
        id: session.user.id,
        phone: profile?.phone || session.user.phone || '',
        name: profile?.name || '',
        email: profile?.email || session.user.email || '',
        bio: profile?.bio || '',
        role: profile?.role || 'jobseeker',
        verified: profile?.verified || false,
        profileComplete: profile?.profile_complete || false,
        profilePhoto: profile?.profile_photo,
        location: profile?.location,
        availability: profile?.availability || 'available',
        skills: [],
        categories: [],
        subcategories: [],
      };

      setUser(authUser);
      setIsAuthenticated(true);
      localStorage.setItem('fyke_user', JSON.stringify(authUser));
      console.log('Set user from Supabase:', authUser);
    } catch (error) {
      console.error('Error in handleAuthSession:', error);
    }
  };

  const login = async (phone: string, otp: string) => {
    try {
      console.log('Login attempt:', phone, otp);
      
      // Accept demo OTP
      if (otp === '123456') {
        const mockUser: AuthUser = {
          id: `user_${Date.now()}`,
          phone,
          name: '',
          role: 'jobseeker',
          verified: false,
          profileComplete: false,
          availability: 'available',
        };
        
        setUser(mockUser);
        setIsAuthenticated(true);
        localStorage.setItem('fyke_user', JSON.stringify(mockUser));
        console.log('Demo login successful:', mockUser);
        return;
      }
      
      throw new Error('Invalid OTP');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('fyke_user');
      localStorage.removeItem('fyke_phone');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const setRole = (role: 'jobseeker' | 'employer') => {
    if (user) {
      console.log('Setting role:', role);
      const updatedUser = { 
        ...user, 
        role,
        profileComplete: role === 'employer' ? true : user.profileComplete
      };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
    }
  };

  const switchRole = () => {
    if (user) {
      const newRole: 'jobseeker' | 'employer' = user.role === 'jobseeker' ? 'employer' : 'jobseeker';
      console.log('Switching role from', user.role, 'to', newRole);
      const updatedUser = { 
        ...user, 
        role: newRole,
        profileComplete: newRole === 'employer' ? true : user.profileComplete
      };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = (updates: Partial<AuthUser>) => {
    if (user) {
      console.log('Updating profile:', updates);
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      setRole,
      switchRole,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
