
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocalization();

  const getNavItems = () => {
    if (user?.role === 'employer') {
      return [
        { path: '/home', icon: '🏠', label: 'Home' },
        { path: '/search', icon: '👷', label: 'Workers' },
        { path: '/my-jobs', icon: '📋', label: 'My Posts' },
        { path: '/messages', icon: '💬', label: 'Messages' },
        { path: '/profile', icon: '👤', label: 'Profile' }
      ];
    } else {
      return [
        { path: '/home', icon: '🏠', label: 'Home' },
        { path: '/search', icon: '🔍', label: 'Jobs' },
        { path: '/my-jobs', icon: '📄', label: 'My Jobs' },
        { path: '/messages', icon: '💬', label: 'Messages' },
        { path: '/profile', icon: '👤', label: 'Profile' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center py-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center py-3 px-4 rounded-2xl transition-all duration-200 min-w-0 flex-1 ${
                isActive
                  ? 'bg-blue-100 text-blue-700 scale-105'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className={`text-2xl mb-1 transition-transform duration-200 ${
                isActive ? 'scale-110' : ''
              }`}>
                {item.icon}
              </span>
              <span className={`text-xs font-medium transition-all duration-200 ${
                isActive ? 'font-bold' : ''
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="w-1 h-1 bg-blue-500 rounded-full mt-1" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
