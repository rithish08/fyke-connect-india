
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import StickyHeader from '@/components/layout/StickyHeader';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

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
    <div className="min-h-screen bg-white">
      <StickyHeader currentTime={currentTime} />
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
