
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import RouteGuard from "./components/RouteGuard";
import LanguageSelection from "./pages/LanguageSelection";
import RoleSelection from "./pages/RoleSelection";
import LoginScreen from "./pages/LoginScreen";
import OTPVerification from "./pages/OTPVerification";
import HomePage from "./pages/HomePage";
import JobSearch from "./pages/JobSearch";
import JobDetails from "./pages/JobDetails";
import MyJobs from "./pages/MyJobs";
import Profile from "./pages/Profile";
import Messaging from "./pages/Messaging";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";
import ProfileSetup from "./pages/ProfileSetup";
import PostJob from "./pages/PostJob";
import WorkerProfile from "./pages/WorkerProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LocalizationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes - start from language selection */}
              <Route path="/" element={<LanguageSelection />} />
              <Route path="/role-selection" element={
                <RouteGuard requireAuth={false}>
                  <RoleSelection />
                </RouteGuard>
              } />
              <Route path="/login" element={
                <RouteGuard requireAuth={false}>
                  <LoginScreen />
                </RouteGuard>
              } />
              <Route path="/otp-verification" element={
                <RouteGuard requireAuth={false}>
                  <OTPVerification />
                </RouteGuard>
              } />
              
              {/* Semi-protected routes */}
              <Route path="/profile-setup" element={
                <RouteGuard requireAuth={true} requireProfile={false}>
                  <ProfileSetup />
                </RouteGuard>
              } />
              
              {/* Protected routes */}
              <Route path="/home" element={
                <RouteGuard>
                  <HomePage />
                </RouteGuard>
              } />
              <Route path="/search" element={
                <RouteGuard>
                  <JobSearch />
                </RouteGuard>
              } />
              <Route path="/job/:id" element={
                <RouteGuard>
                  <JobDetails />
                </RouteGuard>
              } />
              <Route path="/worker/:id" element={
                <RouteGuard>
                  <WorkerProfile />
                </RouteGuard>
              } />
              <Route path="/post-job" element={
                <RouteGuard>
                  <PostJob />
                </RouteGuard>
              } />
              <Route path="/my-jobs" element={
                <RouteGuard>
                  <MyJobs />
                </RouteGuard>
              } />
              <Route path="/profile" element={
                <RouteGuard>
                  <Profile />
                </RouteGuard>
              } />
              <Route path="/messages" element={
                <RouteGuard>
                  <Messaging />
                </RouteGuard>
              } />
              <Route path="/notifications" element={
                <RouteGuard>
                  <Notifications />
                </RouteGuard>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
