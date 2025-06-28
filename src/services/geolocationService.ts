// Geolocation service for handling location-based features
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface LocationError {
  code: number;
  message: string;
}

class GeolocationService {
  private currentLocation: LocationData | null = null;
  private watchId: number | null = null;
  private locationCallbacks: ((location: LocationData) => void)[] = [];
  private errorCallbacks: ((error: LocationError) => void)[] = [];

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): boolean {
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by this browser');
      return false;
    }
    return true;
  }

  async getCurrentLocation(options: PositionOptions = {}): Promise<LocationData> {
    if (!this.checkSupport()) {
      throw new Error('Geolocation not supported');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute cache
      ...options
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          
          this.currentLocation = location;
          resolve(location);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: this.getErrorMessage(error.code)
          };
          
          this.handleError(locationError);
          reject(locationError);
        },
        defaultOptions
      );
    });
  }

  async getCachedLocation(): Promise<LocationData | null> {
    if (this.currentLocation) {
      return this.currentLocation;
    }
    
    try {
      return await this.getCurrentLocation({ maximumAge: 300000 }); // 5 minutes cache
    } catch (error) {
      return null;
    }
  }

  startLocationTracking(
    onLocationUpdate: (location: LocationData) => void,
    onError?: (error: LocationError) => void,
    options: PositionOptions = {}
  ): boolean {
    if (!this.checkSupport()) {
      return false;
    }

    if (onLocationUpdate) {
      this.locationCallbacks.push(onLocationUpdate);
    }

    if (onError) {
      this.errorCallbacks.push(onError);
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000, // 30 seconds cache
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        };
        
        this.currentLocation = location;
        this.locationCallbacks.forEach(callback => callback(location));
      },
      (error) => {
        const locationError: LocationError = {
          code: error.code,
          message: this.getErrorMessage(error.code)
        };
        
        this.handleError(locationError);
      },
      defaultOptions
    );

    return true;
  }

  stopLocationTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    this.locationCallbacks = [];
    this.errorCallbacks = [];
  }

  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private getErrorMessage(code: number): string {
    switch (code) {
      case 1:
        return 'Location access denied by user';
      case 2:
        return 'Location unavailable';
      case 3:
        return 'Location request timed out';
      default:
        return 'Unknown location error';
    }
  }

  private handleError(error: LocationError): void {
    console.error('Geolocation error:', error);
    this.errorCallbacks.forEach(callback => callback(error));
  }

  // Method to check if location is within a certain radius
  isWithinRadius(
    centerLat: number,
    centerLon: number,
    radiusKm: number,
    targetLat?: number,
    targetLon?: number
  ): boolean {
    const lat = targetLat ?? this.currentLocation?.latitude;
    const lon = targetLon ?? this.currentLocation?.longitude;
    
    if (lat === undefined || lon === undefined) {
      return false;
    }
    
    const distance = this.calculateDistance(centerLat, centerLon, lat, lon);
    return distance <= radiusKm;
  }

  // Method to get nearby locations within a radius
  getNearbyLocations(
    locations: Array<{ latitude: number; longitude: number; [key: string]: any }>,
    radiusKm: number,
    centerLat?: number,
    centerLon?: number
  ): Array<{ latitude: number; longitude: number; distance: number; [key: string]: any }> {
    const lat = centerLat ?? this.currentLocation?.latitude;
    const lon = centerLon ?? this.currentLocation?.longitude;
    
    if (lat === undefined || lon === undefined) {
      return [];
    }
    
    return locations
      .map(location => ({
        ...location,
        distance: this.calculateDistance(lat, lon, location.latitude, location.longitude)
      }))
      .filter(location => location.distance <= radiusKm)
      .sort((a, b) => a.distance - b.distance);
  }

  // Method to format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    } else if (distanceKm < 10) {
      return `${distanceKm.toFixed(1)}km`;
    } else {
      return `${Math.round(distanceKm)}km`;
    }
  }

  // Method to get location from coordinates (reverse geocoding)
  async getLocationName(latitude: number, longitude: number): Promise<string> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch location name');
      }
      
      const data = await response.json();
      return data.display_name || 'Unknown location';
    } catch (error) {
      console.error('Error getting location name:', error);
      return 'Unknown location';
    }
  }

  // Method to get coordinates from location name (geocoding)
  async getCoordinates(locationName: string): Promise<LocationData | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }
      
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon)
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting coordinates:', error);
      return null;
    }
  }

  // Method to check if geolocation is supported
  isSupported(): boolean {
    return this.checkSupport();
  }

  // Method to get current location data
  getCurrentLocationData(): LocationData | null {
    return this.currentLocation;
  }

  // Method to check if location tracking is active
  isTracking(): boolean {
    return this.watchId !== null;
  }
}

export const geolocationService = new GeolocationService(); 