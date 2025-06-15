
import React, { useState, useEffect } from 'react';
import StickyHeader from '@/components/layout/StickyHeader';
import BottomNavigation from '@/components/BottomNavigation';
import NotificationsList from '@/components/notifications/NotificationsList';

const Notifications = () => {
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
        <NotificationsList />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Notifications;
