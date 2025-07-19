import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRatings() {
  const [ratings, setRatings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRatingsForUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ratings')
        .select('*')
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setRatings(data || []);
      return data || [];
    } catch (err: any) {
      setError('Failed to load ratings.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRatingForRequest = useCallback(async (requestId: string, fromUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('ratings')
        .select('*')
        .eq('request_id', requestId)
        .eq('from_user_id', fromUserId)
        .single();
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      return data || null;
    } catch (err: any) {
      setError('Failed to load rating.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitRating = useCallback(async ({ from_user_id, to_user_id, request_id, rating, comment }: {
    from_user_id: string;
    to_user_id: string;
    request_id: string;
    rating: number;
    comment?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const { error: insertError } = await supabase
        .from('ratings')
        .insert([{ from_user_id, to_user_id, request_id, rating, comment }]);
      if (insertError) throw insertError;
      return true;
    } catch (err: any) {
      setError('Failed to submit rating.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    ratings,
    loading,
    error,
    fetchRatingsForUser,
    fetchRatingForRequest,
    submitRating,
  };
} 