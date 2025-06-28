import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Database } from '@/integrations/supabase/types';

export type Message = Database['public']['Tables']['messages']['Row'];

export const useMessages = (conversationId: string | null) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to hold the conversation ID to prevent re-subscribing on every render
  const conversationIdRef = useRef(conversationId);
  conversationIdRef.current = conversationId;

  const fetchMessages = useCallback(async () => {
    if (!conversationIdRef.current) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation', conversationIdRef.current)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err: unknown) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();

    if (!conversationIdRef.current) return;

    const channel = supabase
      .channel(`messages-for-${conversationIdRef.current}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation=eq.${conversationIdRef.current}`,
        },
        (payload) => {
          setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, fetchMessages]);

  const sendMessage = async (content: string) => {
    if (!conversationId || !user || !content.trim()) {
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert({
          conversation: conversationId,
          sender_id: user.id,
          content: content.trim(),
        });

      if (insertError) throw insertError;
      // The realtime subscription will handle adding the message to the state
    } catch (err: unknown) {
      console.error('Error sending message:', err);
      // Optionally, show a toast to the user
      setError('Failed to send message.');
    }
  };

  return { 
    messages, 
    loading, 
    error, 
    sendMessage,
    setMessages 
  };
};
