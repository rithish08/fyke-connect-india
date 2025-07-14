import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/job';

export type { Job };

export const useJobSeekerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('jobs')
        .select(`
          id, title, location, urgent, created_at, description, salary_min, salary_max, salary_period,
          employer:profiles ( name ),
          category:categories ( name, icon )
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;
      
      if (data) {
        setJobs(data as Job[]);
      }

    } catch (err) {
      const error = err as Error;
      console.error("Error fetching jobs:", error);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchJobs();
    } else {
      setLoading(false);
    }
  }, [user, fetchJobs]);

  return { jobs, loading, error, refreshJobs: fetchJobs };
};
