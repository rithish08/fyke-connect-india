
// Utility functions for handling communication actions
export const handlePhoneCall = (phoneNumber?: string, workerName?: string) => {
  if (phoneNumber) {
    // Open device dialer with the phone number
    window.open(`tel:${phoneNumber}`, '_self');
  } else {
    // Fallback - show contact info or redirect to profile
    alert(`Contact information for ${workerName || 'worker'} is not available. Please use the chat feature.`);
  }
};

export const handleInAppChat = (workerId: string, workerName: string, navigate: any, context?: string) => {
  const params = new URLSearchParams({
    chatWith: workerId,
    name: workerName,
    type: 'worker',
    ...(context && { context })
  });
  navigate(`/messages?${params.toString()}`);
};

export const handleEmployerContact = (employerId: string, employerName: string, navigate: any, jobTitle?: string) => {
  const params = new URLSearchParams({
    chatWith: employerId,
    name: employerName,
    type: 'employer',
    ...(jobTitle && { context: jobTitle })
  });
  navigate(`/messages?${params.toString()}`);
};
