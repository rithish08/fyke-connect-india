
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { JobProvider } from '@/contexts/JobContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityProvider';
import RatingBlocker from '@/components/rating/RatingBlocker';
import RouteGuard from '@/components/RouteGuard';
import SplashScreen from '@/components/SplashScreen';
import LanguageSelection from '@/pages/LanguageSelection';
import LoginScreen from '@/pages/LoginScreen';
import OTPVerification from '@/pages/OTPVerification';
import RoleSelection from '@/pages/RoleSelection';
import ProfileSetup from '@/pages/ProfileSetup';
import HomePage from '@/pages/HomePage';
import JobSearch from '@/pages/JobSearch';
import MyJobs from '@/pages/MyJobs';
import Profile from '@/pages/Profile';
import Messaging from '@/pages/Messaging';
import Notifications from '@/pages/Notifications';
import PostJob from '@/pages/PostJob';
import JobDetails from '@/pages/JobDetails';
import WorkerProfile from '@/pages/WorkerProfile';
import { useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider>
          <SplashScreen onComplete={() => setShowSplash(false)} />
        </LocalizationProvider>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <LocalizationProvider>
          <AuthProvider>
            <NotificationProvider>
              <JobProvider>
                <Router>
                  <div className="App min-h-screen">
                    <Routes>
                      <Route path="/language" element={<LanguageSelection />} />
                      <Route path="/login" element={<LoginScreen />} />
                      <Route path="/otp-verification" element={<OTPVerification />} />
                      <Route
                        path="/role-selection"
                        element={
                          <RouteGuard>
                            <RoleSelection />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/profile-setup"
                        element={
                          <RouteGuard>
                            <ProfileSetup />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/home"
                        element={
                          <RouteGuard>
                            <HomePage />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/search"
                        element={
                          <RouteGuard>
                            <JobSearch />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/my-jobs"
                        element={
                          <RouteGuard>
                            <MyJobs />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <RouteGuard>
                            <Profile />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/messages"
                        element={
                          <RouteGuard>
                            <Messaging />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/notifications"
                        element={
                          <RouteGuard>
                            <Notifications />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/post-job"
                        element={
                          <RouteGuard>
                            <PostJob />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/job/:id"
                        element={
                          <RouteGuard>
                            <JobDetails />
                          </RouteGuard>
                        }
                      />
                      <Route
                        path="/worker/:id"
                        element={
                          <RouteGuard>
                            <WorkerProfile />
                          </RouteGuard>
                        }
                      />
                      <Route path="/" element={<LanguageSelection />} />
                    </Routes>
                    <Toaster />
                    <RatingBlocker />
                  </div>
                </Router>
              </JobProvider>
            </NotificationProvider>
          </AuthProvider>
        </LocalizationProvider>
      </AccessibilityProvider>
    </QueryClientProvider>
  );
}

export default App;
