
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { CommunicationProvider } from "@/contexts/CommunicationContext";
import { useOfflineCapabilities } from "@/hooks/useOfflineCapabilities";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";

// Import all pages and components
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

const queryClient = new QueryClient();

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
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Navigate to="/language-selection" replace />} />
        <Route path="/language-selection" element={<LanguageSelection />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        
        {/* Semi-Protected Routes (require auth but not complete profile) */}
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
        
        {/* Fully Protected Routes (require auth and complete profile) */}
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
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect any unknown routes */}
        <Route path="*" element={<Navigate to="/language-selection" replace />} />
      </Routes>
      <OfflineIndicator />
    </div>
  );
};

function App() {
  return (
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
  );
}

export default App;
