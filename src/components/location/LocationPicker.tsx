import React, { useState } from 'react';
import { MapPin, Target, Navigation, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { geolocationService } from '@/services/geolocationService';

export interface Location {
  lat: number;
  lng: number;
  address: string;
  area: string;
}

interface LocationPickerProps {
  onLocationSelect: (location: Location) => void;
  currentLocation?: Location;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationSelect, currentLocation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);
  const [nearbyAreas] = useState([
    'Koramangala', 'Whitefield', 'Electronic City', 'Marathahalli', 
    'HSR Layout', 'Indiranagar', 'Jayanagar', 'BTM Layout'
  ]);

  const detectLocation = async () => {
    setIsDetecting(true);
    try {
      if (geolocationService.isSupported()) {
        const location = await geolocationService.getCurrentLocation();
        const locationData: Location = {
          lat: location.latitude,
          lng: location.longitude,
          address: 'Current Location',
          area: 'Auto-detected'
        };
        onLocationSelect(locationData);
      } else {
        console.error('Geolocation not supported');
      }
    } catch (error) {
      console.error('Location detection failed:', error);
    } finally {
      setIsDetecting(false);
    }
  };

  const selectArea = (area: string) => {
    const location: Location = {
      lat: 12.9716 + Math.random() * 0.1,
      lng: 77.5946 + Math.random() * 0.1,
      address: area,
      area: area
    };
    onLocationSelect(location);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search area or landmark..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={detectLocation} 
          disabled={isDetecting}
          variant="outline"
          size="icon"
        >
          {isDetecting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {nearbyAreas
          .filter(area => area.toLowerCase().includes(searchQuery.toLowerCase()))
          .map((area) => (
            <Button
              key={area}
              variant="outline"
              onClick={() => selectArea(area)}
              className="justify-start text-left"
            >
              <MapPin className="w-4 h-4 mr-2" />
              {area}
            </Button>
          ))}
      </div>

      {currentLocation && (
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center text-blue-700">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">{currentLocation.area}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
