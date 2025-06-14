
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { LogIn } from 'lucide-react';

interface LoginGuardProps {
  children: React.ReactNode;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

const LoginGuard: React.FC<LoginGuardProps> = ({
  children,
  fallbackTitle = "Login Required",
  fallbackDescription = "Please log in to continue with this action."
}) => {
  const { isAuthenticated } = useAuth();
  const { goTo } = useScreenNavigation();

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <ModernCard className="p-6 max-w-sm w-full text-center">
          <LogIn className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{fallbackTitle}</h3>
          <p className="text-gray-600 mb-6">{fallbackDescription}</p>
          <div className="space-y-2">
            <Button onClick={() => goTo('/login')} className="w-full">
              Log In
            </Button>
            <Button onClick={() => goTo('/')} variant="outline" className="w-full">
              Cancel
            </Button>
          </div>
        </ModernCard>
      </div>
    );
  }

  return <>{children}</>;
};

export default LoginGuard;
