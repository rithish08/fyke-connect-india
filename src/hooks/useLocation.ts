import { useState, useEffect, useCallback } from 'react';
import { geolocationService } from '@/services/geolocationService';

interface LocationState {
  lat: number | null;
  lng: number | null;
  address: string;
  error: string | null;
  loading: boolean;
}

interface GeocodeResponse {
  display_name: string;
  error?: string | { message: string };
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationState>({
    lat: null,
    lng: null,
    address: 'Loading location...',
    error: null,
    loading: true,
  });

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setLocation(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${lng}`);
      const data: GeocodeResponse = await response.json();

      if (response.ok && data.display_name) {
        const addressParts = data.display_name.split(',');
        const friendlyAddress = addressParts.length > 3 
          ? `${addressParts[addressParts.length - 4].trim()}, ${addressParts[addressParts.length - 2].trim()}`
          : data.display_name;
        setLocation(prev => ({ ...prev, lat, lng, address: friendlyAddress, loading: false }));
      } else {
        const errorMessage = typeof data.error === 'object' ? data.error.message : data.error;
        throw new Error(errorMessage || 'Failed to fetch address');
      }
    } catch (e) {
      const error = e as Error;
      console.error('Reverse geocoding error:', error);
      setLocation(prev => ({
        ...prev,
        address: 'Could not determine location',
        error: error.message,
        loading: false,
      }));
    }
  }, []);

  const getCurrentPosition = useCallback(async () => {
    setLocation(prev => ({ ...prev, loading: true, error: null, address: 'Finding location...' }));
    try {
      if (geolocationService.isSupported()) {
        const location = await geolocationService.getCurrentLocation();
        fetchAddress(location.latitude, location.longitude);
      } else {
        throw new Error('Geolocation not supported');
      }
    } catch (e) {
      const error = e as Error;
      console.error('Geolocation error:', error);
      // Fallback for generic error message
      let address = 'Location access denied.';
      if (error.message.toLowerCase().includes('unavailable')) {
        address = 'Location unavailable.';
      }
      
      setLocation({
        lat: null,
        lng: null,
        address,
        error: error.message,
        loading: false,
      });
    }
  }, [fetchAddress]);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return { ...location, refreshLocation: getCurrentPosition };
}; 