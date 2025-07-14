import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ConversationWithDetails {
  conversation_id: string;
  other_user_id: string;
  other_user_name: string;
  last_message: string;
  last_message_at: string;
  last_message_sender_id: string;
  unread_messages_count: number;
  job_title: string;
  job_id: string;
  job_status: 'applied' | 'accepted' | 'completed' | 'in_progress' | 'cancelled' | 'open';
  phone_shared: boolean;
  other_phone_shared: boolean;
}

export const useConversations = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_user_conversations_with_details_v5',
        { user_id: user.id }
      );

      if (rpcError) {
        throw rpcError;
      }

      setConversations(data as ConversationWithDetails[] || []);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load your conversations.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refreshConversations: fetchConversations };
};