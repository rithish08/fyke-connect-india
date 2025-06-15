
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import StickyHeader from '@/components/layout/StickyHeader';
import DynamicRoleSwitcher from '@/components/layout/DynamicRoleSwitcher';
import { useUserFlow } from '@/hooks/useUserFlow';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { userProfile } = useAuth();
  const { t } = useLocalization();
  const { isFlowComplete } = useUserFlow();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle role switching redirect logic
  useEffect(() => {
    if (userProfile && userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      console.log('Jobseeker without completed profile detected, redirecting to profile setup');
      navigate('/profile-setup');
    }
  }, [userProfile, navigate]);

  if (!userProfile || !isFlowComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader currentTime={currentTime} />
      <div className="px-4 py-2 bg-gray-50 border-b">
        <DynamicRoleSwitcher />
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-2xl px-2 sm:px-0">
          <div className="pt-4 pb-20">
            <h1 className="sr-only">{t('home.title', 'Home')}</h1>
            {userProfile.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};
export default HomePage;
