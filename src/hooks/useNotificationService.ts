import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

export const useNotificationService = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const initPermission = async () => {
      setIsSupported(notificationService.isSupported());
      const status = await notificationService.getPermissionStatus();
      setPermission(status);
    };
    initPermission();
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      const status = await notificationService.getPermissionStatus();
      setPermission(status);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = async (title: string, options?: NotificationOptions) => {
    try {
      await notificationService.sendJobNotification(title, options?.body || '');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const sendJobNotification = async (jobTitle: string, employerName: string) => {
    try {
      await notificationService.sendJobNotification(jobTitle, employerName);
    } catch (error) {
      console.error('Error sending job notification:', error);
    }
  };

  const sendApplicationNotification = async (jobTitle: string, applicantName: string) => {
    try {
      await notificationService.sendJobNotification(jobTitle, applicantName);
    } catch (error) {
      console.error('Error sending application notification:', error);
    }
  };

  const sendMessageNotification = async (senderName: string, messagePreview: string) => {
    try {
      await notificationService.sendMessageNotification(senderName, messagePreview);
    } catch (error) {
      console.error('Error sending message notification:', error);
    }
  };

  const sendOTPNotification = async (phoneNumber: string) => {
    try {
      await notificationService.sendJobNotification('OTP Sent', phoneNumber);
    } catch (error) {
      console.error('Error sending OTP notification:', error);
    }
  };

  const sendProfileUpdateNotification = async () => {
    try {
      await notificationService.sendJobNotification('Profile Updated', 'Your profile has been updated successfully');
    } catch (error) {
      console.error('Error sending profile update notification:', error);
    }
  };

  const sendJobPostedNotification = async (jobTitle: string) => {
    try {
      await notificationService.sendJobNotification('Job Posted', jobTitle);
    } catch (error) {
      console.error('Error sending job posted notification:', error);
    }
  };

  const sendApplicationStatusNotification = async (jobTitle: string, status: string) => {
    try {
      await notificationService.sendJobNotification(`Application ${status}`, jobTitle);
    } catch (error) {
      console.error('Error sending application status notification:', error);
    }
  };

  const sendWelcomeNotification = async (userName: string) => {
    try {
      await notificationService.sendWelcomeNotification();
    } catch (error) {
      console.error('Error sending welcome notification:', error);
    }
  };

  const sendReminderNotification = async (message: string) => {
    try {
      await notificationService.sendJobNotification('Reminder', message);
    } catch (error) {
      console.error('Error sending reminder notification:', error);
    }
  };

  return {
    permission,
    isSupported,
    hasPermission: notificationService.hasNotificationPermission(),
    requestPermission,
    sendNotification,
    sendJobNotification,
    sendApplicationNotification,
    sendMessageNotification,
    sendOTPNotification,
    sendProfileUpdateNotification,
    sendJobPostedNotification,
    sendApplicationStatusNotification,
    sendWelcomeNotification,
    sendReminderNotification,
  };
}; 