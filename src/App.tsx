
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { CommunicationProvider } from "@/contexts/CommunicationContext";
import { useOfflineCapabilities } from "@/hooks/useOfflineCapabilities";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppErrorBoundary from "@/components/AppErrorBoundary";
import { useState, useEffect } from "react";

import SplashScreen from "./components/SplashScreen";
import LanguageSelection from "./pages/LanguageSelection";
import RoleSelection from "./pages/RoleSelection";
import LoginScreen from "./pages/LoginScreen";
import OTPVerification from "./pages/OTPVerification";
import HomePage from "./pages/HomePage";
import ProfileSetup from "./pages/ProfileSetup";
import JobSearch from "./pages/JobSearch";
import Messaging from "./pages/Messaging";
import Profile from "./pages/Profile";
import MyJobs from "./pages/MyJobs";
import PostJob from "./pages/PostJob";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import OfflineIndicator from "./components/common/OfflineIndicator";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppContent = () => {
  useOfflineCapabilities();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        {/* Default redirect to language selection */}
        <Route path="/" element={<Navigate to="/language-selection" replace />} />
        
        {/* Public routes */}
        <Route 
          path="/language-selection" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LanguageSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LoginScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/otp-verification" 
          element={
            <ProtectedRoute requireAuth={false}>
              <OTPVerification />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin-login" 
          element={
            <ProtectedRoute requireAuth={false}>
              <AdminLogin />
            </ProtectedRoute>
          } 
        />
        
        {/* Authenticated routes - setup flow */}
        <Route 
          path="/role-selection" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={false}>
              <RoleSelection />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={false}>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        
        {/* Main app routes - require complete profile */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <JobSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messaging" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <Messaging />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-jobs" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <MyJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post-job" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <PostJob />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to language selection */}
        <Route path="*" element={<Navigate to="/language-selection" replace />} />
      </Routes>
      <OfflineIndicator />
    </div>
  );
};

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <LocalizationProvider>
                <CommunicationProvider>
                  <AppContent />
                  <Toaster />
                </CommunicationProvider>
              </LocalizationProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;
