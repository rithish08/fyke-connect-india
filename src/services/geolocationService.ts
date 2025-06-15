
interface Location {
  lat: number;
  lng: number;
  address?: string;
  area?: string;
}

interface GeolocationResult {
  location: Location | null;
  error: string | null;
}

class GeolocationService {
  private watchId: number | null = null;
  private lastKnownLocation: Location | null = null;

  // Get current position
  async getCurrentLocation(): Promise<GeolocationResult> {
    if (!navigator.geolocation) {
      return {
        location: null,
        error: 'Geolocation is not supported by this browser'
      };
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Try to get address
          try {
            const address = await this.reverseGeocode(location);
            location.address = address;
          } catch (error) {
            console.warn('Failed to get address:', error);
          }
          
          this.lastKnownLocation = location;
          resolve({ location, error: null });
        },
        (error) => {
          let errorMessage = 'Unable to retrieve location';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          resolve({ location: null, error: errorMessage });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  // Mock reverse geocoding (in production, use Google Maps API or similar)
  private async reverseGeocode(location: Location): Promise<string> {
    // Mock implementation - in production use actual geocoding service
    const areas = [
      'Koramangala', 'Whitefield', 'Electronic City', 'Marathahalli',
      'HSR Layout', 'Indiranagar', 'Jayanagar', 'BTM Layout',
      'Yelahanka', 'Rajajinagar', 'Malleshwaram', 'Banashankari'
    ];
    
    // Return a random area for demo purposes
    return areas[Math.floor(Math.random() * areas.length)];
  }

  // Watch position for real-time updates
  watchPosition(callback: (location: Location) => void): void {
    if (!navigator.geolocation) return;

    this.watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const location: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        try {
          const address = await this.reverseGeocode(location);
          location.address = address;
        } catch (error) {
          console.warn('Failed to get address:', error);
        }
        
        this.lastKnownLocation = location;
        callback(location);
      },
      (error) => {
        console.error('Position watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000 // 1 minute
      }
    );
  }

  // Stop watching position
  stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get last known location
  getLastKnownLocation(): Location | null {
    return this.lastKnownLocation;
  }

  // Check if location is within specified radius
  isWithinRadius(userLat: number, userLng: number, targetLat: number, targetLng: number, radiusKm: number): boolean {
    const distance = this.calculateDistance(userLat, userLng, targetLat, targetLng);
    return distance <= radiusKm;
  }

  // Get nearby items based on current location
  filterByDistance<T extends { lat: number; lng: number }>(
    items: T[], 
    userLocation: Location, 
    maxDistanceKm: number
  ): (T & { distance: number })[] {
    return items
      .map(item => ({
        ...item,
        distance: this.calculateDistance(userLocation.lat, userLocation.lng, item.lat, item.lng)
      }))
      .filter(item => item.distance <= maxDistanceKm)
      .sort((a, b) => a.distance - b.distance);
  }

  // Format distance for display
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm}km`;
  }
}

export const geolocationService = new GeolocationService();
export type { Location, GeolocationResult };
