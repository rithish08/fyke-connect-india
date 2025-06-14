
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import AnimatedWrapper from './AnimatedWrapper';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLocalization();

  const getNavItems = () => {
    if (user?.role === 'employer') {
      return [
        { path: '/home', icon: '🏠', label: t('nav.home'), activeColor: 'text-blue-600 bg-blue-100' },
        { path: '/search', icon: '👷', label: t('nav.find_workers'), activeColor: 'text-green-600 bg-green-100' },
        { path: '/my-jobs', icon: '📋', label: t('nav.my_posts'), activeColor: 'text-purple-600 bg-purple-100' },
        { path: '/messages', icon: '💬', label: t('nav.messages'), activeColor: 'text-orange-600 bg-orange-100' },
        { path: '/profile', icon: '👤', label: t('nav.profile'), activeColor: 'text-pink-600 bg-pink-100' }
      ];
    } else {
      return [
        { path: '/home', icon: '🏠', label: t('nav.home'), activeColor: 'text-blue-600 bg-blue-100' },
        { path: '/search', icon: '🔍', label: t('nav.search'), activeColor: 'text-green-600 bg-green-100' },
        { path: '/my-jobs', icon: '📄', label: t('nav.my_jobs'), activeColor: 'text-purple-600 bg-purple-100' },
        { path: '/messages', icon: '💬', label: t('nav.messages'), activeColor: 'text-orange-600 bg-orange-100' },
        { path: '/profile', icon: '👤', label: t('nav.profile'), activeColor: 'text-pink-600 bg-pink-100' }
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="flex justify-around items-center py-2 px-2 max-w-md mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <AnimatedWrapper
              key={item.path}
              variant="scale"
              delay={index * 50}
              className="flex-1"
            >
              <button
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-3 px-2 rounded-2xl transition-all duration-300 transform hover:scale-110 ${
                  isActive
                    ? `${item.activeColor} shadow-lg scale-105`
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className={`text-2xl mb-1 transition-transform duration-300 ${
                  isActive ? 'scale-110' : ''
                }`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'font-bold' : ''
                }`}>
                  {item.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <div className="w-1 h-1 bg-current rounded-full mt-1 transition-all duration-300" />
                )}
              </button>
            </AnimatedWrapper>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;
