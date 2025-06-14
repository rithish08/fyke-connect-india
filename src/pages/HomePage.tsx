
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import BottomNavigation from '@/components/BottomNavigation';
import RoleSwitcher from '@/components/RoleSwitcher';
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
      {/* Quick Stats - Simplified */}
      <AnimatedWrapper variant="slide" direction="up" delay={100}>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm opacity-90">Applications</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">₹15K</div>
              <div className="text-sm opacity-90">This Month</div>
            </div>
          </Card>
        </div>
      </AnimatedWrapper>

      {/* Primary Actions - Large and Clear */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/search')}
            className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">🔍</span>
              <span>Find Jobs Now</span>
            </div>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/my-jobs')}
              variant="outline"
              className="h-14 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 font-medium rounded-xl"
            >
              <div className="text-center">
                <div className="text-xl mb-1">📄</div>
                <div className="text-sm">My Jobs</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/profile')}
              variant="outline"
              className="h-14 border-2 border-orange-200 hover:bg-orange-50 text-orange-700 font-medium rounded-xl"
            >
              <div className="text-center">
                <div className="text-xl mb-1">👤</div>
                <div className="text-sm">Profile</div>
              </div>
            </Button>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Emergency Jobs Alert */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <Card className="p-4 bg-gradient-to-r from-red-50 to-red-100 border-red-200 border-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🚨</span>
              </div>
              <div>
                <h3 className="font-bold text-red-800 text-lg">Urgent Jobs</h3>
                <p className="text-red-600 text-sm">High pay • Immediate start</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-4"
              onClick={() => navigate('/search?urgent=true')}
            >
              View
            </Button>
          </div>
        </Card>
      </AnimatedWrapper>

      {/* Popular Categories - Simplified Grid */}
      <AnimatedWrapper variant="slide" direction="up" delay={400}>
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Popular Jobs</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Construction', icon: '🏗️', count: 45, color: 'bg-blue-50 border-blue-200 text-blue-700' },
              { name: 'Delivery', icon: '🚚', count: 32, color: 'bg-green-50 border-green-200 text-green-700' },
              { name: 'Cleaning', icon: '🧹', count: 28, color: 'bg-purple-50 border-purple-200 text-purple-700' },
              { name: 'Security', icon: '🛡️', count: 21, color: 'bg-orange-50 border-orange-200 text-orange-700' }
            ].map((category) => (
              <Card 
                key={category.name}
                className={`p-4 ${category.color} border-2 cursor-pointer hover:scale-105 transition-transform duration-200`}
                onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-semibold text-sm">{category.name}</div>
                  <div className="text-xs opacity-75">{category.count} jobs</div>
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
      {/* Quick Stats */}
      <AnimatedWrapper variant="slide" direction="up" delay={100}>
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">156</div>
              <div className="text-sm opacity-90">Workers Available</div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="text-center">
              <div className="text-2xl font-bold">8</div>
              <div className="text-sm opacity-90">Active Jobs</div>
            </div>
          </Card>
        </div>
      </AnimatedWrapper>

      {/* Primary Actions */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/post-job')}
            className="w-full h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-lg font-semibold rounded-xl shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">📝</span>
              <span>Post New Job</span>
            </div>
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => navigate('/search')}
              variant="outline"
              className="h-14 border-2 border-blue-200 hover:bg-blue-50 text-blue-700 font-medium rounded-xl"
            >
              <div className="text-center">
                <div className="text-xl mb-1">👷</div>
                <div className="text-sm">Find Workers</div>
              </div>
            </Button>
            <Button 
              onClick={() => navigate('/my-jobs')}
              variant="outline"
              className="h-14 border-2 border-purple-200 hover:bg-purple-50 text-purple-700 font-medium rounded-xl"
            >
              <div className="text-center">
                <div className="text-xl mb-1">📋</div>
                <div className="text-sm">My Posts</div>
              </div>
            </Button>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Recent Activity */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <div>
          <h3 className="font-bold text-gray-900 mb-3 text-lg">Recent Activity</h3>
          <div className="space-y-2">
            {[
              { title: 'Construction Worker needed', applications: 12, status: 'Active' },
              { title: 'Delivery Executive', applications: 8, status: 'Hiring' },
              { title: 'Office Cleaner', applications: 15, status: 'Closed' }
            ].map((job, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm">{job.title}</h4>
                    <p className="text-xs text-gray-600">{job.applications} applications</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    job.status === 'Active' ? 'bg-green-100 text-green-700' :
                    job.status === 'Hiring' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Simplified Header */}
      <AnimatedWrapper variant="slide" direction="down" delay={50}>
        <div className="bg-white shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getGreeting()}! 👋
              </h1>
              <p className="text-gray-600 text-sm">
                {user.role === 'jobseeker' ? 'Ready to find work?' : 'Ready to hire?'}
              </p>
            </div>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
                3
              </span>
            </button>
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
