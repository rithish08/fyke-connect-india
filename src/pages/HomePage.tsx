
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import JobSeekerHome from '@/components/JobSeekerHome';
import EmployerHome from '@/components/EmployerHome';
import MobileOptimizedHeader from '@/components/layout/MobileOptimizedHeader';
import EnhancedRoleSwitcher from '@/components/layout/EnhancedRoleSwitcher';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      <MobileOptimizedHeader currentTime={currentTime} />
      
      <div className="flex justify-center">
        <div className="w-full max-w-2xl">
          <div className="pt-2 pb-20">
            <EnhancedRoleSwitcher />
            {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
          </div>
        </div>
      </div>
      
      <MobileBottomNav />
    </div>
  );
};

export default HomePage;
