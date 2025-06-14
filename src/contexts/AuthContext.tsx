
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  name?: string;
  role: 'jobseeker' | 'employer';
  verified: boolean;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  language: string;
  isAuthenticated: boolean;
  login: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  setLanguage: (lang: string) => void;
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
  const [language, setLanguageState] = useState('English');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth data
    const storedUser = localStorage.getItem('fyke_user');
    const storedLang = localStorage.getItem('fyke_language');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedLang) {
      setLanguageState(storedLang);
    }
  }, []);

  const login = async (phone: string, otp: string) => {
    // Simulate API call
    const mockUser: User = {
      id: '1',
      phone,
      role: 'jobseeker',
      verified: Math.random() > 0.5,
      profileComplete: Math.random() > 0.5
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

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('fyke_language', lang);
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
      language,
      isAuthenticated,
      login,
      logout,
      setLanguage,
      setRole,
      switchRole,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
