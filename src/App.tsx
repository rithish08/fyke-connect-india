
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { LocalizationProvider } from '@/contexts/LocalizationContext';
import { CommunicationProvider } from '@/contexts/CommunicationContext';
import RouteGuard from '@/components/RouteGuard';
import LanguageSelection from '@/pages/LanguageSelection';
import Login from '@/pages/Login';
import OTPVerification from '@/pages/OTPVerification';
import RoleSelection from '@/pages/RoleSelection';
import ProfileSetup from '@/pages/ProfileSetup';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import MyJobsPage from '@/pages/MyJobsPage';
import ProfilePage from '@/pages/ProfilePage';
import Messaging from '@/pages/Messaging';
import NotificationsPage from '@/pages/NotificationsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider>
        <AuthProvider>
          <CommunicationProvider>
            <Router>
              <div className="App">
                <Routes>
                  <Route path="/language" element={<LanguageSelection />} />
                  <Route path="/login" element={<Login />} />
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
                        <SearchPage />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/my-jobs"
                    element={
                      <RouteGuard>
                        <MyJobsPage />
                      </RouteGuard>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <RouteGuard>
                        <ProfilePage />
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
                        <NotificationsPage />
                      </RouteGuard>
                    }
                  />
                  <Route path="/" element={<LanguageSelection />} />
                </Routes>
                <Toaster />
              </div>
            </Router>
          </CommunicationProvider>
        </AuthProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}

export default App;
