import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { JobProvider } from '@/contexts/JobContext';
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
import RequestsPage from './pages/Requests';
import Notifications from '@/pages/Notifications';
import PostJob from '@/pages/PostJob';
import JobDetails from '@/pages/JobDetails';
import WorkerProfile from '@/pages/WorkerProfile';
import NotFound from '@/pages/NotFound';
import EditJob from '@/pages/EditJob';
import { useState } from 'react';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import { ServiceInitializer } from '@/services/ServiceInitializer';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import BottomNavigation from '@/components/BottomNavigation';
import SEOHead from '@/components/SEOHead';
import PWAManifest from '@/components/PWAManifest';

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

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AccessibilityProvider>
          <LocalizationProvider>
          <AuthProvider>
            <JobProvider>
              <CommunicationProvider>
                <ServiceInitializer>
                  <Router>
                  <ErrorBoundary>
                  <SEOHead />
                  <PWAManifest />
                  <div className="App min-h-screen">
                    {showSplash ? (
                      <SplashScreen onComplete={() => setShowSplash(false)} />
                    ) : (
                    <>
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
                          path="/requests"
                          element={
                            <RouteGuard>
                              <RequestsPage />
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
                        <Route
                          path="/edit-job/:id"
                          element={
                            <RouteGuard>
                              <EditJob />
                            </RouteGuard>
                          }
                        />
                        <Route path="/" element={<LanguageSelection />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                      <BottomNavigation />
                    </>
                    )}
                    <Toaster />
                    <RatingBlocker />
                  </div>
                  </ErrorBoundary>
                  </Router>
                </ServiceInitializer>
              </CommunicationProvider>
            </JobProvider>
          </AuthProvider>
          </LocalizationProvider>
        </AccessibilityProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
