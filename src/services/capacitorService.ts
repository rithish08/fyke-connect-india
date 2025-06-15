
import { Capacitor } from '@capacitor/core';

// Conditional imports to handle environments where plugins might not be available
let PushNotifications: any = null;
let LocalNotifications: any = null;
let Geolocation: any = null;

try {
  if (Capacitor.isNativePlatform()) {
    PushNotifications = require('@capacitor/push-notifications').PushNotifications;
    LocalNotifications = require('@capacitor/local-notifications').LocalNotifications;
    Geolocation = require('@capacitor/geolocation').Geolocation;
  }
} catch (error) {
  console.warn('Capacitor plugins not available:', error);
}

class CapacitorService {
  static async initializePushNotifications() {
    if (!Capacitor.isNativePlatform() || !PushNotifications) return;

    try {
      await PushNotifications.requestPermissions();
      await PushNotifications.register();

      PushNotifications.addListener('registration', (token: any) => {
        console.log('Push registration success, token:', token.value);
      });

      PushNotifications.addListener('registrationError', (error: any) => {
        console.error('Error on registration:', JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification: any) => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification: any) => {
        console.log('Push notification action performed:', notification);
      });
    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  }

  static async scheduleLocalNotification(title: string, body: string, id: number) {
    if (!Capacitor.isNativePlatform() || !LocalNotifications) {
      // Fallback for web
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
      return;
    }

    try {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body,
            id,
            schedule: { at: new Date(Date.now() + 1000 * 5) }, // 5 seconds from now
            sound: 'beep.wav',
            attachments: [],
            actionTypeId: '',
            extra: {}
          }
        ]
      });
    } catch (error) {
      console.error('Local notification failed:', error);
    }
  }

  static async getCurrentPosition() {
    if (!Capacitor.isNativePlatform() || !Geolocation) {
      // Fallback to web geolocation
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    }

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return coordinates;
    } catch (error) {
      console.error('Geolocation failed:', error);
      throw error;
    }
  }

  static isNative() {
    return Capacitor.isNativePlatform();
  }

  static getPlatform() {
    return Capacitor.getPlatform();
  }
}

export default CapacitorService;
