// src/pages/Notifications.tsx

import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShimmerLoader } from '@/components/ui/ShimmerLoader'; // Assuming a shimmer loader exists

const Notifications = () => {
  const { notifications, loading, markAllAsRead, unreadCount, error } = useNotifications();
  const navigate = useNavigate();

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck className="w-5 h-5 mr-2" />
            Mark all as read
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          // Loading State
          <div className="space-y-4">
            <ShimmerLoader className="h-20 w-full rounded-lg" />
            <ShimmerLoader className="h-20 w-full rounded-lg" />
            <ShimmerLoader className="h-20 w-full rounded-lg" />
          </div>
        ) : notifications.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <p className="text-gray-500">You have no notifications yet.</p>
          </div>
        ) : (
          // Notifications List
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-colors ${!notification.is_read ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
            >
              <div className="flex items-start space-x-4">
                {!notification.is_read && (
                  <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{notification.title}</p>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
