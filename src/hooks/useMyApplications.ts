import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from './useJobSeekerJobs'; 

export interface ApplicationWithJob extends Job {
  application_status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
}

export const useMyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMyApplications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select(`
          status,
          applied_at,
          job:jobs (
            *,
            employer:profiles (name)
          )
        `)
        .eq('applicant_id', user.id)
        .order('applied_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        const formattedApplications = data.map((app: Record<string, any>) => {
          const { job, ...applicationDetails } = app;
          const { employer, ...jobDetails } = job || {};
          return {
            ...jobDetails,
            company: employer?.name || 'A Reputed Company',
            application_status: applicationDetails.status,
            applied_at: applicationDetails.applied_at,
            posted_at: jobDetails?.created_at,
          };
        });
        setApplications(formattedApplications as ApplicationWithJob[]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const withdrawApplication = async (jobId: string) => {
    if (!user) {
      setError('You must be logged in to withdraw an application.');
      return { success: false, error: 'Not logged in' };
    }
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('job_id', jobId)
        .eq('applicant_id', user.id);
      if (updateError) throw updateError;
      await fetchMyApplications();
      return { success: true };
    } catch (err) {
      setError('Failed to withdraw application.');
      return { success: false, error: 'Failed to withdraw' };
    }
  };

  useEffect(() => {
    fetchMyApplications();
    // Expose refreshApplications globally for cross-screen refresh
    if (typeof window !== 'undefined') {
      (window as any).refreshApplications = fetchMyApplications;
    }
  }, [fetchMyApplications]);

  return {
    applications,
    loading,
    error,
    withdrawApplication,
    refreshApplications: fetchMyApplications
  };
};