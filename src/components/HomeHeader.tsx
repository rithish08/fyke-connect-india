
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
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}! 👋
            </h1>
            <p className="text-blue-100 text-sm">
              {user?.name || user?.phone}
            </p>
            <p className="text-blue-100 text-sm">
              {user?.role === 'jobseeker' ? 'Ready to find work?' : 'Ready to hire?'}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-3 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-colors duration-200"
            >
              <span className="text-2xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default HomeHeader;
