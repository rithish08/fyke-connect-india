
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from "react-router-dom";
import { useLocalization } from "@/hooks/useLocalization";
import { Bell, User } from 'lucide-react';

const pageNames: Record<string, string> = {
  "/home": "Home",
  "/search": "Job Search", 
  "/my-jobs": "My Jobs",
  "/profile": "Profile",
  "/messages": "Messages",
  "/notifications": "Notifications"
};

interface MobileOptimizedHeaderProps {
  currentTime: Date;
}

const MobileOptimizedHeader = ({ currentTime }: MobileOptimizedHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { getLocalizedText } = useLocalization();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return getLocalizedText('home.greetingMorning', 'Good Morning');
    if (hour < 17) return getLocalizedText('home.greetingAfternoon', 'Good Afternoon');
    return getLocalizedText('home.greetingEvening', 'Good Evening');
  };

  const showPage = pageNames[location.pathname] || "";

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
      {/* Brand Bar */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-gray-50">
        <span className="font-black text-xl text-gray-900 tracking-tight">fyke</span>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
              3
            </span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border hover:bg-gray-200 transition-colors"
            aria-label="Profile"
          >
            <User className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Page Context */}
      <div className="px-4 py-3">
        {showPage && (
          <div className="text-xs text-gray-400 font-medium mb-1">
            {showPage}
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 truncate">
              {getGreeting()}! 👋
            </h1>
            <p className="text-gray-600 text-sm truncate">
              {user?.name ?? user?.phone}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {user?.role === 'jobseeker'
                ? getLocalizedText('home.jobseeker_subtitle', 'Ready to find work?')
                : getLocalizedText('home.employer_subtitle', 'Ready to hire?')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileOptimizedHeader;
