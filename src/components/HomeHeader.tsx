import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, MapPin } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { geolocationService } from '@/services/geolocationService';
import { getAreaFromCoordinates, isCoordinates, parsePointString } from '@/utils/locationUtils';

export function HomeHeader() {
  const { user } = useAuth();
  const { t } = useLocalization();
  const [location, setLocation] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoadingLocation(true);
      let coords: { lat: number; lng: number } | null = null;

      if (user?.location) {
        // First, try parsing as a PostGIS POINT string
        coords = parsePointString(user.location);
        
        // If that fails, check if it's a "lat,lng" string
        if (!coords && isCoordinates(user.location)) {
          const [lat, lng] = user.location.split(',').map(coord => parseFloat(coord.trim()));
          coords = { lat, lng };
        }
      } 
      
      // If location is not a point, maybe we have lat/lng fields
      if (!coords && user?.latitude && user?.longitude) {
        coords = { lat: user.latitude, lng: user.longitude };
      }

      // If still no coordinates, try to get current location from geolocation service
      if (!coords && geolocationService.isSupported()) {
        try {
          const currentLocation = await geolocationService.getCurrentLocation();
          coords = { lat: currentLocation.latitude, lng: currentLocation.longitude };
        } catch (error) {
          console.warn('Could not get current location:', error);
        }
      }

      if (coords) {
        try {
          const areaName = await getAreaFromCoordinates(coords.lat, coords.lng);
          setLocation(areaName);
        } catch (error) {
          console.error('Error fetching area from coordinates:', error);
          // Fallback to coordinates if geocoding fails
          setLocation(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        }
      } else if (user?.location) {
        // If it's not a point or coordinates, display it as is
        setLocation(user.location);
      } else {
        setLocation(t('location.notEnabled', 'Enable location services'));
      }

      setLoadingLocation(false);
    };

    fetchLocation();
  }, [user, t]);

  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <div className="flex items-center space-x-3">
        <Avatar>
          <AvatarImage src={user?.profilePhoto} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <span className="text-sm text-gray-500">{t('home.welcome', 'Welcome back,')}</span>
          <h1 className="font-bold text-lg">{user?.name}</h1>
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            {loadingLocation ? (
              <span className="italic">{t('location.loading', 'Fetching location...')}</span>
            ) : (
              <span>{location}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="w-6 h-6 text-gray-500" />
      </div>
    </header>
  );
}