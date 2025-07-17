
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedWrapper from './AnimatedWrapper';
import CompactRoleSwitcher from "@/components/CompactRoleSwitcher";
import { useLocation } from "react-router-dom";
import { useLocalization } from "@/contexts/LocalizationContext";
import { useNotifications } from '@/contexts/NotificationContext';

const pageNames: Record<string, string> = {
  "/home": "Home",
  "/search": "Job Search",
  "/my-jobs": "My Jobs",
  "/profile": "Profile",
  "/messages": "Messages",
  "/notifications": "Notifications"
};

const HomeHeader = ({ currentTime }: { currentTime: Date }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocalization();
  const { unreadCount } = useNotifications(); // <-- Add this line

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('home.greetingMorning', 'Good Morning');
    if (hour < 17) return t('home.greetingAfternoon', 'Good Afternoon');
    return t('home.greetingEvening', 'Good Evening');
  };

  const showPage = pageNames[location.pathname] || "";

  return (
    <>
      <div className="relative bg-white p-0 shadow-none w-full">
        {/* App Brand and User Info */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <span 
              className="font-extrabold text-3xl tracking-tight text-black"
              style={{ fontFamily: "Inter, sans-serif" }}
            >fyke</span>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-900">
                {getGreeting()}! 👋
              </span>
              <span className="text-sm text-gray-600">
                {user?.name ?? user?.phone}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate('/notifications')}
              className="relative"
              aria-label="View notifications"
            >
              <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100">
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shadow border overflow-hidden select-none">
              <span className="text-lg font-bold text-gray-700 uppercase">
                {user?.name ? user?.name[0] : user?.phone?.[0] || 'U'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center min-h-[36px] pl-6 pr-2 text-xs text-gray-400 font-medium select-none">
          <span>{showPage}</span>
        </div>
        
        {/* Subtitle */}
        <div className="px-6 pb-3">
          <p className="text-gray-400 text-xs">
            {user?.role === 'jobseeker'
              ? t('home.jobseeker_subtitle', 'Ready to find work?')
              : t('home.employer_subtitle', 'Ready to hire?')}
          </p>
        </div>
      </div>
      <CompactRoleSwitcher />
    </>
  );
};

export default HomeHeader;
