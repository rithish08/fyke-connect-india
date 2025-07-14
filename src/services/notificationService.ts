import { toast } from '@/hooks/use-toast';

class NotificationService {
  async init() {
    console.log('Initializing notification service');
  }

  cleanup() {
    console.log('Cleaning up notification service');
  }

  isSupported() {
    return 'Notification' in window;
  }

  async getPermissionStatus() {
    if (!this.isSupported()) return 'denied';
    return await Notification.requestPermission();
  }

  async requestPermission() {
    if (!this.isSupported()) return false;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  hasNotificationPermission() {
    return this.isSupported() && Notification.permission === 'granted';
  }

  async sendWelcomeNotification() {
    if (!this.hasNotificationPermission()) return;
    
    new Notification('Welcome to Fyke!', {
      body: 'Your gig economy journey starts here.',
      icon: '/favicon.ico'
    });
  }

  async sendJobNotification(title: string, message: string) {
    if (!this.hasNotificationPermission()) return;
    
    new Notification(title, {
      body: message,
      icon: '/favicon.ico'
    });
  }

  async sendMessageNotification(senderName: string, messagePreview: string) {
    console.log(`Sending notification: ${senderName}: ${messagePreview}`);
    
    if (this.hasNotificationPermission()) {
      new Notification('New Message', {
        body: `From ${senderName}: ${messagePreview}`,
        icon: '/favicon.ico'
      });
    } else {
      // Fallback to toast
      toast({
        title: 'New Message',
        description: `From ${senderName}: ${messagePreview}`,
      });
    }
  }
}

export const notificationService = new NotificationService();
