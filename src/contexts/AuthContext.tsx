
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  name?: string;
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

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('fyke_user');
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (phone: string, otp: string) => {
    // Simulate API call
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      phone,
      role: 'jobseeker',
      verified: Math.random() > 0.3,
      profileComplete: false, // mark as not complete initially
      categories: [],
      primaryCategory: undefined,
      subcategories: [],
      availability: 'available',
      skills: ['Construction', 'Manual Labor'],
      salaryExpectation: { min: 300, max: 600 }
    };
    
    setUser(mockUser);
    setIsAuthenticated(true);
    localStorage.setItem('fyke_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('fyke_user');
  };

  const setRole = (role: 'jobseeker' | 'employer') => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('fyke_user', JSON.stringify(updatedUser));
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
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
