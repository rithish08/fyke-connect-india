
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import StickyHeader from '@/components/layout/StickyHeader';
import DynamicRoleSwitcher from '@/components/layout/DynamicRoleSwitcher';
import { useUserFlow } from '@/hooks/useUserFlow';
import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const { translateText } = useTranslation();
  const { isFlowComplete } = useUserFlow();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Show verification prompt for unverified users after 3 seconds
    if (user && !user.verified) {
      const timer = setTimeout(() => setShowVerificationPrompt(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (!user || !isFlowComplete) {
    return null; // RouteGuard will handle redirects
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader currentTime={currentTime} />
      
      {/* Verification Alert */}
      {showVerificationPrompt && !user.verified && (
        <div className="px-4 py-2">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              <strong>Verify your account</strong> to unlock premium features and build trust with {user.role === 'jobseeker' ? 'employers' : 'workers'}.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Profile Completion Alert */}
      {user.role === 'jobseeker' && user.profileComplete && (
        <div className="px-4 py-2">
          <Alert className="border-green-200 bg-green-50">
            <Shield className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your profile is complete! You're ready to apply for jobs.
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Dynamic Role Switcher */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <DynamicRoleSwitcher />
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="pt-2 pb-20">
            {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
