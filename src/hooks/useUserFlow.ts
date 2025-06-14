
import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useCallback } from 'react';

export const useUserFlow = () => {
  const { user, isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();

  const determineNextScreen = useCallback(() => {
    // Step 1: Check authentication
    if (!isAuthenticated) {
      return '/login';
    }

    // Step 2: Check role selection
    if (!user?.role) {
      return '/role-selection';
    }

    // Step 3: Check profile completion (only for job seekers)
    if (user.role === 'jobseeker' && !user.profileComplete) {
      return '/profile-setup';
    }

    // Step 4: Go to home
    return '/home';
  }, [isAuthenticated, user]);

  const enforceFlow = useCallback(() => {
    const nextScreen = determineNextScreen();
    const currentPath = window.location.pathname;
    
    // Don't redirect if already on the correct screen
    if (currentPath === nextScreen) return;
    
    // Allow certain paths during flow
    const allowedPaths = [
      '/', 
      '/login', 
      '/otp-verification', 
      '/role-selection', 
      '/profile-setup'
    ];
    
    // If on an allowed path, don't force redirect
    if (allowedPaths.includes(currentPath)) return;
    
    // Only redirect if not already navigating
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
