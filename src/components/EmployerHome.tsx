
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
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
            {recentJobs.map((job, index) => (
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
};

export default EmployerHome;
