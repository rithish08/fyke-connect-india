
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import EarningsPotential from './EarningsPotential';
import ProfileProgress from './ProfileProgress';
import AnimatedWrapper from './AnimatedWrapper';

const JobSeekerHome = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Construction', icon: '🏗️', count: 45, pay: '₹500-800/day', gradient: '' },
    { name: 'Delivery', icon: '🚚', count: 32, pay: '₹400-600/day', gradient: '' },
    { name: 'Cleaning', icon: '🧹', count: 28, pay: '₹300-500/day', gradient: '' },
    { name: 'Security', icon: '🛡️', count: 21, pay: '₹450-700/day', gradient: '' }
  ];

  return (
    <div className="space-y-6 px-0 md:px-4">
      <EarningsPotential />
      <ProfileProgress />

      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-4">
          <ModernCard 
            className="bg-white text-gray-900 border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
            onClick={() => navigate('/search')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Find Jobs Now</h3>
                  <p className="text-gray-500 text-sm">156 new jobs today</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mb-1"></div>
                <p className="text-xs text-gray-400">Active</p>
              </div>
            </div>
          </ModernCard>
          
          <div className="grid grid-cols-2 gap-4">
            <ModernCard 
              className="bg-white cursor-pointer border hover:shadow-lg rounded-2xl transition duration-200"
              onClick={() => navigate('/my-jobs')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">📄</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Applications</h4>
                  <p className="text-sm text-gray-400">3 pending</p>
                </div>
              </div>
            </ModernCard>
            <ModernCard 
              className="bg-white cursor-pointer border hover:shadow-lg rounded-2xl transition duration-200"
              onClick={() => navigate('/profile')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Profile</h4>
                  <p className="text-sm text-gray-400">65% complete</p>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </AnimatedWrapper>

      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <ModernCard className="bg-white border shadow rounded-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🚨</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Urgent Jobs</h3>
                <p className="text-gray-500 text-sm">High pay • 23 available</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-gray-900 text-white font-semibold px-6 rounded-xl hover:bg-gray-800"
              onClick={() => navigate('/search?urgent=true')}
            >
              View All
            </Button>
          </div>
        </ModernCard>
      </AnimatedWrapper>

      <AnimatedWrapper variant="slide" direction="up" delay={400}>
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-xl px-2">Popular in Your Area</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <ModernCard 
                key={category.name}
                className="bg-white border cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
              >
                {/* No bg-gradient, just white */}
                <div className="relative text-center space-y-3">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{category.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{category.count} jobs</p>
                    <p className="text-xs font-semibold text-gray-800">{category.pay}</p>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default JobSeekerHome;
