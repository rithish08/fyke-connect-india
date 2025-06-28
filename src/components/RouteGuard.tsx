import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ShimmerLoader from '@/components/ui/ShimmerLoader';

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard = ({ children }: RouteGuardProps) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    if (loading) return; // Wait until authentication status is resolved

    const publicRoutes = ['/language', '/login', '/otp-verification'];
    const isPublicRoute = publicRoutes.includes(currentPath);

    if (!isAuthenticated) {
      if (!isPublicRoute) {
        navigate('/language');
      }
      return;
    }

    // --- User is Authenticated ---
    
    // Redirect away from public pages if logged in
    if (isPublicRoute) {
      navigate('/home');
      return;
    }

    if (user) {
      // 1. Role Check
      if (!user.role) {
        if (currentPath !== '/role-selection') {
          navigate('/role-selection');
        }
        return; // Halt further checks until role is selected
      }

      // If role is selected, redirect away from role selection page
      if (currentPath === '/role-selection') {
        navigate('/home');
        return;
      }

      // 2. Profile Completion Check
      const isProfileSetupPage = currentPath.startsWith('/profile-setup');
      let isProfileComplete = false;

      if (user.role === 'employer') {
        isProfileComplete = !!user.name;
      } else if (user.role === 'jobseeker') {
        // A job seeker's profile is complete if they have a name, at least one category, and wages defined.
        isProfileComplete = !!user.name && !!user.categories?.length && !!user.wages;
      }

      if (isProfileComplete) {
        // If profile is complete, don't allow access to setup pages
        if (isProfileSetupPage) {
          navigate('/home');
        }
        // Otherwise, allow access to the intended page
        return;
      } else {
        // If profile is not complete, force user to the setup page
        if (!isProfileSetupPage) {
          navigate('/profile-setup');
        }
        // Otherwise, they are on the correct setup page, so allow access
        return;
      }
    }
  }, [user, isAuthenticated, loading, navigate, currentPath]);

  if (loading || (!isAuthenticated && !['/language', '/login', '/otp-verification'].includes(currentPath))) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ShimmerLoader height={60} width="200px" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
