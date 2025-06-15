
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Bell, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface StickyHeaderProps {
  currentTime: Date;
}

const StickyHeader = ({ currentTime }: StickyHeaderProps) => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLocalization();
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
  };

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Greeting */}
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-900">
            {t('greeting.good_morning', 'Good Morning')}, {user?.name || 'User'}!
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(currentTime)} • {user?.location || 'Mumbai, Maharashtra'}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="h-8 w-8 p-0"
          >
            <Globe className="w-4 h-4" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/notifications')}
            className="h-8 w-8 p-0 relative"
          >
            <Bell className="w-4 h-4" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;
