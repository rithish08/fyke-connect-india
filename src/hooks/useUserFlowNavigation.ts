import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';

export const useUserFlowNavigation = () => {
  const { user, isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();

  const navigateToCorrectScreen = () => {
    console.log('useUserFlowNavigation - Current state:', { isAuthenticated, user: user ? { role: user.role, profileComplete: user.profileComplete } : null });
    
    if (!isAuthenticated || !user) {
      const currentPath = window.location.pathname;
      console.log('useUserFlowNavigation - User not authenticated, current path:', currentPath);
      
      // Only redirect to language selection if we're not already there
      // This prevents infinite loops during the onboarding process
      if (currentPath !== '/') {
        console.log('useUserFlowNavigation - Redirecting to language selection');
        goTo('/');
      }
      return;
    }

    // If user hasn't selected a role, go to role selection
    if (!user.role) {
      console.log('useUserFlowNavigation - No role selected, going to role selection');
      goTo('/role-selection');
      return;
    }

    // If user is a job seeker and hasn't completed profile, go to profile setup
    if (user.role === 'jobseeker' && !user.profileComplete) {
      console.log('useUserFlowNavigation - Job seeker without complete profile, going to profile setup');
      goTo('/profile-setup');
      return;
    }

    // Otherwise, go to home
    console.log('useUserFlowNavigation - All conditions met, going to home');
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
    console.log('useUserFlowNavigation - Checking redirect for path:', currentPath);
    
    // Don't redirect if we're on onboarding pages
    if (['/role-selection', '/profile-setup'].includes(currentPath)) {
      console.log('useUserFlowNavigation - On onboarding page, no redirect');
      return false;
    }
    
    // Don't redirect if we're on language selection and not authenticated
    if (currentPath === '/' && !isAuthenticated) {
      console.log('useUserFlowNavigation - On language selection and not authenticated, no redirect');
      return false;
    }
    
    console.log('useUserFlowNavigation - Should redirect');
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
