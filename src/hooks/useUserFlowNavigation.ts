
import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';

export const useUserFlowNavigation = () => {
  const { user, isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();

  const navigateToCorrectScreen = () => {
    if (!isAuthenticated || !user) {
      // Only redirect to language selection if we're not already there
      // This prevents infinite loops during the onboarding process
      if (window.location.pathname !== '/') {
        goTo('/');
      }
      return;
    }

    // If user hasn't selected a role, go to role selection
    if (!user.role) {
      goTo('/role-selection');
      return;
    }

    // If user is a job seeker and hasn't completed profile, go to profile setup
    if (user.role === 'jobseeker' && !user.profileComplete) {
      goTo('/profile-setup');
      return;
    }

    // Otherwise, go to home
    goTo('/home');
  };

  const canAccessScreen = (screenType: 'home' | 'search' | 'profile' | 'messages' | 'jobs') => {
    if (!isAuthenticated || !user) return false;
    
    // Check if user needs to complete onboarding first
    if (!user.role) return false;
    if (user.role === 'jobseeker' && !user.profileComplete) return false;
    
    return true;
  };

  const shouldRedirectFromCurrentPage = () => {
    const currentPath = window.location.pathname;
    
    // Don't redirect if we're on onboarding pages
    if (['/role-selection', '/profile-setup'].includes(currentPath)) {
      return false;
    }
    
    // Don't redirect if we're on language selection and not authenticated
    if (currentPath === '/' && !isAuthenticated) {
      return false;
    }
    
    return true;
  };

  return {
    navigateToCorrectScreen,
    canAccessScreen,
    shouldRedirectFromCurrentPage,
    currentUserState: {
      isAuthenticated,
      hasRole: !!user?.role,
      isProfileComplete: user?.profileComplete || false,
      role: user?.role
    }
  };
};
