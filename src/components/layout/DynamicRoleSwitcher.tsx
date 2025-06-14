
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';

const DynamicRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { getLocalizedText } = useLocalization();

  if (!user) return null;

  const isJobSeeker = user.role === 'jobseeker';
  const currentRoleText = getLocalizedText(`role.${user.role}`, user.role);
  const otherRoleText = getLocalizedText(`role.${isJobSeeker ? 'employer' : 'jobseeker'}`, isJobSeeker ? 'employer' : 'jobseeker');

  const currentRoleTextSize = getResponsiveTextSize(currentRoleText, {
    baseSize: 14,
    minSize: 11,
    maxSize: 15
  });

  const otherRoleTextSize = getResponsiveTextSize(otherRoleText, {
    baseSize: 12,
    minSize: 10,
    maxSize: 13
  });

  return (
    <div className="flex items-center space-x-3">
      {/* Current Role Badge */}
      <Badge 
        variant={isJobSeeker ? "default" : "secondary"}
        className={`${getFlexibleContainerClass(currentRoleText, 'flex items-center space-x-1.5 transition-all duration-300')} ${currentRoleTextSize}`}
      >
        {isJobSeeker ? <User className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
        <span className="font-medium">{currentRoleText}</span>
      </Badge>

      {/* Role Switch */}
      <div className="flex items-center space-x-2">
        <Switch
          checked={!isJobSeeker}
          onCheckedChange={switchRole}
          className="data-[state=checked]:bg-blue-600"
        />
        <span className={`text-gray-600 ${otherRoleTextSize} ${getFlexibleContainerClass(otherRoleText)}`}>
          {otherRoleText}
        </span>
      </div>
    </div>
  );
};

export default DynamicRoleSwitcher;
