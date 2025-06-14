
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import RoleSwitcher from '@/components/RoleSwitcher';
import ProfileProgress from '@/components/ProfileProgress';
import EarningsPotential from '@/components/EarningsPotential';
import TrustIndicators from '@/components/TrustIndicators';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!user) return null;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const JobSeekerHome = () => (
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
            {[
              { name: 'Construction', icon: '🏗️', count: 45, pay: '₹500-800/day', color: 'bg-blue-50 border-blue-300 text-blue-700' },
              { name: 'Delivery', icon: '🚚', count: 32, pay: '₹400-600/day', color: 'bg-green-50 border-green-300 text-green-700' },
              { name: 'Cleaning', icon: '🧹', count: 28, pay: '₹300-500/day', color: 'bg-purple-50 border-purple-300 text-purple-700' },
              { name: 'Security', icon: '🛡️', count: 21, pay: '₹450-700/day', color: 'bg-orange-50 border-orange-300 text-orange-700' }
            ].map((category) => (
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

  const EmployerHome = () => (
    <div className="space-y-4">
      {/* Quick Stats - Enhanced */}
      <AnimatedWrapper variant="slide" direction="up" delay={100}>
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-xl">
            <div className="text-center">
              <div className="text-3xl font-bold">156</div>
              <div className="text-sm opacity-90">Workers Available</div>
              <div className="text-xs opacity-75 mt-1">+12 online now</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-xl">
            <div className="text-center">
              <div className="text-3xl font-bold">8</div>
              <div className="text-sm opacity-90">Active Jobs</div>
              <div className="text-xs opacity-75 mt-1">45 applications</div>
            </div>
          </Card>
        </div>
      </AnimatedWrapper>

      {/* Primary Actions - Enhanced */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-4">
          <Button 
            onClick={() => navigate('/post-job')}
            className="w-full h-20 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white text-xl font-bold rounded-2xl shadow-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-center space-x-4">
              <span className="text-3xl">📝</span>
              <div className="text-left">
                <div>Post New Job</div>
                <div className="text-sm font-normal opacity-90">Get workers in 2 hours</div>
              </div>
            </div>
          </Button>
          
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/search')}
              variant="outline"
              className="h-16 border-2 border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold rounded-xl group"
            >
              <div className="text-center">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">👷</div>
                <div className="text-sm">Find Workers</div>
                <div className="text-xs opacity-75">156 available</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/my-jobs')}
              variant="outline"
              className="h-16 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 font-semibold rounded-xl group"
            >
              <div className="text-center">
                <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">📋</div>
                <div className="text-sm">My Posts</div>
                <div className="text-xs opacity-75">8 active</div>
              </div>
            </Button>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Recent Activity - Enhanced */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-xl">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { title: 'Construction Worker needed', applications: 12, status: 'Active', time: '2 hours ago', type: 'urgent' },
              { title: 'Delivery Executive', applications: 8, status: 'Hiring', time: '4 hours ago', type: 'normal' },
              { title: 'Office Cleaner', applications: 15, status: 'Closed', time: '1 day ago', type: 'completed' }
            ].map((job, index) => (
              <Card key={index} className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      job.type === 'urgent' ? 'bg-red-500 animate-pulse' :
                      job.type === 'normal' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-semibold text-sm">{job.title}</h4>
                      <p className="text-xs text-gray-600">{job.applications} applications • {job.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      job.status === 'Active' ? 'bg-green-100 text-green-700' :
                      job.status === 'Hiring' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
                
                {/* Trust Indicators */}
                <TrustIndicators className="mt-3" />
              </Card>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced Header */}
      <AnimatedWrapper variant="slide" direction="down" delay={50}>
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}! 👋
              </h1>
              <p className="text-blue-100 text-sm">
                {user.name || user.phone}
              </p>
              <p className="text-blue-100 text-sm">
                {user.role === 'jobseeker' ? 'Ready to find work?' : 'Ready to hire?'}
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

      <RoleSwitcher />

      <div className="p-4">
        {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
