
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { CommunicationProvider } from "@/contexts/CommunicationContext";
import { useOfflineCapabilities } from "@/hooks/useOfflineCapabilities";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import LanguageSelection from "./pages/LanguageSelection";
import RoleSelection from "./pages/RoleSelection";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/language-selection" element={<LanguageSelection />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/admin" element={<AdminLogin />} />
        
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/job-search" 
          element={
            <ProtectedRoute>
              <JobSearch />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/messaging" 
          element={
            <ProtectedRoute>
              <Messaging />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-jobs" 
          element={
            <ProtectedRoute>
              <MyJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post-job" 
          element={
            <ProtectedRoute>
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
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
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
