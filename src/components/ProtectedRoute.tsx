
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true, 
  requireAdmin = false 
}) => {
  const { user, userProfile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/language-selection" replace />;
  }

  // If admin access is required but user is not admin
  if (requireAdmin && userProfile?.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // If user is authenticated but no profile exists, redirect to role selection
  if (requireAuth && user && !userProfile) {
    return <Navigate to="/role-selection" replace />;
  }

  // If user is authenticated but no role selected, redirect to role selection
  if (requireAuth && user && userProfile && !userProfile.role) {
    return <Navigate to="/role-selection" replace />;
  }

  // If jobseeker hasn't completed profile setup, redirect to profile setup
  if (
    requireAuth && 
    user && 
    userProfile && 
    userProfile.role === 'jobseeker' && 
    !userProfile.profile_complete && 
    location.pathname !== '/profile-setup'
  ) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
