
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { LogOut, Settings, HelpCircle, Shield, Bell, MessageSquare, Globe, Eye, Type } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';

interface ProfileSettingsProps {
  onLogout: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ onLogout }) => {
  const { t } = useLocalization();
  const { highContrast, setHighContrast, fontSize, setFontSize } = useAccessibility();

  return (
    <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white">
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <Settings className="w-5 h-5 text-gray-700" />
          <span className="text-base font-semibold text-gray-900">
            {t('profile.settings', 'Settings')}
          </span>
        </div>
        
        {/* Notification Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium">
                  {t('settings.job_notifications', 'Job Notifications')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('settings.job_notifications_desc', 'Get notified about new opportunities')}
                </span>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium">
                  {t('settings.message_notifications', 'Message Notifications')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('settings.message_notifications_desc', 'Get notified about new messages')}
                </span>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>

        <Separator />

        {/* Accessibility Settings */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">
            {t('settings.accessibility', 'Accessibility')}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium">
                  {t('settings.high_contrast', 'High Contrast')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('settings.high_contrast_desc', 'Improve visibility')}
                </span>
              </div>
            </div>
            <Switch 
              checked={highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Type className="w-4 h-4 text-gray-500" />
              <div>
                <span className="font-medium">
                  {t('settings.font_size', 'Font Size')}
                </span>
                <span className="block text-xs text-gray-500">
                  {t('settings.font_size_desc', 'Adjust text size')}
                </span>
              </div>
            </div>
            <select 
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value as 'small' | 'medium' | 'large')}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="small">{t('settings.small', 'Small')}</option>
              <option value="medium">{t('settings.medium', 'Medium')}</option>
              <option value="large">{t('settings.large', 'Large')}</option>
            </select>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold flex items-center justify-center space-x-2"
          >
            <Globe className="w-4 h-4" />
            <span>{t('settings.language_region', 'Language & Region')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold flex items-center justify-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>{t('settings.privacy', 'Privacy Settings')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full rounded-xl bg-white hover:bg-blue-50 font-semibold flex items-center justify-center space-x-2"
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t('settings.help_support', 'Help & Support')}</span>
          </Button>
          
          <Button
            variant="destructive"
            className="w-full rounded-xl font-semibold flex items-center justify-center space-x-2"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            <span>{t('settings.logout', 'Logout')}</span>
          </Button>
        </div>
      </div>
    </ModernCard>
  );
};

export default ProfileSettings;
