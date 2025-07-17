
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Job, JobApplication, Rating } from '@/types/job';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useAnalytics } from '@/hooks/useAnalytics';

interface JobContextType {
  jobs: Job[];
  myJobs: Job[];
  applications: JobApplication[];
  pendingRatings: Job[];
  loading: boolean;
  error: string | null;
  applyToJob: (jobId: string, message?: string) => Promise<{ success: boolean; error?: string }>;
  acceptApplication: (jobId: string, applicantId: string) => Promise<{ success: boolean; error?: string }>;
  finishJob: (jobId: string) => Promise<{ success: boolean; error?: string }>;
  submitRating: (jobId: string, ratedUserId: string, rating: number, review: string) => Promise<{ success: boolean; error?: string }>;
  sharePhoneNumber: (jobId: string, otherUserId: string) => Promise<{ success: boolean; error?: string }>;
  refreshJobs: () => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { trackEvent } = useAnalytics();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [pendingRatings, setPendingRatings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*');

      if (jobsError) {
        console.error('Error loading jobs:', jobsError);
        setJobs([]);
        setError('Failed to load job data. Please check your connection.');
        return;
      }

      setJobs(jobsData as Job[] || []);
      
      if (user) {
        if (user.role === 'employer') {
          const { data: myJobsData, error: myJobsError } = await supabase
            .from('jobs')
            .select('*')
            .eq('employer_id', user.id);

          if (myJobsError) {
            console.error('Error loading my jobs:', myJobsError);
            setMyJobs([]);
          } else {
            setMyJobs(myJobsData as Job[] || []);
            const myJobIds = myJobsData.map(job => job.id);
            if (myJobIds.length > 0) {
                const { data: applicationsData, error: applicationsError } = await supabase
                    .from('applications')
                    .select('*')
                    .in('job_id', myJobIds);

                if (applicationsError) {
                    console.error('Error fetching applications for employer:', applicationsError);
                    setApplications([]);
                } else {
                    setApplications(applicationsData || []);
                }
            } else {
                setApplications([]);
            }
          }
        } else {
          // Job seeker 'myJobs' logic to be implemented next
          setMyJobs([]);
          const { data: applicationsData, error: applicationsError } = await supabase
            .from('applications')
            .select('*')
            .eq('applicant_id', user.id);

          if (applicationsError) {
              console.error('Error fetching applications:', applicationsError);
              setApplications([]);
          } else {
              setApplications(applicationsData || []);
          }
        }
      }

      // Temporarily disable pending ratings
      // setPendingRatings([]);
      
    } catch (error) {
      console.error('Error in loadJobs:', error);
      setJobs([]);
      setMyJobs([]);
      setError('Failed to load job data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string, message?: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      console.error('Apply to job failed: User not authenticated');
      return { success: false, error: 'Not authenticated' };
    }
    if (user.role !== 'jobseeker') {
      console.error('Apply to job failed: Only job seekers can apply');
      return { success: false, error: 'Only job seekers can apply for jobs.' };
    }
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          status: 'pending', // default status
          cover_letter: message,
        });

      if (error) {
        console.error('Error applying to job:', error);
        return { success: false, error: error.message };
      }

      // Refresh the jobs list to include the new application in "My Jobs"
      trackEvent('job_application_sent', { jobId: jobId });
      await loadJobs();

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Exception when applying to job:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const acceptApplication = async (jobId: string, applicantId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user || user.role !== 'employer') {
      return { success: false, error: 'Only employers can accept applications.' };
    }
    
    try {
      // Step 1: Update the application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('job_id', jobId)
        .eq('applicant_id', applicantId);

      if (applicationError) {
        console.error('Error accepting application:', applicationError);
        return { success: false, error: applicationError.message };
      }

      // Step 2: Update the job status to 'filled'
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ status: 'filled', filled_at: new Date().toISOString() })
        .eq('id', jobId);

      if (jobError) {
        // Note: At this point, the application is accepted but the job status failed to update.
        // This might require a more complex transaction or cleanup logic in a real-world scenario.
        // For now, we'll report the error and proceed.
        console.error('Error updating job status to filled:', jobError);
        return { success: false, error: jobError.message };
      }
      
      // Refresh data to reflect the changes
      trackEvent('job_application_accepted', { jobId: jobId, applicantId: applicantId });
      await loadJobs();

      return { success: true };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Exception when accepting application:', errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const finishJob = async (jobId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      // Update job status to completed
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed' as const, completed_at: new Date().toISOString() }
          : job
      ));
      
      setMyJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed' as const, completed_at: new Date().toISOString() }
          : job
      ));
      
      // Add to pending ratings
      const completedJob = jobs.find(job => job.id === jobId);
      if (completedJob) {
        setPendingRatings(prev => [...prev, { ...completedJob, status: 'completed' as const }]);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to finish job' };
    }
  };

  const submitRating = async (jobId: string, ratedUserId: string, rating: number, review: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      // Update job with rating
      const isEmployer = user.role === 'employer';
      const ratingField = isEmployer ? 'rating_worker' : 'rating_employer';
      const reviewField = isEmployer ? 'review_worker' : 'review_employer';
      
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, [ratingField]: rating, [reviewField]: review }
          : job
      ));
      
      setMyJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, [ratingField]: rating, [reviewField]: review }
          : job
      ));
      
      // Remove from pending ratings if both ratings are complete
      const updatedJob = jobs.find(job => job.id === jobId);
      if (updatedJob && updatedJob.rating_employer && updatedJob.rating_worker) {
        setPendingRatings(prev => prev.filter(job => job.id !== jobId));
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to submit rating' };
    }
  };

  const sharePhoneNumber = async (jobId: string, otherUserId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      // Mock implementation for sharing phone number
      console.log('Phone number shared for job:', jobId, 'with user:', otherUserId);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to share phone number' };
    }
  };

  const refreshJobs = async () => {
    await loadJobs();
  };

  return (
    <JobContext.Provider value={{
      jobs,
      myJobs,
      applications,
      pendingRatings,
      loading,
      error,
      applyToJob,
      acceptApplication,
      finishJob,
      submitRating,
      sharePhoneNumber,
      refreshJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};
