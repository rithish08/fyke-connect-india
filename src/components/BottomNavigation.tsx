
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocalization();

  const navItems = user?.role === 'employer'
    ? [
        { path: '/home', icon: '🏠', label: t('nav.home', 'Home') },
        { path: '/search', icon: '👷', label: t('nav.workers', 'Workers') },
        { path: '/my-jobs', icon: '📋', label: t('nav.posts', 'My Posts') },
        { path: '/messages', icon: '💬', label: t('nav.messages', 'Messages') },
        { path: '/profile', icon: '👤', label: t('nav.profile', 'Profile') }
      ]
    : [
        { path: '/home', icon: '🏠', label: t('nav.home', 'Home') },
        { path: '/search', icon: '🔍', label: t('nav.jobs', 'Jobs') },
        { path: '/my-jobs', icon: '📄', label: t('nav.myjobs', 'My Jobs') },
        { path: '/messages', icon: '💬', label: t('nav.messages', 'Messages') },
        { path: '/profile', icon: '👤', label: t('nav.profile', 'Profile') }
      ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-2xl mx-auto flex justify-between items-center px-1 sm:px-4 py-2 gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 px-1.5 py-1.5 rounded-xl transition-all duration-150
                ${isActive
                  ? 'bg-gray-900 text-white shadow-md scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              aria-current={isActive ? 'page' : undefined}
              tabIndex={0}
            >
              <span className={`text-2xl mb-0.5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>{item.icon}</span>
              <span className="text-xs font-medium truncate">{item.label}</span>
              {/* Active indicator */}
              {isActive && (
                <span className="w-1.5 h-1.5 mt-1 rounded-full bg-white/80 border-2 border-gray-900" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
