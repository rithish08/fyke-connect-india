
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Bell, ArrowRightLeft, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const pageNames: Record<string, string> = {
  "/home": "Home",
  "/search": "Job Search",
  "/my-jobs": "My Jobs",
  "/profile": "Profile",
  "/messaging": "Messages",
  "/notifications": "Notifications"
};

const UnifiedHeader = ({ currentTime }: { currentTime: Date }) => {
  const { userProfile, switchRole } = useAuth();
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
  const isJobSeeker = userProfile?.role === "jobseeker";
  const roleDisplayName = isJobSeeker ? t('role.jobseeker', 'Job Seeker') : t('role.employer', 'Employer');

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
      {/* Top Header with Brand, Role, and Bell */}
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center space-x-3">
          <span 
            className="font-bold text-3xl tracking-tight text-black"
            style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
          >fyke</span>
          <span className="text-gray-300 text-2xl font-light">/</span>
          <span className="text-sm font-medium text-gray-600 capitalize bg-gray-100 px-3 py-1 rounded-full">
            {roleDisplayName}
          </span>
        </div>
        <button 
          onClick={() => navigate('/notifications')}
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm animate-pulse">3</span>
        </button>
      </div>

      {/* User Info with Role Switcher */}
      <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-lg font-semibold text-gray-800">
              {getGreeting()}! 👋
            </p>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {userProfile?.name ?? userProfile?.phone}
          </p>
        </div>
        
        <div className="flex items-center">
          <Button
            onClick={switchRole}
            variant="outline"
            size="sm"
            className="h-10 px-4 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 border-2 border-gray-200 hover:border-blue-300 flex items-center space-x-2"
            title={`Switch to ${isJobSeeker ? 'Employer' : 'Job Seeker'}`}
          >
            <div className={`flex items-center justify-center w-6 h-6 rounded-full ${
              isJobSeeker ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {isJobSeeker ? <User className="w-4 h-4 text-blue-600" /> : <Users className="w-4 h-4 text-green-600" />}
            </div>
            <ArrowRightLeft className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Switch</span>
          </Button>
        </div>
      </div>

      {/* Page Name */}
      {showPage && (
        <div className="flex items-center min-h-[32px] px-4 pb-2 text-sm text-gray-500 font-medium select-none border-b border-gray-50 bg-gray-50">
          <span>{showPage}</span>
        </div>
      )}
    </div>
  );
};

export default UnifiedHeader;
