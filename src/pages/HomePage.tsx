
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import StickyHeader from '@/components/layout/StickyHeader';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerHome from '@/components/jobseeker/JobSeekerHome';
import EmployerHome from '@/components/employer/EmployerHome';
import { SkeletonJobCard, SkeletonWorkerCard } from '@/components/ui/skeleton-cards';

const HomePage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && (!user || !user.role)) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white">
        <StickyHeader currentTime={currentTime} />
        <div className="pt-24 pb-20 px-4">
          <div className="max-w-2xl mx-auto space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i}>
                {user?.role === 'employer' ? <SkeletonWorkerCard /> : <SkeletonJobCard />}
              </div>
            ))}
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader currentTime={currentTime} />
      <div className="pt-24 pb-20">
        {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomePage;
