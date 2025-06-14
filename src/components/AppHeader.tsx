
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import CompactRoleSwitcher from "@/components/CompactRoleSwitcher";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Bell } from "lucide-react";

const pageNames: Record<string, string> = {
  "/home": "Home",
  "/search": "Job Search",
  "/my-jobs": "My Jobs",
  "/profile": "Profile",
  "/messages": "Messages",
  "/notifications": "Notifications"
};

const AppHeader = ({ currentTime }: { currentTime: Date }) => {
  const { user } = useAuth();
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
    <>
      <div className="relative bg-white p-0 shadow-none w-full">
        {/* App Brand with Bell Icon */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
          <span className="font-black text-3xl text-gray-900 tracking-tight">fyke</span>
          <button 
            onClick={() => navigate('/notifications')}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm">3</span>
          </button>
        </div>
        
        {/* User Info - Small and Faded */}
        <div className="px-4 py-2 space-y-0.5">
          <p className="text-sm text-gray-500 font-medium">
            {user?.name ?? user?.phone}
          </p>
          <p className="text-xs text-gray-400">
            {getGreeting()}! 👋
          </p>
        </div>

        {/* Page Name */}
        <div className="flex items-center min-h-[28px] px-4 pb-1 text-xs text-gray-400 font-medium select-none border-b border-gray-50">
          <span>{showPage}</span>
        </div>
      </div>
      {/* CompactRoleSwitcher - always show for quick role toggle */}
      <div className="px-4 pb-2">
        <CompactRoleSwitcher />
      </div>
    </>
  );
};

export default AppHeader;
