
import { toast } from "sonner";

export interface JobActionHandlers {
  onApply: (jobId: string) => void;
  onChat: (jobId: string, employerId: string) => void;
  onCall: (phone: string) => void;
}

export const createJobActionHandlers = (navigate: (path: string) => void): JobActionHandlers => {
  return {
    onApply: (jobId: string) => {
      // Store application in localStorage for persistence
      const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      if (!applications.includes(jobId)) {
        applications.push(jobId);
        localStorage.setItem('appliedJobs', JSON.stringify(applications));
        toast.success("Application submitted successfully!");
        console.log(`Applied to job: ${jobId}`);
      } else {
        toast.info("You have already applied to this job");
      }
    },

    onChat: (jobId: string, employerId: string) => {
      // Navigate to messaging with job context
      navigate(`/messaging?jobId=${jobId}&employerId=${employerId}`);
      toast.success("Opening chat...");
      console.log(`Opening chat for job: ${jobId} with employer: ${employerId}`);
    },

    onCall: (phone: string) => {
      if (phone) {
        // Open phone dialer
        window.open(`tel:${phone}`, '_self');
        toast.success("Opening phone dialer...");
        console.log(`Calling: ${phone}`);
      } else {
        toast.error("Phone number not available");
      }
    }
  };
};

// Utility to check if user has applied to a job
export const hasAppliedToJob = (jobId: string): boolean => {
  const applications = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
  return applications.includes(jobId);
};

// Utility to get all applied jobs
export const getAppliedJobs = (): string[] => {
  return JSON.parse(localStorage.getItem('appliedJobs') || '[]');
};
