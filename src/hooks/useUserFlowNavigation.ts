import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';

export const useUserFlowNavigation = () => {
  const { user, isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();

  const navigateToCorrectScreen = () => {
    if (!isAuthenticated || !user) {
      goTo('/');
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

  return {
    navigateToCorrectScreen,
    canAccessScreen,
    currentUserState: {
      isAuthenticated,
      hasRole: !!user?.role,
      isProfileComplete: user?.profileComplete || false,
      role: user?.role
    }
  };
};
