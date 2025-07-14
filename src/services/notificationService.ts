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

  // Alias for backward compatibility
  async sendNotification(title: string, message: string) {
    return this.sendJobNotification(title, message);
  }

  async sendJobNotification(title: string, message: string) {
    if (!this.hasNotificationPermission()) return;
    
    new Notification(title, {
      body: message,
      icon: '/favicon.ico'
    });
  }

  async sendJobPostedNotification() {
    return this.sendJobNotification('Job Posted', 'Your job has been posted successfully!');
  }

  async sendApplicationNotification() {
    return this.sendJobNotification('Application Sent', 'Your application has been submitted!');
  }

  async sendProfileUpdateNotification() {
    return this.sendJobNotification('Profile Updated', 'Your profile has been updated successfully!');
  }

  async sendOTPNotification() {
    return this.sendJobNotification('OTP Sent', 'Verification code has been sent!');
  }

  async sendApplicationStatusNotification() {
    return this.sendJobNotification('Application Status', 'Your application status has been updated!');
  }

  async sendReminderNotification() {
    return this.sendJobNotification('Reminder', 'You have pending notifications!');
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
