import { useState, useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

export const useNotificationService = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.getPermissionStatus());
  }, []);

  const requestPermission = async () => {
    try {
      const granted = await notificationService.requestPermission();
      setPermission(notificationService.getPermissionStatus());
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = async (title: string, options?: NotificationOptions) => {
    try {
      await notificationService.sendNotification(title, options);
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
      await notificationService.sendApplicationNotification(jobTitle, applicantName);
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
      await notificationService.sendOTPNotification(phoneNumber);
    } catch (error) {
      console.error('Error sending OTP notification:', error);
    }
  };

  const sendProfileUpdateNotification = async () => {
    try {
      await notificationService.sendProfileUpdateNotification();
    } catch (error) {
      console.error('Error sending profile update notification:', error);
    }
  };

  const sendJobPostedNotification = async (jobTitle: string) => {
    try {
      await notificationService.sendJobPostedNotification(jobTitle);
    } catch (error) {
      console.error('Error sending job posted notification:', error);
    }
  };

  const sendApplicationStatusNotification = async (jobTitle: string, status: string) => {
    try {
      await notificationService.sendApplicationStatusNotification(jobTitle, status);
    } catch (error) {
      console.error('Error sending application status notification:', error);
    }
  };

  const sendWelcomeNotification = async (userName: string) => {
    try {
      await notificationService.sendWelcomeNotification(userName);
    } catch (error) {
      console.error('Error sending welcome notification:', error);
    }
  };

  const sendReminderNotification = async (message: string) => {
    try {
      await notificationService.sendReminderNotification(message);
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