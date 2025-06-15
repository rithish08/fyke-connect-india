
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StickyHeader from '@/components/layout/StickyHeader';
import BottomNavigation from '@/components/BottomNavigation';
import JobSeekerMyJobs from '@/components/jobseeker/JobSeekerMyJobs';
import EmployerMyJobs from '@/components/employer/EmployerMyJobs';

const MyJobs = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader currentTime={currentTime} />
      <div className="pt-24 pb-20">
        {user?.role === 'jobseeker' ? <JobSeekerMyJobs /> : <EmployerMyJobs />}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default MyJobs;
