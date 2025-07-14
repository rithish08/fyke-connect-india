import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { ProfileInfoData } from '@/types/profile';

interface ProfileInfoProps {
  profileData: Partial<ProfileInfoData>;
  isEditing: boolean;
  setProfileData: (cb: (prev: Partial<ProfileInfoData>) => Partial<ProfileInfoData>) => void;
  handleSave: () => void;
  userRole: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData, isEditing, setProfileData, handleSave, userRole }) => (
  <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white">
    <span className="text-base font-semibold text-gray-900 mb-4 block">
      Personal Information
    </span>
    <div className="space-y-5">
      <div>
        <Label htmlFor="name" className="mb-1 block">Full Name</Label>
        <Input
          id="name"
          value={profileData.name || ''}
          onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
          disabled={!isEditing}
          placeholder="Enter your full name"
          className="rounded-xl bg-[#f8f9fa] border border-gray-200 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div>
        <Label htmlFor="email" className="mb-1 block">Email</Label>
        <Input
          id="email"
          type="email"
          value={profileData.email || ''}
          onChange={(e) => setProfileData((prev) => ({ ...prev, email: e.target.value }))}
          disabled={!isEditing}
          placeholder="Enter your email"
          className="rounded-xl bg-[#f8f9fa] border border-gray-200 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      <div>
        <Label htmlFor="location" className="mb-1 block">Location</Label>
        <Input
          id="location"
          value={profileData.location || ''}
          onChange={(e) => setProfileData((prev) => ({ ...prev, location: e.target.value }))}
          disabled={!isEditing}
          className="rounded-xl bg-[#f8f9fa] border border-gray-200 focus:ring-2 focus:ring-blue-100"
        />
      </div>
      {userRole === 'jobseeker' && (
        <div>
          <Label htmlFor="experience" className="mb-1 block">Experience</Label>
          <Input
            id="experience"
            value={profileData.experience || ''}
            onChange={(e) => setProfileData((prev) => ({ ...prev, experience: e.target.value }))}
            disabled={!isEditing}
            className="rounded-xl bg-[#f8f9fa] border border-gray-200 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}
    </div>
    {isEditing && (
      <div className="flex space-x-2 mt-4">
        <Button onClick={handleSave} className="flex-1 rounded-xl text-base h-12 font-semibold bg-blue-600 text-white">
          Save Changes
        </Button>
      </div>
    )}
  </ModernCard>
);

export default ProfileInfo;
