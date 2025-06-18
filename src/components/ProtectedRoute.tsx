
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

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-white">F</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Public routes - no auth required
  if (!requireAuth) {
    // If user is already authenticated and on public route, redirect based on their state
    if (user && userProfile) {
      if (location.pathname === '/language-selection') {
        const selectedLanguage = localStorage.getItem('selectedLanguage');
        if (selectedLanguage) {
          if (!userProfile.role) {
            return <Navigate to="/role-selection" replace />;
          } else if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
            return <Navigate to="/profile-setup" replace />;
          } else {
            return <Navigate to="/home" replace />;
          }
        }
      }
    }
    return <>{children}</>;
  }

  // Check language selection first
  const selectedLanguage = localStorage.getItem('selectedLanguage');
  if (!selectedLanguage) {
    console.log('[ProtectedRoute] No language selected, redirecting to language selection');
    return <Navigate to="/language-selection" replace />;
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

  // Handle specific routes that shouldn't be accessible if not needed
  if (location.pathname === '/role-selection' && userProfile.role) {
    if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      console.log('[ProtectedRoute] Redirecting from role selection to profile setup');
      return <Navigate to="/profile-setup" replace />;
    } else {
      console.log('[ProtectedRoute] Redirecting from role selection to home');
      return <Navigate to="/home" replace />;
    }
  }

  if (location.pathname === '/profile-setup') {
    if (userProfile.role !== 'jobseeker' || userProfile.profile_complete) {
      console.log('[ProtectedRoute] Profile setup not needed, redirecting to home');
      return <Navigate to="/home" replace />;
    }
  }

  // Profile completion checks for specific routes that require it
  if (requireProfileComplete) {
    // Jobseekers need complete profile for most features
    if (userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      console.log('[ProtectedRoute] Jobseeker profile incomplete, redirecting to setup');
      return <Navigate to="/profile-setup" replace />;
    }
  }

  console.log('[ProtectedRoute] All checks passed, rendering children');
  return <>{children}</>;
};

export default ProtectedRoute;
