
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Bell, ArrowRightLeft, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollingNotification from "./ScrollingNotification";
import { getResponsiveTextSize } from "@/utils/textSizing";

const pageNames: Record<string, string> = {
  "/home": "home.title",
  "/search": "search.title", 
  "/my-jobs": "jobs.title",
  "/profile": "profile.title",
  "/messages": "messages.title",
  "/notifications": "notifications.title"
};

const StickyHeader = ({ currentTime }: { currentTime: Date }) => {
  const { user, switchRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocalization();

  const pageKey = pageNames[location.pathname] || "app.title";
  const pageTitle = t(pageKey, "App");
  const isJobSeeker = user?.role === "jobseeker";
  const roleDisplayName = isJobSeeker ? t('role.jobseeker', 'Job Seeker') : t('role.employer', 'Employer');

  const roleFontSize = getResponsiveTextSize(roleDisplayName, {
    baseSize: 12,
    minSize: 10,
    maxSize: 14
  });

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      {/* Scrolling Notification Bar */}
      <ScrollingNotification />
      
      {/* Main Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-50">
        <div className="flex items-center space-x-3">
          <span className="font-extrabold text-2xl sm:text-3xl text-black tracking-tight" style={{fontFamily: 'Montserrat, sans-serif', textTransform: 'lowercase', letterSpacing: '-0.015em'}}>fyke</span>
          <span className="text-gray-300 text-2xl font-light">/</span>
          <div 
            className="px-2 py-1 rounded-full bg-gray-100 font-medium text-gray-600 capitalize max-w-[100px] overflow-hidden"
            style={{ fontSize: roleFontSize }}
          >
            <span className="truncate block">{roleDisplayName}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Role Switcher */}
          <Button
            onClick={switchRole}
            variant="outline"
            size="sm"
            className="h-8 px-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 border flex items-center space-x-1.5"
            title={`Switch to ${isJobSeeker ? 'Employer' : 'Job Seeker'}`}
          >
            <div className={`flex items-center justify-center w-4 h-4 rounded-full ${
              isJobSeeker ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              {isJobSeeker ? <User className="w-2.5 h-2.5 text-blue-600" /> : <Users className="w-2.5 h-2.5 text-green-600" />}
            </div>
            <ArrowRightLeft className="w-3 h-3 text-gray-600" />
          </Button>
          
          {/* Notification Bell */}
          <button 
            onClick={() => navigate('/notifications')}
            className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Bell className="w-4 h-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-sm">3</span>
          </button>
        </div>
      </div>

      {/* Page Title */}
      <div className="flex items-center min-h-[32px] px-4 py-2 text-sm text-gray-500 font-medium border-b border-gray-50">
        <span>{pageTitle}</span>
      </div>
    </div>
  );
};

export default StickyHeader;
