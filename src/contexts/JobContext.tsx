
import React, { createContext, useContext, useState, useEffect } from 'react';
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

  // Mock data for now - will be replaced with Supabase integration
  const mockJobs: Job[] = [
    {
      id: '1',
      title: 'Construction Worker Needed',
      description: 'Looking for experienced construction worker for residential project.',
      category: 'Construction',
      employer_id: 'emp1',
      employer_name: 'ABC Construction',
      location: 'Mumbai, Maharashtra',
      salary: '800',
      salary_period: 'day',
      status: 'posted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      urgent: true,
      total_positions: 5
    },
    {
      id: '2',
      title: 'Delivery Driver Required',
      description: 'Fast delivery driver needed for food delivery service.',
      category: 'Delivery',
      employer_id: 'emp2',
      employer_name: 'Quick Foods',
      location: 'Bangalore, Karnataka',
      salary: '600',
      salary_period: 'day',
      status: 'posted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_positions: 3
    }
  ];

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      // For now using mock data - replace with Supabase calls
      setJobs(mockJobs);
      
      if (user?.role === 'employer') {
        setMyJobs(mockJobs.filter(job => job.employer_id === user.id));
      } else {
        setMyJobs(mockJobs.filter(job => job.applicant_id === user.id));
      }
      
      // Check for pending ratings
      const completedJobs = mockJobs.filter(job => 
        job.status === 'completed' && 
        (job.employer_id === user.id || job.applicant_id === user.id) &&
        (!job.rating_employer || !job.rating_worker)
      );
      setPendingRatings(completedJobs);
      
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (jobId: string, message?: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) return { success: false, error: 'Not authenticated' };
    
    try {
      // Mock implementation - replace with Supabase
      const application: JobApplication = {
        id: Date.now().toString(),
        job_id: jobId,
        applicant_id: user.id,
        status: 'pending',
        applied_at: new Date().toISOString(),
        message
      };
      
      setApplications(prev => [...prev, application]);
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
      refreshJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};
