
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import UnifiedHeader from '@/components/layout/UnifiedHeader';
import GamefiedProfileProgress from '@/components/GamefiedProfileProgress';
import { useUserFlow } from '@/hooks/useUserFlow';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { userProfile, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const { isFlowComplete } = useUserFlow();
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userProfile && userProfile.role === 'jobseeker' && !userProfile.profile_complete) {
      console.log('Jobseeker without completed profile detected, redirecting to profile setup');
      navigate('/profile-setup');
    }
  }, [userProfile, isAuthenticated, navigate]);

  if (!userProfile || !isFlowComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-blue-600 shadow-xl flex items-center justify-center mx-auto">
            <span className="text-3xl font-bold text-white" style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>fyke</span>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <UnifiedHeader currentTime={currentTime} />
      <div className="flex justify-center">
        <div className="w-full max-w-2xl px-2 sm:px-0">
          <div className="pt-4 pb-20">
            <h1 className="sr-only">{t('home.title', 'Home')}</h1>
            <GamefiedProfileProgress />
            {userProfile.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
