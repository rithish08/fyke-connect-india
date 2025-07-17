import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Job, JobApplication, Rating } from '@/types/job';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface JobContextType {
  jobs: Job[];
  myJobs: Job[];
  applications: JobApplication[];
  pendingRatings: Job[];
  loading: boolean;
  applyToJob: (jobId: string, message?: string) => Promise<{ success: boolean; error?: string }>;
  acceptApplication: (jobId: string, applicantId: string) => Promise<{ success: boolean; error?: string }>;
  finishJob: (jobId: string) => Promise<{ success: boolean; error?: string }>;
  submitRating: (jobId: string, ratedUserId: string, rating: number, review: string) => Promise<{ success: boolean; error?: string }>;
  sharePhoneNumber: (jobId: string, otherUserId: string) => Promise<{ success: boolean; error?: string }>;
  addPendingRating: (jobId: string) => Promise<{ success: boolean; error?: string }>;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [pendingRatings, setPendingRatings] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Remove mockJobs and use real Supabase data
  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch all jobs
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });
      if (jobsError) throw jobsError;

      // Map jobsData to Job type expected by frontend
      const mapJob = (job: Partial<Job> & Record<string, unknown>): Job => ({
        id: String(job.id ?? ''),
        title: String(job.title ?? ''),
        description: String(job.description ?? ''),
        category: job.category ?? '',
        employer_id: String(job.employer_id ?? ''),
        location: String(job.location ?? ''),
        requirements: Array.isArray(job.requirements) ? job.requirements as string[] : [],
        salary_min: Number(job.salary_min ?? 0),
        salary_max: Number(job.salary_max ?? 0),
        salary_period: (['hour', 'day', 'week', 'month', 'project'].includes(String(job.salary_period))
          ? String(job.salary_period)
          : 'day') as 'hour' | 'day' | 'week' | 'month' | 'project',
        urgent: Boolean(job.urgent),
        created_at: String(job.created_at ?? ''),
        updated_at: String(job.updated_at ?? ''),
        status: (['posted', 'applied', 'accepted', 'in_progress', 'completed', 'cancelled', 'open'].includes(String(job.status)) ? job.status : 'open') as 'posted' | 'applied' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'open',
        applicant_id: String((job as { applicant_id?: string }).applicant_id ?? ''),
        rating_employer: (job as { rating_employer?: number | null }).rating_employer ?? null,
        rating_worker: (job as { rating_worker?: number | null }).rating_worker ?? null,
        // Add any other required fields with sensible defaults
      });
      const jobsList = (jobsData || []).map(mapJob);
      setJobs(jobsList);

      // Fetch my jobs (as employer or applicant)
      if (user?.role === 'employer') {
        setMyJobs(jobsList.filter(job => job.employer_id === user.id));
      } else if (user) {
        // For jobseeker, fetch applications and match jobs
        const { data: apps, error: appsError } = await supabase
          .from('applications')
          .select('job_id')
          .eq('applicant_id', user.id);
        if (appsError) throw appsError;
        const appliedJobIds = (apps || []).map(a => a.job_id);
        setMyJobs(jobsList.filter(job => appliedJobIds.includes(job.id)));
      }

      // Fetch pending ratings (example: jobs with status 'completed' and no rating)
      if (user) {
        setPendingRatings(jobsList.filter(job =>
          job.status === 'completed' &&
          (job.employer_id === user.id || job.applicant_id === user.id) &&
          (!job.rating_employer || !job.rating_worker)
        ));
      }
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user, loadJobs]);

  // Update applyToJob to use Supabase
  const applyToJob = async (jobId: string, message?: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    try {
      const { error } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          status: 'pending',
          applied_at: new Date().toISOString(),
          message
        });
      if (error) throw error;
      // Optionally refresh applications/jobs
      await loadJobs();
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to apply to job' };
    }
  };

  const acceptApplication = async (jobId: string, applicantId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      // Update job status to accepted
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'accepted' as const, applicant_id: applicantId, accepted_at: new Date().toISOString() }
          : job
      ));
      
      setMyJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'accepted' as const, applicant_id: applicantId, accepted_at: new Date().toISOString() }
          : job
      ));
      
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to accept application' };
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

  const addPendingRating = async (jobId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        setPendingRatings(prev => [...prev, job]);
        return { success: true };
      }
      return { success: false, error: 'Job not found' };
    } catch (error) {
      return { success: false, error: 'Failed to add pending rating' };
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
      applyToJob,
      acceptApplication,
      finishJob,
      submitRating,
      sharePhoneNumber,
      addPendingRating,
      refreshJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};
