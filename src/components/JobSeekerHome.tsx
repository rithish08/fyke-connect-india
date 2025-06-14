
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import EarningsPotential from './EarningsPotential';
import ProfileProgress from './ProfileProgress';
import AnimatedWrapper from './AnimatedWrapper';

const JobSeekerHome = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Construction', icon: '🏗️', count: 45, pay: '₹500-800/day', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Delivery', icon: '🚚', count: 32, pay: '₹400-600/day', gradient: 'from-green-500 to-emerald-500' },
    { name: 'Cleaning', icon: '🧹', count: 28, pay: '₹300-500/day', gradient: 'from-purple-500 to-violet-500' },
    { name: 'Security', icon: '🛡️', count: 21, pay: '₹450-700/day', gradient: 'from-orange-500 to-amber-500' }
  ];

  return (
    <div className="space-y-6 px-4">
      {/* Earnings Potential */}
      <EarningsPotential />

      {/* Profile Progress */}
      <ProfileProgress />

      {/* Primary Actions */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-4">
          <ModernCard 
            variant="elevated"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            onClick={() => navigate('/search')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🔍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Find Jobs Now</h3>
                  <p className="text-blue-100 text-sm">156 new jobs today</p>
                </div>
              </div>
              <div className="text-right">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mb-1"></div>
                <p className="text-xs text-blue-100">Active</p>
              </div>
            </div>
          </ModernCard>
          
          <div className="grid grid-cols-2 gap-4">
            <ModernCard 
              variant="glass"
              className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
              onClick={() => navigate('/my-jobs')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-xl text-white">📄</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Applications</h4>
                  <p className="text-sm text-gray-600">3 pending</p>
                </div>
              </div>
            </ModernCard>
            
            <ModernCard 
              variant="glass"
              className="cursor-pointer hover:scale-[1.02] transition-transform duration-200"
              onClick={() => navigate('/profile')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto">
                  <span className="text-xl text-white">👤</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Profile</h4>
                  <p className="text-sm text-gray-600">65% complete</p>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Urgent Jobs Alert */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <ModernCard variant="elevated" className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl animate-pulse">🚨</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Urgent Jobs</h3>
                <p className="text-red-100 text-sm">High pay • 23 available</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-white text-red-600 hover:bg-gray-100 font-semibold px-6 rounded-xl"
              onClick={() => navigate('/search?urgent=true')}
            >
              View All
            </Button>
          </div>
        </ModernCard>
      </AnimatedWrapper>

      {/* Popular Categories */}
      <AnimatedWrapper variant="slide" direction="up" delay={400}>
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-xl px-2">Popular in Your Area</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <ModernCard 
                key={category.name}
                variant="glass"
                className="cursor-pointer hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
                onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5`}></div>
                <div className="relative text-center space-y-3">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{category.name}</h4>
                    <p className="text-xs text-gray-600 mb-1">{category.count} jobs</p>
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
