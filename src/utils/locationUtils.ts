import { geolocationService } from '@/services/geolocationService';

// Location utility functions for converting coordinates to area names

export interface LocationData {
  lat: number;
  lng: number;
  area?: string;
  city?: string;
  state?: string;
  fullAddress?: string;
}

/**
 * Convert coordinates to area name using reverse geocoding
 */
export const getAreaFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using Nominatim (OpenStreetMap) for reverse geocoding - free and no API key required
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      
      // Try to get the most specific area name
      const area = address.suburb || address.neighbourhood || address.quarter || address.district;
      const city = address.city || address.town || address.village;
      const state = address.state;
      
      // Return the most specific location name available
      if (area && city) {
        return `${area}, ${city}`;
      } else if (area) {
        return area;
      } else if (city && state) {
        return `${city}, ${state}`;
      } else if (city) {
        return city;
      } else if (state) {
        return state;
      }
    }
    
    // Fallback: return coordinates as string
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    
  } catch (error) {
    console.error('Error getting area from coordinates:', error);
    // Fallback: return coordinates as string
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
};

/**
 * Get current location and convert to area name
 */
export const getCurrentLocationArea = async (): Promise<{ area: string; lat: number; lng: number } | null> => {
  try {
    if (!geolocationService.isSupported()) {
      console.warn('Geolocation not supported');
      return null;
    }

    const location = await geolocationService.getCurrentLocation();
    const area = await getAreaFromCoordinates(location.latitude, location.longitude);
    
    return { 
      area, 
      lat: location.latitude, 
      lng: location.longitude 
    };
  } catch (error) {
    console.error('Error getting current location area:', error);
    return null;
  }
};

/**
 * Format location for display
 */
export const formatLocationDisplay = (location: string | undefined): string => {
  if (!location) return 'Location not set';
  
  // If it looks like coordinates, try to convert them
  if (location.includes(',') && !isNaN(Number(location.split(',')[0]))) {
    const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
    if (!isNaN(lat) && !isNaN(lng)) {
      // This is coordinates, we should convert them
      getAreaFromCoordinates(lat, lng).then(area => {
        // Note: This is async, so we can't return it directly
        // In practice, you'd want to update the user's location in the database
        console.log('Converted coordinates to area:', area);
      });
      return 'Converting location...';
    }
  }
  
  return location;
};

/**
 * Check if a string looks like coordinates
 */
export const isCoordinates = (location: string): boolean => {
  if (!location) return false;
  const parts = location.split(',').map(part => part.trim());
  if (parts.length !== 2) return false;
  
  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);
  
  return !isNaN(lat) && !isNaN(lng) && 
         lat >= -90 && lat <= 90 && 
         lng >= -180 && lng <= 180;
};

/**
 * Parses a PostGIS POINT string like "POINT(lng lat)" into coordinates.
 * @param pointString The location string from the database.
 * @returns An object with { lat, lng } or null if parsing fails.
 */
export const parsePointString = (pointString: string): { lat: number; lng: number } | null => {
  if (!pointString || !pointString.startsWith('POINT')) {
    return null;
  }
  const match = pointString.match(/POINT\(([-\d.]+) ([-\d.]+)\)/);
  if (match && match[1] && match[2]) {
    // Note: PostGIS is typically (longitude, latitude)
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }
  return null;
};
