import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useCallback } from 'react';

export const useUserFlow = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const { goTo } = useScreenNavigation();

  const determineNextScreen = useCallback(() => {
    if (loading) return null;
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
  }, [isAuthenticated, user, loading]);

  const enforceFlow = useCallback(() => {
    const nextScreen = determineNextScreen();
    if (!nextScreen) return; // Wait until loading done
    const currentPath = window.location.pathname;
    // Don't redirect if already on the correct screen
    if (currentPath === nextScreen) return;
    // Allow access to certain screens without redirecting
    const allowedPaths = ['/', '/login', '/otp-verification', '/role-selection', '/profile-setup'];
    if (allowedPaths.includes(currentPath)) return;
    // Only redirect if we're not already navigating
    goTo(nextScreen);
  }, [determineNextScreen, goTo]);

  const isFlowComplete = !loading && isAuthenticated && user?.role && (user.role === 'employer' || user.profileComplete);

  return {
    determineNextScreen,
    enforceFlow,
    isFlowComplete,
    loading
  };
};
