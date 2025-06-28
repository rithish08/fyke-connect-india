import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService } from './notificationService';

// Initialize core services when app starts
export const ServiceInitializer: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize notification service
    notificationService.init();
    
    // Initialize other services here
    console.log('Core services initialized');
    
    return () => {
      // Cleanup notification service
      notificationService.cleanup();
    };
  }, [user]);

  return <>{children}</>;
};
