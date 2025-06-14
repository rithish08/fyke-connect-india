
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedWrapper from './AnimatedWrapper';

interface HomeHeaderProps {
  currentTime: Date;
}

const HomeHeader = ({ currentTime }: HomeHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <AnimatedWrapper variant="slide" direction="down" delay={50}>
      <div className="bg-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {getGreeting()}! 👋
            </h1>
            <p className="text-gray-600 text-sm font-medium mt-1">
              {user?.name || user?.phone}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {user?.role === 'jobseeker' ? 'Ready to find work?' : 'Ready to hire?'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/notifications')}
              className="relative"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 shadow cursor-pointer">
                <span className="text-2xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold shadow">
                  3
                </span>
              </span>
            </button>
            <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shadow border overflow-hidden select-none">
              <span className="text-lg font-bold text-gray-700 uppercase">
                {user?.name ? user?.name[0] : user?.phone?.[0] || 'U'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default HomeHeader;
