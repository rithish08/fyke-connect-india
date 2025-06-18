
import { useLocation } from 'react-router-dom';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useUserFlow } from '@/hooks/useUserFlow';
import { Home, Search, ClipboardList, Mail, User as UserIcon, Users } from "lucide-react";
import { useCallback } from 'react';

const iconSize = 20;

const EMPLOYER_NAV = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Home' },
  { path: '/search', icon: Users, labelKey: 'nav.workers', label: 'Workers' },
  { path: '/my-jobs', icon: ClipboardList, labelKey: 'nav.posts', label: 'My Posts' },
  { path: '/messages', icon: Mail, labelKey: 'nav.messages', label: 'Messages' },
  { path: '/profile', icon: UserIcon, labelKey: 'nav.profile', label: 'Profile' }
];

const JOBSEEKER_NAV = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Home' },
  { path: '/search', icon: Search, labelKey: 'nav.jobs', label: 'Jobs' },
  { path: '/my-jobs', icon: ClipboardList, labelKey: 'nav.myjobs', label: 'My Jobs' },
  { path: '/messages', icon: Mail, labelKey: 'nav.messages', label: 'Messages' },
  { path: '/profile', icon: UserIcon, labelKey: 'nav.profile', label: 'Profile' }
];

const BottomNavigation = () => {
  const location = useLocation();
  const { goTo } = useScreenNavigation();
  const { user } = useAuth();
  const { t } = useLocalization();
  const { isFlowComplete } = useUserFlow();

  const handleNavigation = useCallback((path: string) => {
    // Prevent rapid clicks causing navigation issues
    if (location.pathname !== path) {
      goTo(path);
    }
  }, [location.pathname, goTo]);

  // Don't show navigation if flow is not complete
  if (!isFlowComplete) {
    return null;
  }

  // Don't show on setup/onboarding screens
  const hiddenPaths = ['/', '/login', '/otp-verification', '/role-selection', '/profile-setup'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const navItems = user?.role === 'employer' ? EMPLOYER_NAV : JOBSEEKER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
      <div className="max-w-2xl mx-auto flex justify-between items-center px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center flex-1 px-1 py-2 rounded-lg transition-all duration-200 group
                 ${isActive
                  ? 'bg-gray-900 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
              style={{minWidth: 0}}
              disabled={isActive} // Prevent clicking on already active tab
            >
              <span className={`mb-1 transition-transform duration-150 flex items-center justify-center`}>
                <item.icon size={iconSize} strokeWidth={2} className={isActive ? "text-white" : "text-gray-500 group-hover:text-gray-900"} />
              </span>
              <span className={`text-[9px] font-medium ${isActive ? 'text-white' : 'text-gray-700'} truncate leading-tight`}>
                {t(item.labelKey, item.label)}
              </span>
              {isActive && (
                <span className="w-1 h-1 mt-1 rounded-full bg-white/90" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
