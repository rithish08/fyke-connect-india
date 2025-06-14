
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserFlow } from '@/hooks/useUserFlow';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import ShimmerLoader from '@/components/ui/ShimmerLoader';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
}

const RouteGuard = ({ 
  children, 
  requireAuth = true, 
  requireProfile = true 
}: RouteGuardProps) => {
  const { user, isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();
  const { isFlowComplete } = useUserFlow();

  useEffect(() => {
    // If authentication is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
      goTo('/login');
      return;
    }

    // If user is authenticated but doesn't have a role
    if (isAuthenticated && !user?.role) {
      goTo('/role-selection');
      return;
    }

    // If profile is required but not complete (for job seekers)
    if (requireProfile && isAuthenticated && user?.role === 'jobseeker' && !user.profileComplete) {
      goTo('/profile-setup');
      return;
    }
  }, [isAuthenticated, user, requireAuth, requireProfile, goTo]);

  // Show loading while checking authentication
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ShimmerLoader height={60} width="200px" />
      </div>
    );
  }

  // Show loading while checking profile completion
  if (requireProfile && isAuthenticated && user?.role === 'jobseeker' && !user.profileComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ShimmerLoader height={60} width="200px" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
