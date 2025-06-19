
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LogOut, Settings, HelpCircle, Shield, Bell, MessageSquare } from 'lucide-react';

interface ProfileSettingsProps {
  onLogout: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => (
  <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white">
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-gray-700" />
        <span className="text-base font-semibold text-gray-900">Settings</span>
      </div>
      
      {/* Notification Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="w-4 h-4 text-gray-500" />
            <div>
              <span className="font-medium">Job Notifications</span>
              <span className="block text-xs text-gray-500">Get notified about new opportunities</span>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <div>
              <span className="font-medium">Message Notifications</span>
              <span className="block text-xs text-gray-500">Get notified about new messages</span>
            </div>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Separator />

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold flex items-center justify-center space-x-2"
        >
          <Shield className="w-4 h-4" />
          <span>Privacy Settings</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold flex items-center justify-center space-x-2"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Help & Support</span>
        </Button>
        
        <Button
          variant="destructive"
          className="w-full rounded-xl font-semibold flex items-center justify-center space-x-2"
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  </ModernCard>
);

export default ProfileSettings;
