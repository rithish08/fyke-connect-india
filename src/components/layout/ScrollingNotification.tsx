
import React, { useState, useEffect } from 'react';
import { Star, MapPin, Clock } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'worker' | 'job' | 'update';
  title: string;
  subtitle?: string;
  rating?: number;
  distance?: string;
  category?: string;
  urgent?: boolean;
}

const ScrollingNotification = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const notifications: NotificationItem[] = [
    {
      id: '1',
      type: 'worker',
      title: 'Top Worker Nearby',
      subtitle: 'Raj Kumar - Construction',
      rating: 4.8,
      distance: '1.2km',
      category: 'Construction'
    },
    {
      id: '2',
      type: 'job',
      title: 'New Urgent Job',
      subtitle: 'House Cleaning - ₹400/hr',
      urgent: true
    },
    {
      id: '3',
      type: 'worker',
      title: 'Verified Worker Available',
      subtitle: 'Amit Singh - Delivery',
      rating: 4.6,
      distance: '2.1km',
      category: 'Delivery'
    },
    {
      id: '4',
      type: 'update',
      title: '12 New Workers Online',
      subtitle: 'in your area'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [notifications.length]);

  const currentNotification = notifications[currentIndex];

  const renderNotificationContent = () => {
    switch (currentNotification.type) {
      case 'worker':
        return (
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800 text-sm">
                  {currentNotification.title}
                </span>
                {currentNotification.rating && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" />
                    <span className="text-xs font-medium text-gray-600">
                      {currentNotification.rating}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xs text-gray-500">
                  {currentNotification.subtitle}
                </span>
                {currentNotification.distance && (
                  <>
                    <span className="text-xs text-gray-300">•</span>
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 text-gray-400 mr-0.5" />
                      <span className="text-xs text-gray-500">
                        {currentNotification.distance}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        );
      case 'job':
        return (
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-800 text-sm">
                  {currentNotification.title}
                </span>
                {currentNotification.urgent && (
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                    Urgent
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 mt-0.5 block">
                {currentNotification.subtitle}
              </span>
            </div>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <span className="font-medium text-gray-800 text-sm">
                {currentNotification.title}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                {currentNotification.subtitle}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-4 py-2 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        {renderNotificationContent()}
      </div>
    </div>
  );
};

export default ScrollingNotification;
