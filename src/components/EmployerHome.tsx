
import QuickActionsSection from '@/components/employer/QuickActionsSection';
import NearbyWorkersSection from '@/components/employer/NearbyWorkersSection';
import RecentActivitySection from '@/components/employer/RecentActivitySection';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Search, MessageCircle, TrendingUp } from 'lucide-react';

const EmployerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 px-0 md:px-4">
      {/* Quick Actions */}
      <div className="px-4 md:px-0">
        <FloatingCard variant="glow" size="md">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={() => navigate('/post-job')}
              className="h-20 flex-col space-y-2 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-sm">Post Job</span>
            </Button>
            <Button 
              onClick={() => navigate('/search')}
              variant="outline"
              className="h-20 flex-col space-y-2"
            >
              <Search className="w-6 h-6" />
              <span className="text-sm">Find Workers</span>
            </Button>
          </div>
        </FloatingCard>
      </div>

      {/* Stats Overview */}
      <div className="px-4 md:px-0">
        <FloatingCard variant="elevated" size="sm">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-xs text-gray-500">Active Jobs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">47</div>
              <div className="text-xs text-gray-500">Applications</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-xs text-gray-500">Hired</div>
            </div>
          </div>
        </FloatingCard>
      </div>

      {/* Quick Access */}
      <div className="px-4 md:px-0">
        <FloatingCard variant="minimal" size="sm">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              onClick={() => navigate('/my-jobs')} 
              variant="ghost"
              className="flex-col h-16 space-y-1"
            >
              <Briefcase className="w-5 h-5" />
              <span className="text-xs">My Posts</span>
            </Button>
            <Button 
              onClick={() => navigate('/messages')} 
              variant="ghost"
              className="flex-col h-16 space-y-1"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-xs">Messages</span>
            </Button>
            <Button 
              onClick={() => navigate('/analytics')} 
              variant="ghost"
              className="flex-col h-16 space-y-1"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </Button>
          </div>
        </FloatingCard>
      </div>

      <QuickActionsSection />
      <NearbyWorkersSection />
      <RecentActivitySection />
    </div>
  );
};

export default EmployerHome;
