// All category IDs for subcategory seeding must match the 'id' field in the categories table
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
 * Calculate the distance (in meters and kilometers) between two lat/lng points using the Haversine formula.
 * @param lat1 Latitude of point 1
 * @param lng1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lng2 Longitude of point 2
 * @returns { meters: number, kilometers: number }
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371000; // Radius of Earth in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = R * c;
  return { meters, kilometers: meters / 1000 };
}

/**
 * Convert coordinates to area name using reverse geocoding
 */
export const getAreaFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    // Using Nominatim (OpenStreetMap) for reverse geocoding - free and no API key required
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const address = data.address;
      // Try to get the most specific area name
      const area = address.suburb || address.neighbourhood || address.quarter || address.road || address.locality;
      const city = address.city || address.town || address.village;
      const district = address.district;
      const state = address.state;
      const country = address.country;
      const postcode = address.postcode;
      const fullAddress = data.display_name;
      // Return the most specific location name available
      if (area && city) {
        return `${area}, ${city}`;
      } else if (area) {
        return area;
      } else if (city && district) {
        return `${city}, ${district}`;
      } else if (city) {
        return city;
      } else if (district) {
        // If only district, fallback to full address if available
        return fullAddress || district;
      } else if (state && country) {
        return `${state}, ${country}`;
      } else if (state) {
        return state;
      } else if (country) {
        return country;
      } else if (fullAddress) {
        return fullAddress;
      }
    }
    // Fallback: log the full response for debugging
    console.warn('Reverse geocoding fallback. Full response:', data);
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
