
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';
import { Home, Search, ClipboardList, Mail, User as UserIcon, Users, Plus } from "lucide-react";

const iconSize = 22;

const EMPLOYER_NAV = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Home' },
  { path: '/search', icon: Users, labelKey: 'nav.workers', label: 'Workers' },
  { path: '/post-job', icon: Plus, labelKey: 'nav.post', label: 'Post', isAction: true },
  { path: '/my-jobs', icon: ClipboardList, labelKey: 'nav.posts', label: 'My Posts' },
  { path: '/profile', icon: UserIcon, labelKey: 'nav.profile', label: 'Profile' }
];

const JOBSEEKER_NAV = [
  { path: '/home', icon: Home, labelKey: 'nav.home', label: 'Home' },
  { path: '/search', icon: Search, labelKey: 'nav.jobs', label: 'Jobs' },
  { path: '/messages', icon: Mail, labelKey: 'nav.messages', label: 'Messages' },
  { path: '/my-jobs', icon: ClipboardList, labelKey: 'nav.myjobs', label: 'My Jobs' },
  { path: '/profile', icon: UserIcon, labelKey: 'nav.profile', label: 'Profile' }
];

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getLocalizedText } = useLocalization();

  const navItems = user?.role === 'employer' ? EMPLOYER_NAV : JOBSEEKER_NAV;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-lg">
      <div className="safe-area-pb">
        <div className="max-w-2xl mx-auto flex items-center px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isActionButton = item.isAction;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center flex-1 px-1 py-2 rounded-xl transition-all duration-200 group relative
                  ${isActionButton
                    ? 'bg-blue-600 text-white shadow-lg scale-105 mx-1'
                    : isActive
                      ? 'bg-gray-900 text-white shadow-md scale-105'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={getLocalizedText(item.labelKey, item.label)}
              >
                <span className="mb-1 transition-transform duration-150 flex items-center justify-center">
                  <item.icon 
                    size={isActionButton ? 20 : iconSize} 
                    strokeWidth={isActionButton ? 2.5 : 2}
                    className={
                      isActionButton
                        ? "text-white"
                        : isActive 
                          ? "text-white" 
                          : "text-gray-500 group-hover:text-gray-900"
                    } 
                  />
                </span>
                <span className={`text-[9px] font-medium leading-tight truncate
                  ${isActionButton
                    ? 'text-white'
                    : isActive 
                      ? 'text-white' 
                      : 'text-gray-700'
                  }`}>
                  {getLocalizedText(item.labelKey, item.label)}
                </span>
                
                {isActive && !isActionButton && (
                  <span className="w-1 h-1 mt-0.5 rounded-full bg-white/90" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
