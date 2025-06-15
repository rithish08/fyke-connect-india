
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
    loading,
    requireAuth,
    requireAdmin,
    requireProfileComplete
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

  // Public routes - no auth required
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Check authentication requirement
  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check admin requirement
  if (requireAdmin && userProfile?.role !== 'admin') {
    console.log('[ProtectedRoute] Admin required but user is not admin');
    return <Navigate to="/home" replace />;
  }

  // If no profile exists, redirect to role selection
  if (!userProfile) {
    console.log('[ProtectedRoute] No profile, redirecting to role selection');
    return <Navigate to="/role-selection" replace />;
  }

  // If no role selected, redirect to role selection
  if (!userProfile.role) {
    console.log('[ProtectedRoute] No role, redirecting to role selection');
    return <Navigate to="/role-selection" replace />;
  }

  // Profile completion checks
  if (requireProfileComplete) {
    // Jobseekers need complete profile
    if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      console.log('[ProtectedRoute] Jobseeker profile incomplete, redirecting to setup');
      return <Navigate to="/profile-setup" replace />;
    }
  }

  // Prevent access to setup pages if not needed
  if (location.pathname === '/profile-setup') {
    if (userProfile.role === 'employer' || 
        (userProfile.role === 'jobseeker' && userProfile.profile_complete)) {
      console.log('[ProtectedRoute] Profile setup not needed, redirecting to home');
      return <Navigate to="/home" replace />;
    }
  }

  // Prevent access to role selection if role already set
  if (location.pathname === '/role-selection' && userProfile.role) {
    if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      console.log('[ProtectedRoute] Redirecting from role selection to profile setup');
      return <Navigate to="/profile-setup" replace />;
    } else {
      console.log('[ProtectedRoute] Redirecting from role selection to home');
      return <Navigate to="/home" replace />;
    }
  }

  console.log('[ProtectedRoute] All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
