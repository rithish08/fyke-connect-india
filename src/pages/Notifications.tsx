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
          navigate(`/messages?conversationId=${notification.data.conversation_id}`);
        } else {
          navigate('/messages');
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
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-700"
              onClick={markAllAsRead}
              aria-label={t('notifications.markAllRead', 'Mark All Read')}
            >
              {t('notifications.markAllRead', 'Mark All Read')}
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all" className="text-xs sm:text-sm">
              {t('notifications.all', 'All')} {unreadCount > 0 && `(${unreadCount})`}
            </TabsTrigger>
            <TabsTrigger value="job_match" className="text-xs sm:text-sm">
              {t('notifications.jobs', 'Jobs')}
            </TabsTrigger>
            <TabsTrigger value="message" className="text-xs sm:text-sm">
              {t('notifications.messages', 'Messages')}
            </TabsTrigger>
            <TabsTrigger value="application_update" className="text-xs sm:text-sm">
              {t('notifications.updates', 'Updates')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {getNotificationsByType('all').length > 0 ? (
              getNotificationsByType('all').map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🔔</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('notifications.noNotifications', 'No Notifications')}
                </h3>
                <p className="text-gray-600">
                  {t('notifications.noNotificationsDesc', 'You\'re all caught up! New notifications will appear here.')}
                </p>
              </div>
            )}
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