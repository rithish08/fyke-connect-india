
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import StickyHeader from '@/components/layout/StickyHeader';
import DynamicRoleSwitcher from '@/components/layout/DynamicRoleSwitcher';
import { useUserFlow } from '@/hooks/useUserFlow';
import { useState, useEffect } from 'react';

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const { isFlowComplete } = useUserFlow();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user || !isFlowComplete) {
    return null; // RouteGuard will handle redirects
  }

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
