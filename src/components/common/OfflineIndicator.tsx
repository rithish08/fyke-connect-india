
import { useOfflineCapabilities } from '@/hooks/useOfflineCapabilities';
import { useEnhancedLocalization } from '@/hooks/useEnhancedLocalization';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const { isOnline } = useOfflineCapabilities();
  const { t } = useEnhancedLocalization();

  if (isOnline) return null;

  return (
    <div className="bg-amber-100 border-l-4 border-amber-500 p-3 mx-4 rounded-r-lg">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 text-amber-600" />
        <div>
          <p className="text-sm font-medium text-amber-800">{t('offline.title')}</p>
          <p className="text-xs text-amber-700">{t('offline.message')}</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
