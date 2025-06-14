
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import EditableProfileCard from './EditableProfileCard';
import { MapPin, Briefcase, Mail, User } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  location: string;
  experience: string;
  bio?: string;
}

interface EnhancedProfileInfoProps {
  profileData: ProfileData;
  userRole: string;
  onUpdate: (data: Partial<ProfileData>) => void;
}

const EnhancedProfileInfo: React.FC<EnhancedProfileInfoProps> = ({
  profileData,
  userRole,
  onUpdate
}) => {
  const [editData, setEditData] = useState(profileData);

  const handleSave = () => {
    onUpdate(editData);
  };

  const editContent = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
        <Input
          id="name"
          value={editData.name}
          onChange={(e) => setEditData({...editData, name: e.target.value})}
          className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
          placeholder="Enter your full name"
        />
      </div>
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          value={editData.email}
          onChange={(e) => setEditData({...editData, email: e.target.value})}
          className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
        <Input
          id="location"
          value={editData.location}
          onChange={(e) => setEditData({...editData, location: e.target.value})}
          className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
          placeholder="Enter your location"
        />
      </div>
      {userRole === 'jobseeker' && (
        <div>
          <Label htmlFor="experience" className="text-sm font-medium text-gray-700">Experience</Label>
          <Input
            id="experience"
            value={editData.experience}
            onChange={(e) => setEditData({...editData, experience: e.target.value})}
            className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
            placeholder="e.g., 2 years"
          />
        </div>
      )}
      <div>
        <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
        <Textarea
          id="bio"
          value={editData.bio || ''}
          onChange={(e) => setEditData({...editData, bio: e.target.value})}
          className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
          placeholder="Tell us about yourself..."
          rows={3}
        />
      </div>
    </div>
  );

  const displayContent = (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <User className="w-4 h-4 text-gray-500" />
        <span className="text-gray-900">{profileData.name || 'Add your name'}</span>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">{profileData.email || 'Add your email'}</span>
      </div>
      <div className="flex items-center gap-3">
        <MapPin className="w-4 h-4 text-gray-500" />
        <span className="text-gray-600">{profileData.location}</span>
      </div>
      {userRole === 'jobseeker' && (
        <div className="flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">{profileData.experience}</span>
        </div>
      )}
      {profileData.bio && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600">{profileData.bio}</p>
        </div>
      )}
    </div>
  );

  return (
    <EditableProfileCard
      title="Personal Information"
      onSave={handleSave}
      editContent={editContent}
    >
      {displayContent}
    </EditableProfileCard>
  );
};

export default EnhancedProfileInfo;
