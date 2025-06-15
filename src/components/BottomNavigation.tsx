
import { useLocation } from 'react-router-dom';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useUserFlow } from '@/hooks/useUserFlow';
import { Home, Search, ClipboardList, Mail, User as UserIcon, Users } from "lucide-react";
import { useCallback } from 'react';

const iconSize = 22;

const EMPLOYER_NAV = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Home' },
  { path: '/search', icon: Users, labelKey: 'nav.workers', label: 'Workers' },
  { path: '/my-jobs', icon: ClipboardList, labelKey: 'nav.posts', label: 'My Posts' },
  { path: '/messaging', icon: Mail, labelKey: 'nav.messages', label: 'Messages' },
  { path: '/profile', icon: UserIcon, labelKey: 'nav.profile', label: 'Profile' }
];

const JOBSEEKER_NAV = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Home' },
  { path: '/search', icon: Search, labelKey: 'nav.jobs', label: 'Jobs' },
  { path: '/my-jobs', icon: ClipboardList, labelKey: 'nav.myjobs', label: 'My Jobs' },
  { path: '/messaging', icon: Mail, labelKey: 'nav.messages', label: 'Messages' },
  { path: '/profile', icon: UserIcon, labelKey: 'nav.profile', label: 'Profile' }
];

const BottomNavigation = () => {
  const location = useLocation();
  const { goTo } = useScreenNavigation();
  const { userProfile } = useAuth();
  const { t } = useLocalization();
  const { isFlowComplete } = useUserFlow();

  const handleNavigation = useCallback((path: string) => {
    if (location.pathname !== path) {
      goTo(path);
    }
  }, [location.pathname, goTo]);

  if (!isFlowComplete) {
    return null;
  }

  const hiddenPaths = ['/', '/language-selection', '/login', '/otp-verification', '/role-selection', '/profile-setup'];
  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const navItems = userProfile?.role === 'employer' ? EMPLOYER_NAV : JOBSEEKER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50">
      <div className="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
        <div className="max-w-2xl mx-auto flex justify-between items-center px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center flex-1 px-2 py-3 rounded-2xl transition-all duration-300 group
                   ${isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={0}
                style={{minWidth: 0}}
                disabled={isActive}
              >
                <Icon 
                  size={iconSize} 
                  className={`mb-1 transition-transform duration-200 ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                <span className={`text-xs font-medium transition-all duration-200 ${
                  isActive ? 'font-semibold' : ''
                }`}>
                  {t(item.labelKey, item.label)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
