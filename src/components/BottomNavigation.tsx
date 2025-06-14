
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getNavItems = () => {
    if (user?.role === 'employer') {
      return [
        { path: '/home', icon: '🏠', label: 'Home' },
        { path: '/search', icon: '👷', label: 'Find Workers' },
        { path: '/my-jobs', icon: '📋', label: 'My Posts' },
        { path: '/messages', icon: '💬', label: 'Messages' },
        { path: '/profile', icon: '👤', label: 'Profile' }
      ];
    } else {
      return [
        { path: '/home', icon: '🏠', label: 'Home' },
        { path: '/search', icon: '🔍', label: 'Find Jobs' },
        { path: '/my-jobs', icon: '📄', label: 'My Jobs' },
        { path: '/messages', icon: '💬', label: 'Messages' },
        { path: '/profile', icon: '👤', label: 'Profile' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
              location.pathname === item.path
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
