
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Check } from 'lucide-react';

interface ProfileHeaderProps {
  name: string;
  phone: string;
  role: string;
  verified: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, phone, role, verified }) => (
  <ModernCard
    variant="default"
    className="w-full max-w-xl mx-auto flex flex-col items-center p-8 pt-10 border border-gray-100 bg-white shadow-md rounded-2xl"
  >
    <div className="relative mb-2">
      <div className="w-28 h-28 bg-white border border-gray-200 shadow rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white">
        <span className="text-5xl font-bold text-[#264669] uppercase select-none">
          {name ? name[0] : phone?.[0] || 'U'}
        </span>
      </div>
      {verified && (
        <span className="absolute bottom-2 right-0 bg-white rounded-full border border-green-100 shadow px-1.5 py-0.5">
          <Check className="w-5 h-5 text-green-500 inline" />
        </span>
      )}
    </div>
    <div className="flex flex-col items-center mb-2">
      <span className="font-semibold text-lg text-[#222D3A] flex items-center">
        {name || "Complete Your Profile"}
        {verified && <Check className="ml-2 w-5 h-5 text-green-500" />}
      </span>
      <span className="text-sm text-gray-500 mt-1">{phone}</span>
      <span className="text-xs text-gray-400 mt-0.5 capitalize">{role}</span>
    </div>
  </ModernCard>
);

export default ProfileHeader;
