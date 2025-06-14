
import { useEffect } from 'react';
import { useUserFlow } from '@/hooks/useUserFlow';
import ShimmerLoader from '@/components/ui/ShimmerLoader';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireProfile?: boolean;
}

const RouteGuard = ({ 
  children, 
  requireAuth = true, 
  requireProfile = true 
}: RouteGuardProps) => {
  const { isFlowComplete, enforceFlow } = useUserFlow();

  useEffect(() => {
    if (requireAuth || requireProfile) {
      enforceFlow();
    }
  }, [enforceFlow, requireAuth, requireProfile]);

  // Show loading while checking flow
  if ((requireAuth || requireProfile) && !isFlowComplete) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <ShimmerLoader height={60} width="200px" />
      </div>
    );
  }

  return <>{children}</>;
};

export default RouteGuard;
