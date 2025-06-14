
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
    // Only enforce flow if user needs auth/profile and flow isn't complete
    if ((requireAuth || requireProfile) && !isFlowComplete) {
      const timer = setTimeout(() => {
        enforceFlow();
      }, 100); // Small delay to prevent navigation conflicts
      
      return () => clearTimeout(timer);
    }
  }, [enforceFlow, requireAuth, requireProfile, isFlowComplete]);

  // Show loading while checking flow - but only briefly
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
