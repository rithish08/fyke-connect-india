
export interface UserProfile {
  id: string;
  user_id: string;
  role?: 'jobseeker' | 'employer' | 'admin';
  profile_complete?: boolean;
  name?: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  availability?: 'available' | 'busy' | 'offline';
  location?: string;
  bio?: string;
  primary_category?: string;
  subcategories?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextProps {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (phone: string) => Promise<{ error: any; data: any }>;
  signUp: (phone: string, additionalData?: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  verifyOTP: (phone: string, token: string) => Promise<{ error: any; data: any; success?: boolean }>;
  sendOTP: (phone: string) => Promise<{ error: any; data: any; success?: boolean }>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{ error: any }>;
  switchRole: () => Promise<void>;
  setRole: (role: 'jobseeker' | 'employer') => Promise<void>;
  completeProfileSetup: () => Promise<void>;
}
