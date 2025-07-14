import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';
import { geolocationService } from '@/services/geolocationService';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceInitializerProps {
  children: React.ReactNode;
}

const ServiceInitializer: React.FC<ServiceInitializerProps> = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize notification service
    const initNotifications = async () => {
      try {
        // Request notification permission if not already granted
        if (notificationService.isSupported() && Notification.permission === 'default') {
          await notificationService.requestPermission();
        }

        // Send welcome notification if user is logged in and permission granted
        if (user && notificationService.hasNotificationPermission()) {
          await notificationService.sendWelcomeNotification();
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    // Initialize geolocation service
    const initGeolocation = async () => {
      try {
        if (geolocationService.isSupported()) {
          // Get initial location
          await geolocationService.getCurrentLocation();
          
          // Start location tracking for real-time updates
          geolocationService.startLocationTracking(
            (location) => {
              console.log('Location updated:', location);
              // You can store this in global state or context if needed
            },
            (error) => {
              console.error('Geolocation error:', error);
            }
          );
        }
      } catch (error) {
        console.error('Error initializing geolocation:', error);
      }
    };

    initNotifications();
    initGeolocation();

    // Cleanup function
    return () => {
      if (geolocationService.isTracking()) {
        geolocationService.stopLocationTracking();
      }
    };
  }, [user]);

  return <>{children}</>;
};

export default ServiceInitializer; 