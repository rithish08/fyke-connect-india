import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { notificationService } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Notifications = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState('all');
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
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
        setNotifications(data || []);
      } catch (err) {
        setError(t('notifications.loadError', 'Failed to load notifications.'));
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user, t]);

  // Map notification type to icon and action
  const getIcon = (type: string) => {
    switch (type) {
      case 'job_match': return '🎯';
      case 'application_update': return '📋';
      case 'message': return '💬';
      case 'interview': return '📅';
      case 'payment': return '💰';
      case 'emergency': return '🚨';
      default: return '🔔';
    }
  };
  const getAction = (type: string) => {
    switch (type) {
      case 'job_match': return t('notifications.viewJob', 'View Job');
      case 'application_update': return t('notifications.viewApplication', 'View Application');
      case 'message': return t('notifications.openChat', 'Open Chat');
      case 'interview': return t('notifications.viewDetails', 'View Details');
      case 'payment': return t('notifications.viewPayment', 'View Payment');
      case 'emergency': return t('notifications.applyNow', 'Apply Now');
      default: return t('notifications.view', 'View');
    }
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job_match': return 'bg-blue-100 text-blue-700';
      case 'application_update': return 'bg-green-100 text-green-700';
      case 'message': return 'bg-purple-100 text-purple-700';
      case 'interview': return 'bg-orange-100 text-orange-700';
      case 'payment': return 'bg-emerald-100 text-emerald-700';
      case 'emergency': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getNotificationsByType = (type: string) => {
    if (type === 'all') return notifications;
    return notifications.filter(notification => notification.type === type);
  };

  const handleAction = async (notification: any) => {
    // Mark as read in DB
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification.id);
      setNotifications((prev) => prev.map((n) => n.id === notification.id ? { ...n, read: true } : n));
    } catch (err) {
      toast({ title: t('notifications.markReadError', 'Failed to mark as read') });
    }
    // Navigate based on type
    switch (notification.type) {
      case 'job_match':
      case 'emergency':
        if (notification.data?.job_id) navigate(`/jobs/${notification.data.job_id}`);
        break;
      case 'application_update':
        if (notification.data?.application_id) navigate(`/applications/${notification.data.application_id}`);
        break;
      case 'interview':
        if (notification.data?.job_id) navigate(`/jobs/${notification.data.job_id}`);
        break;
      case 'payment':
        if (notification.data?.payment_id) navigate(`/payments/${notification.data.payment_id}`);
        break;
      case 'message':
        if (notification.data?.conversation_id) navigate(`/messages?conversationId=${notification.data.conversation_id}`);
        break;
      default:
        break;
    }
  };

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card className={`p-4 ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{getIcon(notification.type)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
              {notification.title}
            </h3>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}</span>
              <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                {notification.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="text-xs" onClick={() => handleAction(notification)} disabled={notification.read}>
              {getAction(notification.type)}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-center text-gray-500">{t('notifications.loading', 'Loading notifications...')}</div></div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center bg-white"><div className="text-center text-red-500">{error}</div></div>;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label={t('common.back', 'Back')} onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('notifications.title', 'Notifications')}</h1>
            <p className="text-sm text-gray-500">{t('notifications.subtitle', 'Stay updated with your job activities')}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-700">
            {t('notifications.markAllRead', 'Mark All Read')}
          </Button>
        </div>
      </div>
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="job_match">Jobs</TabsTrigger>
            <TabsTrigger value="message">Messages</TabsTrigger>
            <TabsTrigger value="application_update">Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {getNotificationsByType('all').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </TabsContent>

          <TabsContent value="job_match" className="space-y-4 mt-6">
            {getNotificationsByType('job_match').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
            {getNotificationsByType('job_match').length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Matches</h3>
                <p className="text-gray-600">We'll notify you when jobs matching your profile are posted</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="message" className="space-y-4 mt-6">
            {getNotificationsByType('message').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
            {getNotificationsByType('message').length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Message Notifications</h3>
                <p className="text-gray-600">Message notifications will appear here</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="application_update" className="space-y-4 mt-6">
            {getNotificationsByType('application_update').map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
            {getNotificationsByType('application_update').length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Updates</h3>
                <p className="text-gray-600">Application status updates will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Notifications;