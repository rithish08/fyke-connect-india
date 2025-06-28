import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { definitions } from '@/integrations/supabase/types';

// Expanding the Application type to potentially include joined data
export type EmployerApplication = definitions['applications'] & {
  jobs?: { title: string };
  profiles?: { name: string; phone: string | null; };
};

export const useEmployerApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployerApplications = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get the IDs of jobs posted by the employer
      const { data: jobs, error: jobsError } = await supabase
        .from('jobs')
        .select('id')
        .eq('employer_id', user.id);

      if (jobsError) throw jobsError;

      const jobIds = jobs.map(job => job.id);

      if (jobIds.length === 0) {
        setApplications([]);
        setLoading(false);
        return;
      }

      // Now, fetch applications for those jobs, including applicant's name and job title
      const { data, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          jobs ( title ),
          profiles ( name, phone )
        `)
        .in('job_id', jobIds)
        .order('updated_at', { ascending: false });

      if (applicationsError) throw applicationsError;

      setApplications(data || []);

    } catch (err: any) {
      console.error('Error fetching employer applications:', err);
      setError('Failed to load job applications.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEmployerApplications();
  }, [fetchEmployerApplications]);

  return { 
    applications, 
    loading, 
    error, 
    refreshApplications: fetchEmployerApplications 
  };
}; 