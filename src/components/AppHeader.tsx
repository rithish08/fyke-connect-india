
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
  "/messages": "Messages",
  "/notifications": "Notifications"
};

const AppHeader = ({ currentTime }: { currentTime: Date }) => {
  const { user, switchRole } = useAuth();
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
  const isJobSeeker = user?.role === "jobseeker";
  const roleDisplayName = isJobSeeker ? t('role.jobseeker', 'Job Seeker') : t('role.employer', 'Employer');

  return (
    <>
      <div className="relative bg-white p-0 shadow-none w-full">
        {/* Top Header with Brand, Role, and Bell */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/95579b46-46db-46cc-a5d9-82155bddfc21.png" 
              alt="fyke logo"
              className="h-8 w-auto"
            />
            <span className="text-gray-300 text-2xl font-light">/</span>
            <span className="text-sm font-medium text-gray-500 capitalize">{roleDisplayName}</span>
          </div>
          <button 
            onClick={() => navigate('/notifications')}
            className="relative flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm">3</span>
          </button>
        </div>
        
        {/* User Info with Role Switcher */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-lg font-semibold text-gray-800">
                {getGreeting()}! 👋
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {user?.name ?? user?.phone}
            </p>
          </div>
          
          {/* Compact Role Switcher */}
          <div className="flex items-center">
            <Button
              onClick={switchRole}
              variant="outline"
              size="sm"
              className="h-9 px-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 border flex items-center space-x-2"
              title={`Switch to ${isJobSeeker ? 'Employer' : 'Job Seeker'}`}
            >
              <div className={`flex items-center justify-center w-5 h-5 rounded-full ${
                isJobSeeker ? 'bg-blue-100' : 'bg-green-100'
              }`}>
                {isJobSeeker ? <User className="w-3 h-3 text-blue-600" /> : <Users className="w-3 h-3 text-green-600" />}
              </div>
              <ArrowRightLeft className="w-3.5 h-3.5 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Switch</span>
            </Button>
          </div>
        </div>

        {/* Page Name */}
        <div className="flex items-center min-h-[28px] px-4 pb-2 text-xs text-gray-400 font-medium select-none border-b border-gray-50">
          <span>{showPage}</span>
        </div>
      </div>
    </>
  );
};

export default AppHeader;
