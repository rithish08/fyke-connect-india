
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireProfileComplete?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false,
  requireProfileComplete = false
}) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  console.log('[ProtectedRoute] Current path:', location.pathname, {
    user: !!user,
    userProfile: !!userProfile,
    role: userProfile?.role,
    profileComplete: userProfile?.profile_complete,
    loading
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto border border-blue-100">
            <span className="text-2xl font-bold text-blue-600">F</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    console.log('[ProtectedRoute] Auth required but no user, redirecting to language selection');
    return <Navigate to="/language-selection" replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && userProfile?.role !== 'admin') {
    console.log('[ProtectedRoute] Admin required but user is not admin, redirecting to home');
    return <Navigate to="/home" replace />;
  }

  // If user is authenticated but no profile exists, redirect to role selection
  if (requireAuth && user && !userProfile) {
    console.log('[ProtectedRoute] User authenticated but no profile, redirecting to role selection');
    return <Navigate to="/role-selection" replace />;
  }

  // If user is authenticated but no role selected, redirect to role selection
  if (requireAuth && user && userProfile && !userProfile.role) {
    console.log('[ProtectedRoute] User has profile but no role, redirecting to role selection');
    return <Navigate to="/role-selection" replace />;
  }

  // If jobseeker hasn't completed profile setup, redirect to profile setup
  if (
    requireAuth && 
    user && 
    userProfile && 
    userProfile.role === 'jobseeker' && 
    !userProfile.profile_complete && 
    location.pathname !== '/profile-setup' &&
    requireProfileComplete
  ) {
    console.log('[ProtectedRoute] Jobseeker profile incomplete, redirecting to profile setup');
    return <Navigate to="/profile-setup" replace />;
  }

  // Prevent completed profiles from accessing setup pages
  if (
    userProfile?.role === 'jobseeker' && 
    userProfile.profile_complete && 
    location.pathname === '/profile-setup'
  ) {
    console.log('[ProtectedRoute] Profile already complete, redirecting to home');
    return <Navigate to="/home" replace />;
  }

  // Prevent employers from accessing profile setup
  if (
    userProfile?.role === 'employer' && 
    location.pathname === '/profile-setup'
  ) {
    console.log('[ProtectedRoute] Employer accessing profile setup, redirecting to home');
    return <Navigate to="/home" replace />;
  }

  // Prevent users with roles from accessing role selection
  if (
    userProfile?.role && 
    location.pathname === '/role-selection'
  ) {
    console.log('[ProtectedRoute] User has role, redirecting from role selection');
    if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      return <Navigate to="/profile-setup" replace />;
    } else {
      return <Navigate to="/home" replace />;
    }
  }

  console.log('[ProtectedRoute] All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
