import { useState, useEffect, useCallback } from 'react';
import { geolocationService } from '@/services/geolocationService';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  error: string | null;
  loading: boolean;
  locationName: string | null;
}

export const useEnhancedGeolocation = (enabled: boolean = true, autoTrack: boolean = false) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
    error: null,
    loading: true,
    locationName: null,
  });

  const getCurrentLocation = useCallback(async () => {
    if (!enabled) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    if (!geolocationService.isSupported()) {
      setState({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: 'Geolocation is not supported by your browser.',
        loading: false,
        locationName: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const location = await geolocationService.getCurrentLocation();
      
      // Get location name
      let locationName = null;
      try {
        locationName = await geolocationService.getLocationName(location.latitude, location.longitude);
      } catch (error) {
        console.warn('Could not get location name:', error);
      }

      setState({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy || null,
        timestamp: location.timestamp || null,
        error: null,
        loading: false,
        locationName,
      });
    } catch (error: any) {
      setState({
        latitude: null,
        longitude: null,
        accuracy: null,
        timestamp: null,
        error: error.message || 'Failed to get location',
        loading: false,
        locationName: null,
      });
    }
  }, [enabled]);

  const startTracking = useCallback(() => {
    if (!enabled || !geolocationService.isSupported()) {
      return false;
    }

    return geolocationService.startLocationTracking(
      (location) => {
        setState(prev => ({
          ...prev,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy || null,
          timestamp: location.timestamp || null,
          error: null,
        }));
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
        }));
      }
    );
  }, [enabled]);

  const stopTracking = useCallback(() => {
    geolocationService.stopLocationTracking();
  }, []);

  const calculateDistance = useCallback((lat: number, lng: number) => {
    if (!state.latitude || !state.longitude) {
      return null;
    }
    return geolocationService.calculateDistance(state.latitude, state.longitude, lat, lng);
  }, [state.latitude, state.longitude]);

  const formatDistance = useCallback((distanceKm: number) => {
    return geolocationService.formatDistance(distanceKm);
  }, []);

  const isWithinRadius = useCallback((centerLat: number, centerLon: number, radiusKm: number) => {
    return geolocationService.isWithinRadius(centerLat, centerLon, radiusKm, state.latitude || undefined, state.longitude || undefined);
  }, [state.latitude, state.longitude]);

  useEffect(() => {
    getCurrentLocation();

    if (autoTrack) {
      startTracking();
    }

    return () => {
      if (autoTrack) {
        stopTracking();
      }
    };
  }, [getCurrentLocation, autoTrack, startTracking, stopTracking]);

  return {
    ...state,
    getCurrentLocation,
    startTracking,
    stopTracking,
    calculateDistance,
    formatDistance,
    isWithinRadius,
    isTracking: geolocationService.isTracking(),
    isSupported: geolocationService.isSupported(),
  };
}; 