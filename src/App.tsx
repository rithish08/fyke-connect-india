
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import NetworkStatus from "./components/common/NetworkStatus";
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
          <NetworkStatus />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LanguageSelection />} />
              <Route path="/role-selection" element={<RoleSelection />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/otp-verification" element={<OTPVerification />} />
              <Route path="/profile-setup" element={<ProfileSetup />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/search" element={<JobSearch />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/worker/:id" element={<WorkerProfile />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route path="/my-jobs" element={<MyJobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/messages" element={<Messaging />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </LocalizationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
