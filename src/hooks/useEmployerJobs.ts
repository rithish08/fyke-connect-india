import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/types/job';

export const useEmployerJobs = () => {
  const { user } = useAuth();
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Always use the latest user context
  const fetchEmployerJobs = useCallback(async () => {
    if (!user || user.role !== 'employer') {
      setPostedJobs([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles ( name, profile_photo ),
          category:categories ( name, icon )
        `)
        .eq('employer_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (data) {
        const formattedJobs = data.map((job) => ({
          ...job,
          company: job.employer?.name || 'Your Company',
          posted_at: job.created_at,
        }));
        setPostedJobs(formattedJobs as Job[]);
        // Logging for debugging
        if (formattedJobs.length === 0) {
          console.warn('No jobs found for employer:', user.id);
        } else {
          console.log('Fetched jobs for employer:', user.id, formattedJobs);
        }
      } else {
        setPostedJobs([]);
        console.warn('No jobs data returned from Supabase for employer:', user.id);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching employer jobs:', error);
      setError('Failed to load your job posts.');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  useEffect(() => {
    fetchEmployerJobs();
    // Expose refreshJobs globally for cross-screen refresh
    if (typeof window !== 'undefined') {
      (window as any).refreshJobs = fetchEmployerJobs;
    }
  }, [fetchEmployerJobs]);

  // Utility to force refresh from anywhere
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).forceRefreshEmployerJobs = fetchEmployerJobs;
    }
  }, [fetchEmployerJobs]);

  return { postedJobs, loading, error, refreshJobs: fetchEmployerJobs };
};

