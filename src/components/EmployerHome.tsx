
import QuickActionsSection from '@/components/employer/QuickActionsSection';
import NearbyWorkersSection from '@/components/employer/NearbyWorkersSection';
import RecentActivitySection from '@/components/employer/RecentActivitySection';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users, Search } from 'lucide-react';

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

      <QuickActionsSection />
      <NearbyWorkersSection />
      <RecentActivitySection />
    </div>
  );
};

export default EmployerHome;
