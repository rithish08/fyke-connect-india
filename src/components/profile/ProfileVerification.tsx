
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface ProfileVerificationProps {
  verified: boolean;
}

const ProfileVerification: React.FC<ProfileVerificationProps> = ({ verified }) => (
  <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white">
    <span className="text-base font-semibold text-gray-900 mb-2 block">
      Verification
    </span>
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={verified ? 'text-green-500' : 'text-gray-400'}>
            {verified ? <Check className="w-6 h-6" /> : '⭕'}
          </span>
          <div>
            <span className="font-medium">Phone Number</span>
            <span className="block text-xs text-gray-500">Verified with OTP</span>
          </div>
        </div>
        <Badge variant={verified ? 'secondary' : 'outline'} className="rounded-full">
          {verified ? 'Verified' : 'Pending'}
        </Badge>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-gray-400">⭕</span>
          <div>
            <span className="font-medium">Identity Verification</span>
            <span className="block text-xs text-gray-500">Upload Aadhaar card</span>
          </div>
        </div>
        <Button variant="outline" size="sm" className="rounded-full border-blue-100 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs shadow-none">
          Verify Now
        </Button>
      </div>
    </div>
  </ModernCard>
);

export default ProfileVerification;
