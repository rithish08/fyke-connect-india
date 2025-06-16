
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

export const useUserFlow = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();

  const determineNextScreen = useCallback(() => {
    if (loading) return null;
    
    if (!isAuthenticated || !userProfile) {
      return '/login';
    }
    
    if (!userProfile.role) {
      return '/role-selection';
    }
    
    if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      return '/profile-setup';
    }
    
    return '/home';
  }, [isAuthenticated, userProfile, loading]);

  const isFlowComplete = useCallback(() => {
    if (loading || !isAuthenticated || !userProfile) return false;
    
    return userProfile.role && (
      userProfile.role === 'employer' || 
      userProfile.role === 'admin' || 
      (userProfile.role === 'jobseeker' && userProfile.profile_complete)
    );
  }, [loading, isAuthenticated, userProfile]);

  return {
    determineNextScreen,
    isFlowComplete: isFlowComplete(),
    loading,
    needsRoleSelection: isAuthenticated && userProfile && !userProfile.role,
    needsProfileSetup: isAuthenticated && userProfile && userProfile.role === 'jobseeker' && !userProfile.profile_complete
  };
};
