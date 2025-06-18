
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

export const useUserFlow = () => {
  const { user, isAuthenticated, loading } = useAuth();

  const determineNextScreen = useCallback(() => {
    if (loading) return null;
    
    if (!isAuthenticated || !user) {
      return '/login';
    }
    
    if (!user.role) {
      return '/role-selection';
    }
    
    if (user.role === 'jobseeker' && !user.profileComplete) {
      return '/profile-setup';
    }
    
    return '/home';
  }, [isAuthenticated, user, loading]);

  const isFlowComplete = useCallback(() => {
    if (loading || !isAuthenticated || !user) return false;
    
    return user.role && (user.role === 'employer' || user.profileComplete);
  }, [loading, isAuthenticated, user]);

  return {
    determineNextScreen,
    isFlowComplete: isFlowComplete(),
    loading
  };
};
