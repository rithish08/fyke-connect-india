import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Job } from '@/types/job';

export const useEmployerJobs = () => {
  const { user } = useAuth();
  const [postedJobs, setPostedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployerJobs = useCallback(async () => {
    if (!user || user.role !== 'employer') {
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
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error fetching employer jobs:', error);
      setError('Failed to load your job posts.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployerJobs();
    // Expose refreshJobs globally for cross-screen refresh
    if (typeof window !== 'undefined') {
      (window as any).refreshJobs = fetchEmployerJobs;
    }
  }, [fetchEmployerJobs]);

  return { postedJobs, loading, error, refreshJobs: fetchEmployerJobs };
};

