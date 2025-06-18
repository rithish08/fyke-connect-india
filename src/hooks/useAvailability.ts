
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useAvailability = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [isAvailable, setIsAvailable] = useState(userProfile?.availability === 'available');

  // Auto-reset availability every hour
  useEffect(() => {
    const timer = setInterval(() => {
      if (isAvailable) {
        setIsAvailable(false);
        updateUserProfile({ availability: 'busy' });
        console.log('[useAvailability] Auto-reset availability to busy after 1 hour');
      }
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(timer);
  }, [isAvailable, updateUserProfile]);

  const toggleAvailability = async () => {
    const newAvailability = isAvailable ? 'busy' : 'available';
    setIsAvailable(!isAvailable);
    
    try {
      await updateUserProfile({ availability: newAvailability });
      console.log(`[useAvailability] Updated availability to: ${newAvailability}`);
    } catch (error) {
      console.error('[useAvailability] Failed to update availability:', error);
      // Revert on error
      setIsAvailable(isAvailable);
    }
  };

  return {
    isAvailable,
    toggleAvailability,
    availability: userProfile?.availability || 'busy'
  };
};
