
interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
}

interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.isSupported = 'Notification' in window;
    if (this.isSupported) {
      this.permission = Notification.permission;
    }
  }

  // Request permission for notifications
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  // Send a local notification
  async sendNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported || this.permission !== 'granted') {
      console.warn('Notifications not available or permission not granted');
      return;
    }

    try {
      const notification = new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/favicon.ico',
        badge: payload.badge || '/favicon.ico',
        tag: payload.tag,
        data: payload.data,
        requireInteraction: true,
        silent: false
      });

      // Handle notification click
      notification.onclick = (event) => {
        event.preventDefault();
        window.focus();
        
        // Handle specific notification actions
        if (payload.data?.url) {
          window.open(payload.data.url, '_self');
        }
        
        notification.close();
      };

      // Auto close after 5 seconds if not interacted with
      setTimeout(() => {
        notification.close();
      }, 5000);

    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  // Predefined notification types for the job platform
  async sendJobAlert(jobTitle: string, company: string, location: string): Promise<void> {
    await this.sendNotification({
      title: 'New Job Alert! 🚀',
      body: `${jobTitle} at ${company} in ${location}`,
      icon: '/favicon.ico',
      tag: 'job-alert',
      data: { type: 'job', url: '/job-search' }
    });
  }

  async sendMessageNotification(senderName: string, message: string): Promise<void> {
    await this.sendNotification({
      title: `Message from ${senderName} 💬`,
      body: message.length > 50 ? message.substring(0, 50) + '...' : message,
      icon: '/favicon.ico',
      tag: 'message',
      data: { type: 'message', url: '/messages' }
    });
  }

  async sendApplicationUpdate(jobTitle: string, status: string): Promise<void> {
    const statusEmoji = status === 'accepted' ? '✅' : status === 'rejected' ? '❌' : '📝';
    
    await this.sendNotification({
      title: `Application Update ${statusEmoji}`,
      body: `Your application for ${jobTitle} has been ${status}`,
      icon: '/favicon.ico',
      tag: 'application-update',
      data: { type: 'application', url: '/my-jobs' }
    });
  }

  async sendHireRequest(workerName: string, jobTitle: string): Promise<void> {
    await this.sendNotification({
      title: 'New Hire Request! 💼',
      body: `${workerName} wants to hire you for ${jobTitle}`,
      icon: '/favicon.ico',
      tag: 'hire-request',
      data: { type: 'hire', url: '/messages' }
    });
  }

  async sendLocationBasedAlert(jobTitle: string, distance: string): Promise<void> {
    await this.sendNotification({
      title: 'Job Near You! 📍',
      body: `${jobTitle} is only ${distance} away from you`,
      icon: '/favicon.ico',
      tag: 'location-alert',
      data: { type: 'location-job', url: '/job-search' }
    });
  }

  // Schedule notifications (using setTimeout for simple implementation)
  scheduleNotification(payload: NotificationPayload, delayMs: number): void {
    setTimeout(() => {
      this.sendNotification(payload);
    }, delayMs);
  }

  // Check if notifications are supported and enabled
  isEnabled(): boolean {
    return this.isSupported && this.permission === 'granted';
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }

  // Clear all notifications with a specific tag
  clearNotifications(tag?: string): void {
    if ('serviceWorker' in navigator && 'getNotifications' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.getNotifications({ tag }).then((notifications) => {
          notifications.forEach((notification) => {
            notification.close();
          });
        });
      });
    }
  }
}

export const notificationService = new NotificationService();
export type { NotificationPayload, NotificationAction };
