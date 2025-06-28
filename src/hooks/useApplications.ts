import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { definitions } from '@/integrations/supabase/types';

export type Application = definitions['applications'];

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*')
        .eq('applicant_id', user.id);

      if (fetchError) {
        throw fetchError;
      }

      setApplications(data || []);
    } catch (err: any) {
      console.error('Error fetching applications:', err);
      setError('Failed to load your applications.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
    // Expose refreshApplications globally for cross-screen refresh
    if (typeof window !== 'undefined') {
      window.refreshApplications = fetchApplications;
    }
  }, [fetchApplications]);

  const applyToJob = async (jobId: string, employerId: string) => {
    if (!user) {
      setError('You must be logged in to apply.');
      return;
    }

    try {
      // Check if already applied
      const existingApplication = applications.find(app => app.job_id === jobId);
      if (existingApplication) {
        console.log("Already applied to this job");
        return;
      }

      const { data: newApplication, error: insertError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          applicant_id: user.id,
          employer_id: employerId,
          status: 'pending',
        })
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      if (newApplication) {
        setApplications(prev => [...prev, newApplication]);
      }
    } catch (err: any) {
      console.error('Error applying to job:', err);
      setError('Failed to submit your application.');
    }
  };
  
  const hasApplied = (jobId: string) => {
    return applications.some(app => app.job_id === jobId);
  };

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
      await fetchApplications();
      return { success: true };
    } catch (err) {
      setError('Failed to withdraw application.');
      return { success: false, error: 'Failed to withdraw' };
    }
  };

  return { 
    applications, 
    loading, 
    error, 
    applyToJob,
    hasApplied,
    withdrawApplication,
    refreshApplications: fetchApplications 
  };
}; 