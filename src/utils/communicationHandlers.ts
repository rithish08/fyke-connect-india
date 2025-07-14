import { Capacitor } from '@capacitor/core';

export const makePhoneCall = (phoneNumber: string) => {
  if (Capacitor.isNativePlatform()) {
    // On native platforms, use tel: link
    window.open(`tel:${phoneNumber}`, '_system');
  } else {
    // On web, open dialer
    window.open(`tel:${phoneNumber}`, '_blank');
  }
};

export const handlePhoneCall = makePhoneCall; // Alias for compatibility

export const handleInAppChat = (userId: string) => {
  // Navigate to chat with user
  window.location.href = `/messages?user=${userId}`;
};

export const handleEmployerContact = (employerId: string) => {
  // Navigate to employer contact
  window.location.href = `/messages?employer=${employerId}`;
};

export const sendSMS = (phoneNumber: string, message: string) => {
  if (Capacitor.isNativePlatform()) {
    window.open(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`, '_system');
  } else {
    window.open(`sms:${phoneNumber}?body=${encodeURIComponent(message)}`, '_blank');
  }
};