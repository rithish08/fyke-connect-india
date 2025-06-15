
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
  
  console.log('Navigating to chat with params:', chatParams.toString());
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
  
  console.log('Navigating to employer chat with params:', chatParams.toString());
  navigate(`/messages?${chatParams.toString()}`);
};

export const handleJobApplication = (jobId: string, jobTitle: string, navigate: any) => {
  if (!jobId || !jobTitle || !navigate) {
    console.error('Missing required parameters for job application');
    return;
  }

  // Store application in local storage
  const applications = JSON.parse(localStorage.getItem('fyke_applications') || '[]');
  const existingApplication = applications.find((app: any) => app.jobId === jobId);
  
  if (existingApplication) {
    console.log('Application already exists for this job');
    return;
  }

  const newApplication = {
    id: Date.now().toString(),
    jobId,
    jobTitle,
    appliedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  applications.push(newApplication);
  localStorage.setItem('fyke_applications', JSON.stringify(applications));
  
  console.log('Application submitted:', newApplication);
  
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
  const existingRequest = hireRequests.find((req: any) => req.workerId === workerId);
  
  if (existingRequest) {
    console.log('Hire request already exists for this worker');
    return;
  }

  const newRequest = {
    id: Date.now().toString(),
    workerId,
    workerName,
    requestedAt: new Date().toISOString(),
    status: 'pending'
  };
  
  hireRequests.push(newRequest);
  localStorage.setItem('fyke_hire_requests', JSON.stringify(hireRequests));
  
  console.log('Hire request sent:', newRequest);
};

// Supabase-ready functions for future integration
export const supabaseHandlers = {
  async submitJobApplication(jobId: string, userId: string, applicationData: any) {
    // This will be replaced with Supabase API call
    console.log('Supabase: Submitting job application', { jobId, userId, applicationData });
    return { success: true, id: Date.now().toString() };
  },

  async sendHireRequest(workerId: string, employerId: string, requestData: any) {
    // This will be replaced with Supabase API call
    console.log('Supabase: Sending hire request', { workerId, employerId, requestData });
    return { success: true, id: Date.now().toString() };
  },

  async createChatChannel(user1Id: string, user2Id: string, context?: string) {
    // This will be replaced with Supabase API call
    console.log('Supabase: Creating chat channel', { user1Id, user2Id, context });
    return { success: true, channelId: `chat_${Date.now()}` };
  },

  async sendMessage(channelId: string, senderId: string, message: string) {
    // This will be replaced with Supabase API call
    console.log('Supabase: Sending message', { channelId, senderId, message });
    return { success: true, messageId: Date.now().toString() };
  }
};
