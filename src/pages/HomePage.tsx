
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import RoleSwitcher from '@/components/RoleSwitcher';
import HomeHeader from '@/components/HomeHeader';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <HomeHeader currentTime={currentTime} />
      
      <RoleSwitcher />

      <div className="pt-4">
        {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
