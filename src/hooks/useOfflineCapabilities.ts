
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface OfflineData {
  jobs: any[];
  workers: any[];
  messages: any[];
  profile: any;
  lastSync: string;
}

export const useOfflineCapabilities = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncDataWhenOnline();
    };

    const handleOffline = () => {
      setIsOnline(false);
      cacheCurrentData();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached data on mount
    loadCachedData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheCurrentData = () => {
    try {
      const dataToCache: OfflineData = {
        jobs: JSON.parse(localStorage.getItem('cached_jobs') || '[]'),
        workers: JSON.parse(localStorage.getItem('cached_workers') || '[]'),
        messages: JSON.parse(localStorage.getItem('cached_messages') || '[]'),
        profile: JSON.parse(localStorage.getItem('cached_profile') || 'null'),
        lastSync: new Date().toISOString()
      };
      
      localStorage.setItem('offline_data', JSON.stringify(dataToCache));
      setOfflineData(dataToCache);
    } catch (error) {
      console.error('Error caching data:', error);
    }
  };

  const loadCachedData = () => {
    try {
      const cached = localStorage.getItem('offline_data');
      if (cached) {
        setOfflineData(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const syncDataWhenOnline = () => {
    if (isOnline) {
      // Sync pending actions when back online
      const pendingActions = JSON.parse(localStorage.getItem('pending_actions') || '[]');
      
      pendingActions.forEach((action: any) => {
        // Process pending actions like job applications, messages, etc.
        console.log('Syncing pending action:', action);
      });

      // Clear pending actions after sync
      localStorage.removeItem('pending_actions');
    }
  };

  const addPendingAction = (action: any) => {
    const pending = JSON.parse(localStorage.getItem('pending_actions') || '[]');
    pending.push({
      ...action,
      timestamp: new Date().toISOString(),
      userId: user?.id
    });
    localStorage.setItem('pending_actions', JSON.stringify(pending));
  };

  return {
    isOnline,
    offlineData,
    addPendingAction,
    syncDataWhenOnline
  };
};
