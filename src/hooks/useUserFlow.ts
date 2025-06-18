
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

export const useUserFlow = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();

  const determineNextScreen = useCallback(() => {
    console.log('[useUserFlow] Determining next screen:', {
      loading,
      isAuthenticated,
      userProfile,
      role: userProfile?.role,
      profileComplete: userProfile?.profile_complete
    });

    if (loading) return null;
    
    // Check if language is selected (from localStorage)
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) {
      return '/language-selection';
    }
    
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
    
    const selectedLanguage = localStorage.getItem('selectedLanguage');
    if (!selectedLanguage) return false;
    
    return userProfile.role && (
      userProfile.role === 'employer' || 
      userProfile.role === 'admin' || 
      (userProfile.role === 'jobseeker' && userProfile.profile_complete)
    );
  }, [loading, isAuthenticated, userProfile]);

  const canAccessMainApp = useCallback(() => {
    return isFlowComplete();
  }, [isFlowComplete]);

  return {
    determineNextScreen,
    isFlowComplete: isFlowComplete(),
    canAccessMainApp: canAccessMainApp(),
    loading,
    needsLanguageSelection: !localStorage.getItem('selectedLanguage'),
    needsAuthentication: !isAuthenticated || !userProfile,
    needsRoleSelection: isAuthenticated && userProfile && !userProfile.role,
    needsProfileSetup: isAuthenticated && userProfile && userProfile.role === 'jobseeker' && !userProfile.profile_complete
  };
};
