
import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useEffect, useCallback } from 'react';

export const useUserFlow = () => {
  const { user, isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();

  const determineNextScreen = useCallback(() => {
    if (!isAuthenticated) {
      return '/';
    }

    if (!user?.role) {
      return '/role-selection';
    }

    if (user.role === 'jobseeker' && !user.profileComplete) {
      return '/profile-setup';
    }

    return '/home';
  }, [isAuthenticated, user]);

  const enforceFlow = useCallback(() => {
    const nextScreen = determineNextScreen();
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on the correct screen
    if (currentPath === nextScreen) return;
    
    // Allow certain paths during flow
    const allowedPaths = ['/', '/role-selection', '/login', '/otp-verification', '/profile-setup'];
    if (allowedPaths.includes(currentPath)) return;
    
    // Prevent navigation loops by checking if we're already trying to navigate
    if (!window.location.href.includes(nextScreen)) {
      goTo(nextScreen);
    }
  }, [determineNextScreen, goTo]);

  const isFlowComplete = isAuthenticated && user?.role && (user.role === 'employer' || user.profileComplete);

  return {
    determineNextScreen,
    enforceFlow,
    isFlowComplete
  };
};
