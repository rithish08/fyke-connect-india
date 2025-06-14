
import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useToast } from '@/hooks/use-toast';

export const useLoginProtection = () => {
  const { isAuthenticated, user } = useAuth();
  const { goTo } = useScreenNavigation();
  const { toast } = useToast();

  const requireLogin = (action: () => void, message?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: message || "Please log in to continue with this action.",
        variant: "destructive"
      });
      goTo('/login');
      return false;
    }
    action();
    return true;
  };

  const requireRole = (requiredRole: 'jobseeker' | 'employer', action: () => void, message?: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to continue.",
        variant: "destructive"
      });
      goTo('/login');
      return false;
    }

    if (user?.role !== requiredRole) {
      toast({
        title: "Access Denied",
        description: message || `This feature is only available for ${requiredRole}s.`,
        variant: "destructive"
      });
      return false;
    }

    action();
    return true;
  };

  return {
    requireLogin,
    requireRole,
    isAuthenticated,
    userRole: user?.role
  };
};
