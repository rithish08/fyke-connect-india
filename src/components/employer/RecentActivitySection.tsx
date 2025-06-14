
import { ModernCard } from '@/components/ui/modern-card';
import TrustIndicators from '@/components/TrustIndicators';
import AnimatedWrapper from '@/components/AnimatedWrapper';

interface RecentJob {
  title: string;
  applications: number;
  status: string;
  time: string;
  type: string;
}

const RecentActivitySection = () => {
  const recentJobs: RecentJob[] = [
    { title: 'Construction Worker needed', applications: 12, status: 'Active', time: '2 hours ago', type: 'urgent' },
    { title: 'Delivery Executive', applications: 8, status: 'Hiring', time: '4 hours ago', type: 'normal' },
    { title: 'Office Cleaner', applications: 15, status: 'Closed', time: '1 day ago', type: 'completed' }
  ];

  return (
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
  );
};

export default RecentActivitySection;
