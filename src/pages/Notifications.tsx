import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavigation from '@/components/BottomNavigation';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

const Notifications = () => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    getNotificationIcon,
    getNotificationTypeColor,
    getNotificationAction,
  } = useNotifications();

  // Get notifications filtered by type
  const getNotificationsByType = (type: string) => {
    if (type === 'all') return notifications;
    return notifications.filter(notification => notification.type === type);
  };

  // Handle notification action
  const handleAction = async (notification: any) => {
    // Mark as read
    await markAsRead(notification.id);
    
    // Navigate based on type
    switch (notification.type) {
      case 'job_match':
      case 'job_posted':
      case 'emergency':
      case 'urgent_job':
        if (notification.data?.job_id) {
          navigate(`/job/${notification.data.job_id}`);
        } else {
          navigate('/search');
        }
        break;
      case 'application_update':
      case 'application_received':
      case 'application_accepted':
      case 'application_rejected':
        navigate('/my-jobs');
        break;
      case 'interview':
      case 'interview_scheduled':
        if (notification.data?.job_id) {
          navigate(`/job/${notification.data.job_id}`);
        } else {
          navigate('/my-jobs');
        }
        break;
      case 'payment':
      case 'payment_received':
        navigate('/profile');
        break;
      case 'message':
      case 'new_message':
        if (notification.data?.conversation_id) {
          navigate(`/requests?conversationId=${notification.data.conversation_id}`);
        } else {
          navigate('/requests');
        }
        break;
      case 'profile_verified':
      case 'rating':
      case 'review':
        navigate('/profile');
        break;
      default:
        break;
    }
  };

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card className={`p-4 transition-all ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl" role="img" aria-label={`${notification.type} notification`}>
          {getNotificationIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
              {notification.title}
            </h3>
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-600 rounded-full" aria-label={t('notifications.unread', 'Unread')}></div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <time className="text-xs text-gray-500" dateTime={notification.created_at}>
                {notification.created_at ? new Date(notification.created_at).toLocaleString() : ''}
              </time>
              <Badge variant="outline" className={`text-xs ${getNotificationTypeColor(notification.type)}`}>
                {notification.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs" 
              onClick={() => handleAction(notification)}
              aria-label={`${getNotificationAction(notification.type)} for ${notification.title}`}
            >
              {getNotificationAction(notification.type)}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white shadow-sm p-4 border-b border-gray-100 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="mr-2" title="Back to previous page"><ArrowLeft /></button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">{t('notifications.title', 'Notifications')}</h1>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="ml-2">
            {t('notifications.markAllRead', 'Mark all as read')}
          </Button>
        )}
      </div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center text-gray-500">{t('notifications.loading', 'Loading notifications...')}</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <div className="text-5xl mb-4">🔔</div>
            <div className="text-lg font-semibold mb-2">{t('notifications.emptyTitle', 'No Notifications')}</div>
            <div className="text-gray-500">{t('notifications.emptyDesc', 'You have no notifications yet.')}</div>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="all">{t('notifications.all', 'All')}</TabsTrigger>
              <TabsTrigger value="unread">{t('notifications.unread', 'Unread')} {unreadCount > 0 && <Badge className="ml-1">{unreadCount}</Badge>}</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="space-y-4">
                {notifications.map(n => <NotificationCard key={n.id} notification={n} />)}
              </div>
            </TabsContent>
            <TabsContent value="unread">
              <div className="space-y-4">
                {notifications.filter(n => !n.read).map(n => <NotificationCard key={n.id} notification={n} />)}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Notifications;