import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface Request {
  id: string;
  applicant_id: string;
  employer_id: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  applicant?: any;
  employer?: any;
}

export function useRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      // Fetch all requests where user is sender or receiver, join profiles
      const { data, error: fetchError } = await supabase
        .from('applications')
        .select('*, applicant:applicant_id(*), employer:employer_id(*)')
        .or(`applicant_id.eq.${user.id},employer_id.eq.${user.id}`)
        .order('applied_at', { ascending: false });
      if (fetchError) throw fetchError;
      setRequests(data || []);
    } catch (err: any) {
      setError('Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Actions
  const acceptRequest = async (id: string) => {
    await supabase.from('applications').update({ status: 'accepted' }).eq('id', id);
    fetchRequests();
  };
  const rejectRequest = async (id: string) => {
    await supabase.from('applications').update({ status: 'rejected' }).eq('id', id);
    fetchRequests();
  };

  // Group requests
  const sentPending = requests.filter(r => r.applicant_id === user?.id && r.status === 'pending');
  const receivedPending = requests.filter(r => r.employer_id === user?.id && r.status === 'pending');
  const accepted = requests.filter(r => r.status === 'accepted');
  const rejected = requests.filter(r => r.status === 'rejected');

  return {
    sentPending,
    receivedPending,
    accepted,
    rejected,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    refresh: fetchRequests,
  };
} 