import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from './useWorkers'; // Reuse Profile type

export const useWorkerProfile = (workerId: string | null) => {
  const [worker, setWorker] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWorker = useCallback(async () => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', workerId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // Not found
          setError('Worker profile not found.');
        } else {
          throw fetchError;
        }
      }

      setWorker(data || null);
    } catch (err: any) {
      console.error('Error fetching worker profile:', err);
      setError('Failed to load worker profile.');
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  useEffect(() => {
    fetchWorker();
  }, [fetchWorker]);

  return { 
    worker, 
    loading, 
    error, 
    refreshWorker: fetchWorker 
  };
}; 