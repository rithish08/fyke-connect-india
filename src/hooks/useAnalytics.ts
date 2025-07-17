// src/hooks/useAnalytics.ts
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAnalytics = () => {
  const { user } = useAuth();

  const trackEvent = useCallback(async (event: string, properties: Record<string, any> = {}) => {
    try {
      const { error } = await supabase.functions.invoke('analytics', {
        body: {
          userId: user?.id,
          event,
          properties,
        },
      });
      if (error) {
        console.error('Failed to track analytics event:', error);
      }
    } catch (e) {
      console.error('Error invoking analytics function:', e);
    }
  }, [user]);

  return { trackEvent };
};
