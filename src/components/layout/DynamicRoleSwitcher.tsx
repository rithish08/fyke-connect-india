import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Briefcase } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';

const DynamicRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLocalization();

  if (!user) return null;

  const isJobSeeker = user.role === 'jobseeker';

  const handleRoleSwitch = (checked: boolean) => {
    // The switch is 'on' when it's the employer role
    if ((checked && isJobSeeker) || (!checked && !isJobSeeker)) {
      switchRole();
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      {/* Job Seeker Role */}
      <div className="flex items-center space-x-2">
        <User className={`w-5 h-5 ${isJobSeeker ? 'text-blue-600' : 'text-gray-400'}`} />
        <span className={`font-semibold ${isJobSeeker ? 'text-gray-900' : 'text-gray-500'}`}>
          {t('role.jobseeker', 'Job Seeker')}
        </span>
      </div>

      {/* The Actual Switch */}
      <Switch
        checked={!isJobSeeker}
        onCheckedChange={handleRoleSwitch}
        aria-label={t('role.switchRole', 'Switch Role')}
        className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-blue-600"
      />

      {/* Employer Role */}
      <div className="flex items-center space-x-2">
        <Briefcase className={`w-5 h-5 ${!isJobSeeker ? 'text-green-600' : 'text-gray-400'}`} />
        <span className={`font-semibold ${!isJobSeeker ? 'text-gray-900' : 'text-gray-500'}`}>
          {t('role.employer', 'Employer')}
        </span>
      </div>
    </div>
  );
};

export default DynamicRoleSwitcher;
