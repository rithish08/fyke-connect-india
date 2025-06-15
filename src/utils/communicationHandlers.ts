
export const handlePhoneCall = (phoneNumber?: string, targetName?: string) => {
  if (phoneNumber) {
    window.open(`tel:${phoneNumber}`, '_self');
  } else {
    // Show toast that phone call feature is coming soon
    console.log(`Calling ${targetName} - feature coming soon`);
  }
};

export const handleInAppChat = (targetId: string, targetName: string, navigate: any, context?: string) => {
  navigate(`/messages?chatWith=${targetId}&name=${targetName}&type=worker${context ? `&context=${context}` : ''}`);
};

export const handleEmployerContact = (targetId: string, targetName: string, navigate: any, context?: string) => {
  navigate(`/messages?chatWith=${targetId}&name=${targetName}&type=employer${context ? `&context=${context}` : ''}`);
};
