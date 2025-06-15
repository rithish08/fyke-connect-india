
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Geolocation } from '@capacitor/geolocation';

class CapacitorService {
  static async initializePushNotifications() {
    if (!Capacitor.isNativePlatform()) return;

    try {
      await PushNotifications.requestPermissions();
      await PushNotifications.register();

      PushNotifications.addListener('registration', (token) => {
        console.log('Push registration success, token:', token.value);
      });

      PushNotifications.addListener('registrationError', (error) => {
        console.error('Error on registration:', JSON.stringify(error));
      });

      PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push notification received:', notification);
      });

      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Push notification action performed:', notification);
      });
    } catch (error) {
      console.error('Push notification setup failed:', error);
    }
  }

  static async scheduleLocalNotification(title: string, body: string, id: number) {
    if (!Capacitor.isNativePlatform()) {
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
    if (!Capacitor.isNativePlatform()) {
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
