
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Bell, Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface StickyHeaderProps {
  currentTime: Date;
}

const languageList = [
  { code: 'en', name: 'English', native: 'English', icon: "🇬🇧" },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: "🇮🇳" },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', icon: "🇮🇳" },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', icon: "🇮🇳" },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', icon: "🇮🇳" },
  { code: 'mr', name: 'Marathi', native: 'मराठी', icon: "🇮🇳" }
];

const StickyHeader = ({ currentTime }: StickyHeaderProps) => {
  const { userProfile } = useAuth();
  const { currentLanguage, setLanguage, t } = useLocalization();
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const currentLanguage_ = languageList.find(lang => lang.code === currentLanguage) || languageList[0];

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Greeting */}
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-900">
            {t('greeting.good_morning', 'Good Morning')}, {userProfile?.name || 'User'}!
          </div>
          <div className="text-sm text-gray-500">
            {formatTime(currentTime)} • {userProfile?.location || 'Mumbai, Maharashtra'}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2 flex items-center space-x-1">
                <span className="text-sm">{currentLanguage_.icon}</span>
                <ChevronDown className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languageList.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center space-x-3 ${currentLanguage === lang.code ? 'bg-blue-50' : ''}`}
                >
                  <span>{lang.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{lang.native}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </div>
                  {currentLanguage === lang.code && <span className="text-blue-600">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
