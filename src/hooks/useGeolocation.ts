import { useState, useEffect } from 'react';
import { geolocationService } from '../services/geolocationService';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = (enabled: boolean = true) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!enabled) {
      setState(prevState => ({ ...prevState, loading: false }));
      return;
    }

    if (!geolocationService.isSupported()) {
      setState({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
      });
      return;
    }

    const getLocation = async () => {
      try {
        const location = await geolocationService.getCurrentLocation();
        setState({
          latitude: location.latitude,
          longitude: location.longitude,
          error: null,
          loading: false,
        });
      } catch (error: any) {
        setState({
          latitude: null,
          longitude: null,
          error: error.message || 'Failed to get location',
          loading: false,
        });
      }
    };

    getLocation();
  }, [enabled]);

  return state;
};

