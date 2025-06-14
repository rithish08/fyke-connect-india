
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface ProfileSettingsProps {
  onLogout: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => (
  <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white">
    <span className="text-base font-semibold text-gray-900 mb-2 block">
      Settings
    </span>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">Job Notifications</span>
          <span className="block text-xs text-gray-500">Get notified about new opportunities</span>
        </div>
        <Switch defaultChecked />
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div>
          <span className="font-medium">Message Notifications</span>
          <span className="block text-xs text-gray-500">Get notified about new messages</span>
        </div>
        <Switch defaultChecked />
      </div>
      <Separator />
      <Button variant="outline" className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold">
        Privacy Settings
      </Button>
      <Button variant="outline" className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold">
        Help & Support
      </Button>
      <Button
        variant="destructive"
        className="w-full rounded-xl font-semibold"
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  </ModernCard>
);

export default ProfileSettings;
