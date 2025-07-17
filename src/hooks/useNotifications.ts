import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';

interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      
      const notificationsData = data || [];
      setNotifications(notificationsData);
      setUnreadCount(notificationsData.filter(n => !n.read).length);
    } catch (err: any) {
      setError(t('notifications.loadError', 'Failed to load notifications.'));
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast({ title: t('notifications.markedRead', 'Notification marked as read') });
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast({
        title: t('notifications.markReadError', 'Failed to mark as read'),
        description: err?.message || 'Unknown error',
        variant: 'destructive'
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      
      toast({
        title: t('notifications.allMarkedRead', 'All notifications marked as read'),
      });
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      toast({
        title: t('notifications.markAllReadError', 'Failed to mark all as read'),
        variant: 'destructive'
      });
    }
  };

  // Create a new notification (for testing or system use)
  const createNotification = async (notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          ...notification,
          read: false
        });

      if (error) throw error;
      await fetchNotifications(); // Refresh notifications
    } catch (err: any) {
      console.error('Error creating notification:', err);
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string): string => {
    switch (type) {
      case 'job_match':
      case 'job_posted':
        return '🎯';
      case 'application_update':
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        return '📋';
      case 'message':
      case 'new_message':
        return '💬';
      case 'interview':
      case 'interview_scheduled':
        return '📅';
      case 'payment':
      case 'payment_received':
        return '💰';
      case 'emergency':
      case 'urgent_job':
        return '🚨';
      case 'profile_verified':
        return '✅';
      case 'rating':
      case 'review':
        return '⭐';
      default:
        return '🔔';
    }
  };

  // Get notification type color
  const getNotificationTypeColor = (type: string): string => {
    switch (type) {
      case 'job_match':
      case 'job_posted':
        return 'bg-blue-100 text-blue-700';
      case 'application_update':
      case 'application_received':
      case 'application_accepted':
        return 'bg-green-100 text-green-700';
      case 'application_rejected':
        return 'bg-red-100 text-red-700';
      case 'message':
      case 'new_message':
        return 'bg-purple-100 text-purple-700';
      case 'interview':
      case 'interview_scheduled':
        return 'bg-orange-100 text-orange-700';
      case 'payment':
      case 'payment_received':
        return 'bg-emerald-100 text-emerald-700';
      case 'emergency':
      case 'urgent_job':
        return 'bg-red-100 text-red-700';
      case 'profile_verified':
        return 'bg-green-100 text-green-700';
      case 'rating':
      case 'review':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // Get notification action text
  const getNotificationAction = (type: string): string => {
    switch (type) {
      case 'job_match':
      case 'job_posted':
        return t('notifications.viewJob', 'View Job');
      case 'application_update':
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        return t('notifications.viewApplication', 'View Application');
      case 'message':
      case 'new_message':
        return t('notifications.openChat', 'Open Chat');
      case 'interview':
      case 'interview_scheduled':
        return t('notifications.viewDetails', 'View Details');
      case 'payment':
      case 'payment_received':
        return t('notifications.viewPayment', 'View Payment');
      case 'emergency':
      case 'urgent_job':
        return t('notifications.applyNow', 'Apply Now');
      case 'profile_verified':
        return t('notifications.viewProfile', 'View Profile');
      case 'rating':
      case 'review':
        return t('notifications.viewRating', 'View Rating');
      default:
        return t('notifications.view', 'View');
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [user]);

  return {
    notifications,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    getNotificationIcon,
    getNotificationTypeColor,
    getNotificationAction,
  };
};