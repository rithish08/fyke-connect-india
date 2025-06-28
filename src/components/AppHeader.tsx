import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Bell, Menu, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocalization } from '@/contexts/LocalizationContext';
import { getAreaFromCoordinates, isCoordinates, parsePointString } from '@/utils/locationUtils';

interface AppHeaderProps {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  showSearch?: boolean;
  showFilter?: boolean;
  title?: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  onMenuClick,
  onSearchClick,
  onFilterClick,
  showSearch = true,
  showFilter = true,
  title
}) => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const [locationDisplay, setLocationDisplay] = useState('');
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const processLocation = async () => {
      setLoadingLocation(true);
      let coords: { lat: number; lng: number } | null = null;

      if (user?.location) {
        coords = parsePointString(user.location);
        if (!coords && isCoordinates(user.location)) {
          const [lat, lng] = user.location.split(',').map(coord => parseFloat(coord.trim()));
          coords = { lat, lng };
        }
      }

      if (!coords && user?.latitude && user?.longitude) {
        coords = { lat: user.latitude, lng: user.longitude };
      }

      if (coords) {
        try {
          const areaName = await getAreaFromCoordinates(coords.lat, coords.lng);
          setLocationDisplay(areaName);
        } catch (error) {
          console.error('Error fetching area from coordinates:', error);
          setLocationDisplay(`${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`);
        }
      } else if (user?.location) {
        setLocationDisplay(user.location);
      } else {
        setLocationDisplay('');
      }
      setLoadingLocation(false);
    };

    if (user) {
      processLocation();
    } else {
      setLoadingLocation(false);
      setLocationDisplay('');
    }
  }, [user]);

  return (
    <>
      <div className="relative bg-white p-0 shadow-sm w-full border-b border-gray-100">
        <div className="flex items-center justify-between h-16 px-4">
          <div>
            <span 
              className="font-black text-3xl tracking-tighter text-black"
              style={{ fontFamily: "sans-serif" }}
            >
              fyke
            </span>
            {locationDisplay && (
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-600">
                  {loadingLocation ? 'Loading...' : locationDisplay}
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {showSearch && (
              <Button variant="ghost" size="icon" onClick={onSearchClick} className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
            )}
            {showFilter && (
              <Button variant="ghost" size="icon" onClick={onFilterClick} className="h-9 w-9">
                <Filter className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Bell className="h-4 w-4" />
            </Button>
            {onMenuClick && (
              <Button variant="ghost" size="icon" onClick={onMenuClick} className="h-9 w-9">
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {title && (
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default AppHeader;

