
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
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: '12', subtitle: 'Applications', gradient: 'from-blue-500 to-blue-600', icon: '📝' },
            { title: '3', subtitle: 'Interviews', gradient: 'from-green-500 to-green-600', icon: '🎯' },
            { title: '₹15,000', subtitle: 'This Month', gradient: 'from-purple-500 to-purple-600', icon: '💰' },
            { title: '85%', subtitle: 'Success Rate', gradient: 'from-orange-500 to-orange-600', icon: '📈' }
          ].map((stat, index) => (
            <AnimatedWrapper key={index} variant="scale" delay={300 + index * 100}>
              <Card className={`p-4 bg-gradient-to-r ${stat.gradient} text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stat.title}</div>
                    <div className="text-sm opacity-90">{stat.subtitle}</div>
                  </div>
                  <span className="text-2xl opacity-80">{stat.icon}</span>
                </div>
              </Card>
            </AnimatedWrapper>
          ))}
        </div>
      </AnimatedWrapper>

      {/* Emergency Jobs */}
      <AnimatedWrapper variant="slide" direction="up" delay={700}>
        <Card className="p-6 border-red-200 bg-red-50 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-red-800 flex items-center text-lg">
              🚨 {t('home.emergency_jobs')}
            </h3>
            <span className="text-sm text-red-600 bg-red-100 px-3 py-1 rounded-full font-medium">
              3 Available
            </span>
          </div>
          <p className="text-red-700 mb-4">
            High-priority jobs with premium pay rates (up to ₹800/day)
          </p>
          <Button 
            size="sm" 
            className="bg-red-600 hover:bg-red-700 text-white transition-colors duration-300 hover:scale-105"
            onClick={() => navigate('/emergency-jobs')}
          >
            View Emergency Jobs
          </Button>
        </Card>
      </AnimatedWrapper>

      {/* Category Recommendations */}
      <AnimatedWrapper variant="slide" direction="up" delay={900}>
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-lg">{t('home.recommended')}</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Construction', icon: '🏗️', count: 45, color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
              { name: 'Delivery', icon: '🚚', count: 32, color: 'bg-green-50 hover:bg-green-100 border-green-200' },
              { name: 'Cleaning', icon: '🧹', count: 28, color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
              { name: 'Security', icon: '🛡️', count: 21, color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' }
            ].map((category, index) => (
              <AnimatedWrapper key={category.name} variant="scale" delay={1000 + index * 100}>
                <Card 
                  className={`p-4 ${category.color} border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md`}
                  onClick={() => navigate(`/search?category=${category.name.toLowerCase()}`)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="font-semibold text-sm">{category.name}</div>
                    <div className="text-xs text-gray-600">{category.count} jobs</div>
                  </div>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );

  const EmployerHome = () => (
    <div className="space-y-6">
      {/* Hiring Dashboard */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: '156', subtitle: 'Workers Available', gradient: 'from-green-500 to-green-600', icon: '👷' },
            { title: '8', subtitle: 'Jobs Posted', gradient: 'from-blue-500 to-blue-600', icon: '📋' },
            { title: '23', subtitle: 'Successful Hires', gradient: 'from-purple-500 to-purple-600', icon: '✅' },
            { title: '85%', subtitle: 'Response Rate', gradient: 'from-orange-500 to-orange-600', icon: '⚡' }
          ].map((stat, index) => (
            <AnimatedWrapper key={index} variant="scale" delay={300 + index * 100}>
              <Card className={`p-4 bg-gradient-to-r ${stat.gradient} text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{stat.title}</div>
                    <div className="text-sm opacity-90">{stat.subtitle}</div>
                  </div>
                  <span className="text-2xl opacity-80">{stat.icon}</span>
                </div>
              </Card>
            </AnimatedWrapper>
          ))}
        </div>
      </AnimatedWrapper>

      {/* Quick Actions */}
      <AnimatedWrapper variant="slide" direction="up" delay={700}>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => navigate('/post-job')}
            className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="text-center">
              <div className="text-2xl mb-1">📝</div>
              <div className="text-sm font-medium">Post New Job</div>
            </div>
          </Button>
          <Button 
            onClick={() => navigate('/search')}
            variant="outline"
            className="h-20 border-2 border-green-200 hover:bg-green-50 transition-all duration-300 hover:scale-105"
          >
            <div className="text-center text-green-700">
              <div className="text-2xl mb-1">👷</div>
              <div className="text-sm font-medium">Find Workers</div>
            </div>
          </Button>
        </div>
      </AnimatedWrapper>

      {/* Active Jobs */}
      <AnimatedWrapper variant="slide" direction="up" delay={900}>
        <div>
          <h3 className="font-bold text-gray-900 mb-4 text-lg">Active Job Postings</h3>
          <div className="space-y-3">
            {[
              { title: 'Construction Worker needed', applications: 12, location: 'Mumbai', urgent: true },
              { title: 'Delivery Executive', applications: 8, location: 'Pune', urgent: false },
              { title: 'Office Cleaner', applications: 15, location: 'Bangalore', urgent: false }
            ].map((job, index) => (
              <AnimatedWrapper key={index} variant="slide" direction="right" delay={1000 + index * 100}>
                <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-sm">{job.title}</h4>
                        {job.urgent && (
                          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mb-1">📍 {job.location}</p>
                      <p className="text-xs text-blue-600 font-medium">{job.applications} applications received</p>
                    </div>
                    <Button size="sm" variant="outline" className="hover:scale-105 transition-transform duration-300">
                      View
                    </Button>
                  </div>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <AnimatedWrapper variant="slide" direction="down" delay={100}>
        <div className="bg-white shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {getGreeting()}{user.name ? `, ${user.name}` : ''}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {user.role === 'jobseeker' ? t('home.jobseeker_subtitle') : t('home.employer_subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/notifications')}
                className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-300"
              >
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-bold">
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
