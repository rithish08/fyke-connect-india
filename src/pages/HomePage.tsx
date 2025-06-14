
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import RoleSwitcher from '@/components/RoleSwitcher';

const HomePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const JobSeekerHome = () => (
    <div className="space-y-6">
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-2xl font-bold">12</div>
          <div className="text-sm opacity-90">Applications</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-2xl font-bold">3</div>
          <div className="text-sm opacity-90">Interviews</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="text-2xl font-bold">₹15,000</div>
          <div className="text-sm opacity-90">This Month</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="text-2xl font-bold">Active</div>
          <div className="text-sm opacity-90">Status</div>
        </Card>
      </div>

      {/* Emergency Jobs */}
      <Card className="p-4 border-red-200 bg-red-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-red-800 flex items-center">
            🚨 Emergency Jobs
          </h3>
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">
            3 Available
          </span>
        </div>
        <p className="text-sm text-red-700 mb-3">
          High-priority jobs with premium pay rates
        </p>
        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
          View Emergency Jobs
        </Button>
      </Card>

      {/* Category Recommendations */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Recommended for You</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'Construction', icon: '🏗️', count: 45 },
            { name: 'Delivery', icon: '🚚', count: 32 },
            { name: 'Cleaning', icon: '🧹', count: 28 },
            { name: 'Security', icon: '🛡️', count: 21 }
          ].map((category) => (
            <Card key={category.name} className="p-3 hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count} jobs</div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Recent Applications</h3>
        <div className="space-y-3">
          {[
            { company: 'BuildPro Construction', role: 'Mason Helper', status: 'Interview', time: '2h ago' },
            { company: 'QuickDelivery', role: 'Delivery Boy', status: 'Applied', time: '1d ago' },
            { company: 'CleanSpot Services', role: 'Office Cleaner', status: 'Reviewed', time: '2d ago' }
          ].map((job, index) => (
            <Card key={index} className="p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{job.role}</h4>
                  <p className="text-xs text-gray-600">{job.company}</p>
                  <p className="text-xs text-gray-500 mt-1">{job.time}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  job.status === 'Interview' ? 'bg-green-100 text-green-700' :
                  job.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {job.status}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const EmployerHome = () => (
    <div className="space-y-6">
      {/* Hiring Dashboard */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-2xl font-bold">156</div>
          <div className="text-sm opacity-90">Workers Available</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="text-2xl font-bold">8</div>
          <div className="text-sm opacity-90">Jobs Posted</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <div className="text-2xl font-bold">23</div>
          <div className="text-sm opacity-90">Successful Hires</div>
        </Card>
        <Card className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="text-2xl font-bold">85%</div>
          <div className="text-sm opacity-90">Response Rate</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          onClick={() => navigate('/search')}
          className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <div className="text-center">
            <div className="text-xl">📝</div>
            <div className="text-sm font-medium">Post New Job</div>
          </div>
        </Button>
        <Button 
          onClick={() => navigate('/search')}
          variant="outline"
          className="h-16 border-2 border-green-200 hover:bg-green-50"
        >
          <div className="text-center text-green-700">
            <div className="text-xl">👷</div>
            <div className="text-sm font-medium">Find Workers</div>
          </div>
        </Button>
      </div>

      {/* Active Jobs */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Active Job Postings</h3>
        <div className="space-y-3">
          {[
            { title: 'Construction Worker needed', applications: 12, location: 'Mumbai', urgent: true },
            { title: 'Delivery Executive', applications: 8, location: 'Pune', urgent: false },
            { title: 'Office Cleaner', applications: 15, location: 'Bangalore', urgent: false }
          ].map((job, index) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm">{job.title}</h4>
                    {job.urgent && (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">📍 {job.location}</p>
                  <p className="text-xs text-blue-600 mt-1">{job.applications} applications received</p>
                </div>
                <Button size="sm" variant="outline">
                  View
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Welcome{user.name ? `, ${user.name}` : ''}! 👋
            </h1>
            <p className="text-sm text-gray-600">
              {user.role === 'jobseeker' ? 'Ready to find your next opportunity?' : 'Ready to hire amazing talent?'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <span className="text-xl">🔔</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
          </div>
        </div>
      </div>

      <RoleSwitcher />

      <div className="p-4">
        {user.role === 'jobseeker' ? <JobSeekerHome /> : <EmployerHome />}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;
