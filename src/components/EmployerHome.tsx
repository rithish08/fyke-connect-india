
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import TrustIndicators from './TrustIndicators';
import AnimatedWrapper from './AnimatedWrapper';

const EmployerHome = () => {
  const navigate = useNavigate();

  const recentJobs = [
    { title: 'Construction Worker needed', applications: 12, status: 'Active', time: '2 hours ago', type: 'urgent' },
    { title: 'Delivery Executive', applications: 8, status: 'Hiring', time: '4 hours ago', type: 'normal' },
    { title: 'Office Cleaner', applications: 15, status: 'Closed', time: '1 day ago', type: 'completed' }
  ];

  return (
    <div className="space-y-6 px-0 md:px-4">
      {/* Quick Stats */}
      <AnimatedWrapper variant="slide" direction="up" delay={100}>
        <div className="grid grid-cols-2 gap-4">
          <ModernCard className="bg-white border shadow rounded-2xl">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-700">156</div>
              <div className="text-sm text-gray-500">Workers Available</div>
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700">+12 online now</span>
              </div>
            </div>
          </ModernCard>
          
          <ModernCard className="bg-white border shadow rounded-2xl">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-purple-700">8</div>
              <div className="text-sm text-gray-500">Active Jobs</div>
              <div className="text-xs text-gray-500">45 applications</div>
            </div>
          </ModernCard>
        </div>
      </AnimatedWrapper>

      {/* Primary Actions */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="space-y-4">
          <ModernCard 
            className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
            onClick={() => navigate('/post-job')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📝</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Post New Job</h3>
                  <p className="text-gray-500 text-sm">Get workers in 2 hours</p>
                </div>
              </div>
            </div>
          </ModernCard>
          
          <div className="grid grid-cols-2 gap-4">
            <ModernCard 
              className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
              onClick={() => navigate('/search')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">👷</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Find Workers</h4>
                  <p className="text-sm text-gray-400">156 available</p>
                </div>
              </div>
            </ModernCard>
            
            <ModernCard 
              className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
              onClick={() => navigate('/my-jobs')}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-xl">📋</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">My Posts</h4>
                  <p className="text-sm text-gray-400">8 active</p>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </AnimatedWrapper>

      {/* Recent Activity */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-xl px-2">Recent Activity</h3>
          <div className="space-y-3">
            {recentJobs.map((job, index) => (
              <ModernCard key={index} className="bg-white border shadow rounded-2xl hover:shadow-lg transition-transform duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      job.type === 'urgent' ? 'bg-red-500 animate-pulse' :
                      job.type === 'normal' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.applications} applications • {job.time}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Active' ? 'bg-green-100 text-green-700' :
                    job.status === 'Hiring' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </div>
                </div>
                
                <TrustIndicators className="mt-4" />
              </ModernCard>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default EmployerHome;
