
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import StickyHeader from '@/components/layout/StickyHeader';
import DynamicRoleSwitcher from '@/components/layout/DynamicRoleSwitcher';
import { useUserFlowNavigation } from '@/hooks/useUserFlowNavigation';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const { navigateToCorrectScreen, shouldRedirectFromCurrentPage } = useUserFlowNavigation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    console.log('HomePage - Component mounted, checking if redirect needed');
    
    // Only redirect if we should redirect from the current page
    if (shouldRedirectFromCurrentPage()) {
      console.log('HomePage - Redirect needed, calling navigateToCorrectScreen');
      navigateToCorrectScreen();
    }
  }, [isAuthenticated, user, shouldRedirectFromCurrentPage, navigateToCorrectScreen]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Show loading if user is not available yet
  if (!user) {
    console.log('HomePage - No user data, showing loading or redirecting');
    return null;
  }

  console.log('HomePage - Rendering home page for user:', { role: user.role, profileComplete: user.profileComplete });

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader currentTime={currentTime} />
      
      {/* Dynamic Role Switcher */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <DynamicRoleSwitcher />
      </div>
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="pt-4 pb-20">
            {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
