// Minimal CapacitorService for web compatibility
export default class CapacitorService {
  static async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocation not supported'));
      }
    });
  }
  static isNative() {
    return false;
  }
  static getPlatform() {
    return 'web';
  }
} 