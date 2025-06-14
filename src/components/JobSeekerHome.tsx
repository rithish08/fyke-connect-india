
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EarningsPotential from './EarningsPotential';
import ProfileProgress from './ProfileProgress';
import AnimatedWrapper from './AnimatedWrapper';

const JobSeekerHome = () => {
  const navigate = useNavigate();

  const categories = [
    { name: 'Construction', icon: '🏗️', count: 45, pay: '₹500-800/day', color: 'bg-blue-50 border-blue-300 text-blue-700' },
    { name: 'Delivery', icon: '🚚', count: 32, pay: '₹400-600/day', color: 'bg-green-50 border-green-300 text-green-700' },
    { name: 'Cleaning', icon: '🧹', count: 28, pay: '₹300-500/day', color: 'bg-purple-50 border-purple-300 text-purple-700' },
    { name: 'Security', icon: '🛡️', count: 21, pay: '₹450-700/day', color: 'bg-orange-50 border-orange-300 text-orange-700' }
  ];

  return (
    <div className="space-y-4">
      {/* Earnings Potential */}
      <EarningsPotential />

      {/* Profile Progress */}
      <ProfileProgress />

      {/* Primary Actions - Enhanced */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/search')}
            className="w-full h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xl font-bold rounded-2xl shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-4">
              <span className="text-3xl">🔍</span>
              <div className="text-left">
                <div>Find Jobs Now</div>
                <div className="text-sm font-normal opacity-90">156 new jobs today</div>
              </div>
            </div>
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/my-jobs')}
              variant="outline"
              className="h-16 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 font-semibold rounded-xl relative overflow-hidden group"
            >
              <div className="text-center">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📄</div>
                <div className="text-sm">My Applications</div>
                <div className="text-xs opacity-75">3 pending</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="h-16 border-2 border-orange-200 hover:bg-orange-50 text-orange-700 font-semibold rounded-xl relative overflow-hidden group"
            >
              <div className="text-center">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">👤</div>
                <div className="text-sm">Profile</div>
                <div className="text-xs opacity-75">65% complete</div>
              </div>
            </Button>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Urgent Jobs Alert - Enhanced */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <Card className="p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-xl animate-pulse">🚨</span>
              </div>
              <div>
                <h3 className="font-bold text-lg">Urgent Jobs Available</h3>
                <p className="text-sm opacity-90">High pay • Immediate start • 23 jobs</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-white text-red-600 hover:bg-gray-100 font-bold px-6 shadow-lg"
              onClick={() => navigate('/search?urgent=true')}
            >
              View All
            </Button>
          </div>
        </Card>
      </AnimatedWrapper>

      {/* Popular Categories - Enhanced */}
      <AnimatedWrapper variant="slide" direction="up" delay={400}>
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-xl">Popular in Your Area</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.name}
                className={`p-4 ${category.color} border-2 cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg group`}
                onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
              >
                <div className="text-center space-y-2">
                  <div className="text-3xl group-hover:scale-110 transition-transform">{category.icon}</div>
                  <div className="font-bold text-sm">{category.name}</div>
                  <div className="text-xs opacity-75">{category.count} jobs</div>
                  <div className="text-xs font-semibold">{category.pay}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default JobSeekerHome;
