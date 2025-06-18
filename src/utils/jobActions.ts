
interface JobAction {
  jobId: string;
  userId: string;
  timestamp: Date;
  type: 'apply' | 'chat' | 'call';
}

// Mock storage for job actions
const jobActions = new Map<string, JobAction[]>();

// Get applied jobs for current user
export const getAppliedJobs = (userId: string): string[] => {
  const allActions = Array.from(jobActions.values()).flat();
  return allActions
    .filter(action => action.userId === userId && action.type === 'apply')
    .map(action => action.jobId);
};

// Check if user has applied to a job
export const hasAppliedToJob = (jobId: string, userId: string = 'current-user'): boolean => {
  const userActions = jobActions.get(userId) || [];
  return userActions.some(action => action.jobId === jobId && action.type === 'apply');
};

// Apply to a job
export const applyToJob = async (jobId: string, userId: string = 'current-user'): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (hasAppliedToJob(jobId, userId)) {
          reject(new Error('Already applied to this job'));
          return;
        }

        const existingActions = jobActions.get(userId) || [];
        const newAction: JobAction = {
          jobId,
          userId,
          timestamp: new Date(),
          type: 'apply'
        };

        jobActions.set(userId, [...existingActions, newAction]);
        
        // Store in localStorage for persistence
        localStorage.setItem(`fyke_applied_jobs_${userId}`, JSON.stringify(getAppliedJobs(userId)));
        
        console.log(`Applied to job ${jobId} for user ${userId}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 500); // Simulate API delay
  });
};

// Start chat with employer
export const chatWithEmployer = async (jobId: string, userId: string = 'current-user'): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const existingActions = jobActions.get(userId) || [];
        const newAction: JobAction = {
          jobId,
          userId,
          timestamp: new Date(),
          type: 'chat'
        };

        jobActions.set(userId, [...existingActions, newAction]);
        
        console.log(`Started chat for job ${jobId} with user ${userId}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Call employer
export const callEmployer = async (jobId: string, userId: string = 'current-user'): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const existingActions = jobActions.get(userId) || [];
        const newAction: JobAction = {
          jobId,
          userId,
          timestamp: new Date(),
          type: 'call'
        };

        jobActions.set(userId, [...existingActions, newAction]);
        
        console.log(`Called employer for job ${jobId} with user ${userId}`);
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
};

// Load applied jobs from localStorage on app start
export const loadPersistedJobActions = (userId: string = 'current-user'): void => {
  try {
    const storedAppliedJobs = localStorage.getItem(`fyke_applied_jobs_${userId}`);
    if (storedAppliedJobs) {
      const appliedJobIds = JSON.parse(storedAppliedJobs);
      const actions: JobAction[] = appliedJobIds.map((jobId: string) => ({
        jobId,
        userId,
        timestamp: new Date(), // We don't have the original timestamp
        type: 'apply' as const
      }));
      jobActions.set(userId, actions);
    }
  } catch (error) {
    console.error('Failed to load persisted job actions:', error);
  }
};

// Initialize persistence on module load
loadPersistedJobActions();
