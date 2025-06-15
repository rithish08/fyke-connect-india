
import { useGlobalToast } from '@/hooks/useGlobalToast';

export const handlePhoneCall = (phoneNumber?: string, targetName?: string) => {
  if (phoneNumber) {
    window.location.href = `tel:${phoneNumber}`;
  } else {
    console.log(`Phone call to ${targetName || 'contact'} not available`);
  }
};

export const handleInAppChat = (targetId: string, targetName: string, navigate: any, context?: string) => {
  if (!targetId || !targetName || !navigate) {
    console.error('Missing required parameters for chat');
    return;
  }

  const chatParams = new URLSearchParams({
    chatWith: targetId,
    name: targetName,
    type: 'worker'
  });
  
  if (context) {
    chatParams.append('context', context);
  }
  
  navigate(`/messages?${chatParams.toString()}`);
};

export const handleEmployerContact = (targetId: string, targetName: string, navigate: any, context?: string) => {
  if (!targetId || !targetName || !navigate) {
    console.error('Missing required parameters for employer contact');
    return;
  }

  const chatParams = new URLSearchParams({
    chatWith: targetId,
    name: targetName,
    type: 'employer'
  });
  
  if (context) {
    chatParams.append('context', context);
  }
  
  navigate(`/messages?${chatParams.toString()}`);
};

export const handleJobApplication = (jobId: string, jobTitle: string, navigate: any) => {
  if (!jobId || !jobTitle || !navigate) {
    console.error('Missing required parameters for job application');
    return;
  }

  // Store application in local storage
  const applications = JSON.parse(localStorage.getItem('fyke_applications') || '[]');
  const newApplication = {
    id: Date.now().toString(),
    jobId,
    jobTitle,
    appliedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  applications.push(newApplication);
  localStorage.setItem('fyke_applications', JSON.stringify(applications));
  
  // Navigate to my jobs page
  navigate('/my-jobs');
};

export const handleHireRequest = (workerId: string, workerName: string) => {
  if (!workerId || !workerName) {
    console.error('Missing required parameters for hire request');
    return;
  }

  // Store hire request in local storage
  const hireRequests = JSON.parse(localStorage.getItem('fyke_hire_requests') || '[]');
  const newRequest = {
    id: Date.now().toString(),
    workerId,
    workerName,
    requestedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  hireRequests.push(newRequest);
  localStorage.setItem('fyke_hire_requests', JSON.stringify(hireRequests));
};
