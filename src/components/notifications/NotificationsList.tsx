
import React, { useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, User, Briefcase, MessageCircle, Star } from 'lucide-react';

const NotificationsList = () => {
  const { t } = useLocalization();
  const [notifications] = useState([
    {
      id: '1',
      type: 'application',
      title: 'New Job Application',
      message: 'Rahul Kumar applied for Construction Worker position',
      time: '2 hours ago',
      read: false,
      icon: User
    },
    {
      id: '2',
      type: 'job_match',
      title: 'New Job Match',
      message: 'Plumber job in Andheri matches your profile',
      time: '4 hours ago',
      read: false,
      icon: Briefcase
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message',
      message: 'Employer sent you a message about the plumbing job',
      time: '6 hours ago',
      read: true,
      icon: MessageCircle
    },
    {
      id: '4',
      type: 'rating',
      title: 'New Rating',
      message: 'You received a 5-star rating from your last job',
      time: '1 day ago',
      read: true,
      icon: Star
    },
    {
      id: '5',
      type: 'system',
      title: 'Profile Update',
      message: 'Your profile has been verified successfully',
      time: '2 days ago',
      read: true,
      icon: CheckCircle
    }
  ]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application': return 'text-blue-600 bg-blue-100';
      case 'job_match': return 'text-green-600 bg-green-100';
      case 'message': return 'text-purple-600 bg-purple-100';
      case 'rating': return 'text-yellow-600 bg-yellow-100';
      case 'system': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderNotification = (notification: any) => {
    const Icon = notification.icon;
    return (
      <Card key={notification.id} className={`mb-3 ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-medium text-gray-900 ${!notification.read ? 'font-semibold' : ''}`}>
                  {notification.title}
                </h3>
                {!notification.read && (
                  <Badge variant="default" className="bg-blue-600 text-white">
                    {t('notifications.new', 'New')}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
              <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6" />
            {t('notifications.title', 'Notifications')}
          </h1>
          <p className="text-gray-600">
            {t('notifications.subtitle', 'Stay updated with your activity')}
          </p>
        </div>
        <Button variant="outline" size="sm">
          {t('notifications.mark_all_read', 'Mark All Read')}
        </Button>
      </div>

      {/* Notification Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('notifications.all', 'All')}</TabsTrigger>
          <TabsTrigger value="unread">{t('notifications.unread', 'Unread')}</TabsTrigger>
          <TabsTrigger value="jobs">{t('notifications.jobs', 'Jobs')}</TabsTrigger>
          <TabsTrigger value="messages">{t('notifications.messages', 'Messages')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {notifications.map(renderNotification)}
        </TabsContent>
        
        <TabsContent value="unread" className="mt-6">
          {notifications.filter(n => !n.read).map(renderNotification)}
        </TabsContent>
        
        <TabsContent value="jobs" className="mt-6">
          {notifications.filter(n => ['application', 'job_match'].includes(n.type)).map(renderNotification)}
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          {notifications.filter(n => n.type === 'message').map(renderNotification)}
        </TabsContent>
      </Tabs>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">
            {t('notifications.no_notifications', 'No notifications yet')}
          </h3>
          <p className="text-gray-600">
            {t('notifications.empty_message', 'We\'ll notify you when something important happens')}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
