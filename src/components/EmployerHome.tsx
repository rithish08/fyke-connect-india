
import QuickActionsSection from '@/components/employer/QuickActionsSection';
import EnhancedNearbyWorkersSection from '@/components/employer/EnhancedNearbyWorkersSection';
import RecentActivitySection from '@/components/employer/RecentActivitySection';
import LoginGuard from '@/components/auth/LoginGuard';

const EmployerHome = () => {
  return (
    <LoginGuard
      fallbackTitle="Login to Hire Workers"
      fallbackDescription="Please log in to post jobs and hire workers."
    >
      <div className="space-y-4 px-0 md:px-4">
        <QuickActionsSection />
        <EnhancedNearbyWorkersSection />
        <RecentActivitySection />
      </div>
    </LoginGuard>
  );
};

export default EmployerHome;
