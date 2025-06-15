import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import EditableProfileCard from './EditableProfileCard';
import { MapPin, Briefcase, Mail, User, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const { updateProfile } = useAuth();

  React.useEffect(() => {
    setEditData(profileData);
  }, [profileData]);

  const handleSave = async () => {
    const result = await updateProfile(editData);
    if (!result.error) {
      onUpdate(editData);
    }
  };

  // Disable name field (protected, not editable)
  const editContent = (
    <div className="space-y-4">
      {/* Name (Protected) */}
      <div>
        <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700 flex items-center">
          <Lock className="w-3 h-3 mr-1" />
          Name (Protected)
        </Label>
        <Input
          id="edit-name"
          value={editData.name}
          disabled
          className="mt-1 rounded-xl border-gray-200 bg-gray-50 cursor-not-allowed"
          placeholder="Name cannot be changed"
        />
        <p className="text-xs text-gray-500 mt-1">Contact support to change your name</p>
      </div>
      {/* Email (editable) */}
      <div>
        <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">Email</Label>
        <Input
          id="edit-email"
          type="email"
          value={editData.email || ''}
          onChange={(e) => setEditData({...editData, email: e.target.value})}
          className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
          placeholder="Enter your email"
        />
      </div>
      {/* Location (editable) */}
      <div>
        <Label htmlFor="edit-location" className="text-sm font-medium text-gray-700">Location</Label>
        <Input
          id="edit-location"
          value={editData.location || ''}
          onChange={(e) => setEditData({...editData, location: e.target.value})}
          className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
          placeholder="Enter your location"
        />
      </div>
      {/* Role-specific: Experience for jobseeker */}
      {userRole === 'jobseeker' && (
        <div>
          <Label htmlFor="edit-experience" className="text-sm font-medium text-gray-700">Experience</Label>
          <Input
            id="edit-experience"
            value={editData.experience || ''}
            onChange={(e) => setEditData({...editData, experience: e.target.value})}
            className="mt-1 rounded-xl border-gray-200 focus:border-blue-500"
            placeholder="e.g., 2 years"
          />
        </div>
      )}
      {/* Bio (editable) */}
      <div>
        <Label htmlFor="edit-bio" className="text-sm font-medium text-gray-700">Bio</Label>
        <Textarea
          id="edit-bio"
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
        <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-gray-900">{profileData.name || 'Add your name'}</span>
      </div>
      <div className="flex items-center gap-3">
        <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-gray-600">{profileData.email || 'Add your email'}</span>
      </div>
      <div className="flex items-center gap-3">
        <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <span className="text-gray-600">{profileData.location}</span>
      </div>
      {userRole === 'jobseeker' && (
        <div className="flex items-center gap-3">
          <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
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
