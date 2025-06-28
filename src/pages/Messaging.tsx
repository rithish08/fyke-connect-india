import EnhancedMessaging from '@/components/messaging/EnhancedMessaging';
import BottomNavigation from '@/components/BottomNavigation';
import { useLocalization } from '@/contexts/LocalizationContext';

const Messaging = () => {
  const { t } = useLocalization();
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100 lg:hidden">
        <h1 className="text-xl font-bold text-gray-900">{t('messaging.title', 'Messages')}</h1>
        <p className="text-sm text-gray-500">{t('messaging.subtitle', 'Connect with employers and job seekers')}</p>
      </div>
      
      <div className="h-[calc(100vh-8rem)] lg:h-screen">
        <EnhancedMessaging />
      </div>
      
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Messaging;
