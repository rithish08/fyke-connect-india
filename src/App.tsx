
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
import OnboardingSlides from "./components/OnboardingSlides";
import LanguageSelection from "./pages/LanguageSelection";
import RoleSelection from "./pages/RoleSelection";
import LoginScreen from "./pages/LoginScreen";
import OTPVerification from "./pages/OTPVerification";
import HomePage from "./pages/HomePage";
import ProfileSetup from "./pages/ProfileSetup";
import JobSearchPage from "./components/search/JobSearchPage";
import MessagingPage from "./components/messaging/MessagingPage";
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
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('fyke_onboarding_seen');
    
    const timer = setTimeout(() => {
      setShowSplash(false);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('fyke_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('fyke_onboarding_seen', 'true');
    setShowOnboarding(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  if (showOnboarding) {
    return (
      <OnboardingSlides 
        onComplete={handleOnboardingComplete}
        onSkip={handleOnboardingSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Routes>
        <Route path="/" element={<Navigate to="/language-selection" replace />} />
        
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
              <JobSearchPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messaging" 
          element={
            <ProtectedRoute requireAuth={true} requireProfileComplete={true}>
              <MessagingPage />
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
        
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
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
