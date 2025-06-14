
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavigation from '@/components/BottomNavigation';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'job_match',
      title: 'New Job Match',
      message: 'Construction Worker position at BuildPro matches your profile',
      time: '5 min ago',
      read: false,
      icon: '🎯',
      action: 'View Job'
    },
    {
      id: 2,
      type: 'application_update',
      title: 'Application Status Updated',
      message: 'Your application for Delivery Executive has been reviewed',
      time: '1 hour ago',
      read: false,
      icon: '📋',
      action: 'View Application'
    },
    {
      id: 3,
      type: 'message',
      title: 'New Message',
      message: 'BuildPro Construction sent you a message',
      time: '2 hours ago',
      read: true,
      icon: '💬',
      action: 'Open Chat'
    },
    {
      id: 4,
      type: 'interview',
      title: 'Interview Reminder',
      message: 'Interview scheduled for tomorrow at 2:00 PM',
      time: '3 hours ago',
      read: false,
      icon: '📅',
      action: 'View Details'
    },
    {
      id: 5,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received ₹1,500 for cleaning work completed',
      time: '1 day ago',
      read: true,
      icon: '💰',
      action: 'View Payment'
    },
    {
      id: 6,
      type: 'emergency',
      title: 'Emergency Job Alert',
      message: 'Urgent construction work available nearby - Premium pay!',
      time: '2 days ago',
      read: true,
      icon: '🚨',
      action: 'Apply Now'
    }
  ];

  const getNotificationsByType = (type: string) => {
    if (type === 'all') return notifications;
    return notifications.filter(notification => notification.type === type);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'job_match':
        return 'bg-blue-100 text-blue-700';
      case 'application_update':
        return 'bg-green-100 text-green-700';
      case 'message':
        return 'bg-purple-100 text-purple-700';
      case 'interview':
        return 'bg-orange-100 text-orange-700';
      case 'payment':
        return 'bg-emerald-100 text-emerald-700';
      case 'emergency':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const NotificationCard = ({ notification }: { notification: any }) => (
    <Card className={`p-4 ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{notification.icon}</div>
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
              <span className="text-xs text-gray-500">{notification.time}</span>
              <Badge variant="outline" className={`text-xs ${getTypeColor(notification.type)}`}>
                {notification.type.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              {notification.action}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-600">Stay updated with your job activities</p>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600">
            Mark All Read
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
