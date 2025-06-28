import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Bell, Globe, ChevronDown, MapPin, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useLocation } from '@/hooks/useLocation';
import { cn } from '@/lib/utils';

const languageList = [
  { code: 'en', name: 'English', native: 'English', icon: "🇬🇧" },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', icon: "🇮🇳" },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', icon: "🇮🇳" },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', icon: "🇮🇳" },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', icon: "🇮🇳" },
  { code: 'mr', name: 'Marathi', native: 'मराठी', icon: "🇮🇳" }
];

const StickyHeader = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLocalization();
  const { address, loading, refreshLocation } = useLocation();
  const navigate = useNavigate();
  
  const currentLanguage = languageList.find(lang => lang.code === language) || languageList[0];

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-4 py-6">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Location */}
        <div>
          <span
            className="font-black text-3xl tracking-tighter text-black"
            style={{ fontFamily: "sans-serif" }}
          >
            fyke
          </span>
          <div className="flex items-center gap-1 mt-0">
            <MapPin className="w-3 h-3 text-gray-400" />
            <p className="text-xs text-gray-400">{address}</p>
            <Button variant="ghost" size="sm" className="h-5 w-5 p-0" onClick={refreshLocation} disabled={loading}>
              <RefreshCw className={cn("w-3 h-3 text-gray-400", loading && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-2">
          {/* Language Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 px-2 flex items-center space-x-1">
                <span className="text-lg">{currentLanguage.icon}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {languageList.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center space-x-3 p-2 ${language === lang.code ? 'bg-blue-50' : ''}`}
                >
                  <span className="text-xl">{lang.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{lang.native}</div>
                    <div className="text-xs text-gray-500">{lang.name}</div>
                  </div>
                  {language === lang.code && <span className="text-blue-600 text-lg">✓</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/notifications')}
            className="h-9 w-9 p-0 relative"
          >
            <Bell className="w-5 h-5" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-xs text-white flex items-center justify-center">
              3
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StickyHeader;
