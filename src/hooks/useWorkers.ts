import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Tables } from '@/integrations/supabase/types';

export type Profile = Tables<'profiles'>;

export const useWorkers = () => {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkers = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'jobseeker')
        .neq('id', user.id) // Exclude the employer themselves
        .limit(20); // Limit for performance

      if (fetchError) {
        throw fetchError;
      }

      setWorkers(data || []);
    } catch (err: any) {
      console.error('Error fetching workers:', err);
      setError('Failed to load available workers.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  return { 
    workers, 
    loading, 
    error, 
    refreshWorkers: fetchWorkers 
  };
}; 