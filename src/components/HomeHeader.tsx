
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from "react-router-dom";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';

const pageNames: Record<string, string> = {
  "/home": "Home",
  "/search": "Job Search",
  "/my-jobs": "My Jobs",
  "/profile": "Profile",
  "/messages": "Messages",
  "/notifications": "Notifications"
};

const HomeHeader = ({ currentTime }: { currentTime: Date }) => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocalization();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('home.greetingMorning', 'Good Morning');
    if (hour < 17) return t('home.greetingAfternoon', 'Good Afternoon');
    return t('home.greetingEvening', 'Good Evening');
  };

  const showPage = pageNames[location.pathname] || "";

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Brand & Greeting */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">F</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getGreeting()}! 👋
              </h1>
              <p className="text-sm text-gray-600">
                {userProfile?.name || userProfile?.phone}
              </p>
            </div>
          </div>

          {/* Right: Language & Notifications */}
          <div className="flex items-center space-x-3">
            {/* Language Dropdown */}
            <Button variant="outline" size="sm" className="rounded-xl border-gray-200 h-10">
              <span className="text-lg mr-2">🇺🇸</span>
              <span className="text-sm font-medium">EN</span>
              <ChevronDown className="w-4 h-4 ml-1" />
            </Button>

            {/* Notifications */}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/notifications')}
              className="relative rounded-xl border-gray-200 h-10 w-10 p-0"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                3
              </span>
            </Button>

            {/* Profile */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-sm border">
              <span className="text-sm font-bold text-gray-700 uppercase">
                {userProfile?.name ? userProfile?.name[0] : userProfile?.phone?.[0] || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Page Title */}
      {showPage && (
        <div className="px-6 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{showPage}</h2>
            <p className="text-sm text-gray-500">
              {userProfile?.role === 'jobseeker'
                ? t('home.jobseeker_subtitle', 'Ready to find work?')
                : t('home.employer_subtitle', 'Ready to hire?')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeHeader;
