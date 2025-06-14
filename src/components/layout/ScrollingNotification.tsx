
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface NotificationItem {
  type: 'worker' | 'job' | 'general';
  content: string;
  icon?: React.ReactNode;
  highlight?: string;
}

const ScrollingNotification: React.FC = () => {
  const { t } = useLocalization();
  const [currentIndex, setCurrentIndex] = useState(0);

  const notifications: NotificationItem[] = [
    {
      type: 'worker',
      content: 'Top Worker Nearby',
      icon: <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />,
      highlight: '⭐4.9 | 2.1km | Plumber'
    },
    {
      type: 'worker', 
      content: 'Available Now',
      icon: <Clock className="w-3 h-3 text-green-400" />,
      highlight: 'Electrician | ₹450/hr | < 30min'
    },
    {
      type: 'job',
      content: 'New Jobs Posted',
      icon: <MapPin className="w-3 h-3 text-blue-400" />,
      highlight: '12 jobs in your area'
    },
    {
      type: 'general',
      content: 'Quick Hire Available',
      highlight: 'Connect instantly with verified workers'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const currentNotification = notifications[currentIndex];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-blue-100">
      <div className="px-4 py-2">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <div className="flex items-center space-x-1 text-gray-700 font-medium">
            {currentNotification.icon}
            <span className="text-xs">{currentNotification.content}:</span>
          </div>
          <div className="text-xs text-gray-600 font-medium animate-pulse">
            {currentNotification.highlight}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollingNotification;
