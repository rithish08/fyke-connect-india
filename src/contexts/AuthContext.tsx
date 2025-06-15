import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  setRole: (role: 'jobseeker' | 'employer') => void;
  switchRole: () => void;
  updateProfile: (updates: Partial<User>) => void;
  loading: boolean;
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('fyke_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        console.log('User loaded from localStorage:', userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('fyke_user');
        setUser(null);
        setIsAuthenticated(false);
      }
    } else {
      setUser(null);
      setIsAuthenticated(false);
      console.log('No stored user found');
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, otp: string) => {
    try {
      // Simulate API call with basic validation
      if (otp.length !== 6) {
        throw new Error('Invalid OTP length');
      }

      // Get stored name if available
      const storedName = localStorage.getItem('fyke_name') || '';
      
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        phone,
        name: storedName,
        email: '',
        bio: '',
        role: 'jobseeker', // Default role, will be changed in role selection
        verified: Math.random() > 0.3,
        profileComplete: false, // Always false for new users
        categories: [],
        primaryCategory: undefined,
        subcategories: [],
        availability: 'available',
        skills: [],
        salaryExpectation: { min: 0, max: 0 },
        location: 'Mumbai, Maharashtra'
      };
      
      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('fyke_user', JSON.stringify(mockUser));
      console.log('User logged in successfully:', mockUser);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fyke_user');
    localStorage.removeItem('fyke_phone');
    localStorage.removeItem('fyke_name');
    console.log('User logged out');
  };

  const setRole = (role: 'jobseeker' | 'employer') => {
    if (user) {
      const updatedUser = { 
        ...user, 
        role,
        profileComplete: role === 'employer' ? true : user.profileComplete
      };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
      console.log('User role updated to:', role);
    }
  };

  const switchRole = () => {
    if (user) {
      const newRole = user.role === 'jobseeker' ? 'employer' : 'jobseeker';
      setRole(newRole);
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
      console.log('Profile updated:', updates);
      console.log('Updated user:', updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      setRole,
      switchRole,
      updateProfile,
      loading // Provide the loading state
    }}>
      {children}
    </AuthContext.Provider>
  );
};
