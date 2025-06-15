
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';

const DynamicRoleSwitcher = () => {
  const { user, switchRole, getCurrentUserRole } = useAuth();
  const { getLocalizedText } = useLocalization();

  if (!user) return null;

  const currentRole = getCurrentUserRole();
  const isJobSeeker = currentRole === 'jobseeker';
  const currentRoleText = getLocalizedText(`role.${currentRole}`, currentRole || '');
  const otherRoleText = getLocalizedText(`role.${isJobSeeker ? 'employer' : 'jobseeker'}`, isJobSeeker ? 'employer' : 'jobseeker');

  // Only show role switcher if user has a role
  if (!user.role) return null;

  return (
    <div className="flex items-center space-x-3">
      {/* Current Role Badge */}
      <Badge 
        variant={isJobSeeker ? "default" : "secondary"}
        className="flex items-center space-x-1.5 transition-all duration-300"
      >
        {isJobSeeker ? <User className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
        <span className="font-medium">{currentRoleText}</span>
      </Badge>

      {/* Role Switch - Only show if user can switch roles */}
      {user.role === 'employer' && (
        <div className="flex items-center space-x-2">
          <Switch
            checked={!isJobSeeker}
            onCheckedChange={switchRole}
            className="data-[state=checked]:bg-blue-600"
          />
          <span className="text-gray-600 text-sm">
            Switch to {otherRoleText}
          </span>
        </div>
      )}
    </div>
  );
};

export default DynamicRoleSwitcher;
