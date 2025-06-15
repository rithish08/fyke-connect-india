
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    // Don't redirect while still loading
    if (loading) {
      console.log('[RouteGuard] Still loading auth...');
      return;
    }

    // Mark that we've completed our first check
    setHasChecked(true);

    const currentPath = location.pathname;
    console.log('[RouteGuard] Checking route:', currentPath, { 
      user: !!user, 
      isAuthenticated, 
      requireAuth, 
      requireProfile,
      role: user?.role,
      profileComplete: user?.profileComplete
    });

    // Public routes that don't need authentication
    const publicRoutes = ['/', '/login', '/role-selection', '/otp-verification'];
    if (publicRoutes.includes(currentPath) && !requireAuth) {
      console.log('[RouteGuard] Public route, allowing access');
      return;
    }

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      console.log('[RouteGuard] Auth required but not authenticated, redirecting to home');
      navigate('/');
      return;
    }

    // If authenticated, check user state
    if (isAuthenticated && user) {
      // Check role requirement
      if (!user.role) {
        console.log('[RouteGuard] No role set, redirecting to role selection');
        navigate('/role-selection');
        return;
      }

      // Check profile completion for jobseekers
      if (requireProfile && user.role === 'jobseeker' && !user.profileComplete) {
        // Don't redirect if already on profile setup
        if (currentPath !== '/profile-setup') {
          console.log('[RouteGuard] Profile incomplete, redirecting to profile setup');
          navigate('/profile-setup');
          return;
        }
      }

      // Redirect completed profiles away from setup pages
      if (user.profileComplete && currentPath === '/profile-setup') {
        console.log('[RouteGuard] Profile complete, redirecting to home');
        navigate('/home');
        return;
      }

      // Redirect employers away from profile setup
      if (user.role === 'employer' && currentPath === '/profile-setup') {
        console.log('[RouteGuard] Employer on profile setup, redirecting to home');
        navigate('/home');
        return;
      }
    }

    console.log('[RouteGuard] All checks passed, showing content');
  }, [user, isAuthenticated, loading, requireAuth, requireProfile, navigate, location.pathname]);

  // Show loading while checking authentication or during initial load
  if (loading || !hasChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShimmerLoader height={60} width="200px" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show content if all checks pass
  return <>{children}</>;
};

export default RouteGuard;
