
import React, { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { WifiOff, Wifi } from 'lucide-react';

const NetworkStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <ModernCard className={`px-4 py-2 shadow-lg ${
        isOnline 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-medium ${
            isOnline ? 'text-green-800' : 'text-red-800'
          }`}>
            {isOnline ? 'Back online' : 'No internet connection'}
          </span>
        </div>
      </ModernCard>
    </div>
  );
};

export default NetworkStatus;
