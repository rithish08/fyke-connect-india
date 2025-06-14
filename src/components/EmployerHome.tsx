
import FindWorkersSection from '@/components/employer/FindWorkersSection';
import QuickActionsSection from '@/components/employer/QuickActionsSection';
import NearbyWorkersSection from '@/components/employer/NearbyWorkersSection';
import RecentActivitySection from '@/components/employer/RecentActivitySection';

const EmployerHome = () => {
  return (
    <div className="space-y-4 px-0 md:px-4">
      <FindWorkersSection />
      <QuickActionsSection />
      <NearbyWorkersSection />
      <RecentActivitySection />
    </div>
  );
};

export default EmployerHome;
