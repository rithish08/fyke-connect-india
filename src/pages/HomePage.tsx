
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import AppHeader from '@/components/AppHeader';
import BannerAd from '@/components/BannerAd';
import ProfileProgress from '@/components/ProfileProgress';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white pb-20">
      <AppHeader currentTime={currentTime} />
      <div className="flex justify-center pt-0 sm:pt-2">
        <div className="w-full max-w-2xl">
          {showBanner && <BannerAd onClose={() => setShowBanner(false)} />}
          <ProfileProgress />
          <div className="pt-2">
            {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
          </div>
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
