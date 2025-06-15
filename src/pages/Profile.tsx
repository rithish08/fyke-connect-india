import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from "@/contexts/LocalizationContext";
import { supabaseService } from '@/services/supabaseService';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Check } from 'lucide-react';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"

const Profile = () => {
  const { user, userProfile, updateProfile } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'busy' | 'offline'>(userProfile?.availability || 'available');

  useEffect(() => {
    if (userProfile) {
      setAvailability(userProfile.availability);
    }
  }, [userProfile]);

  const handleAvailabilityChange = async (newAvailability: 'available' | 'busy' | 'offline') => {
    setAvailability(newAvailability);
    await updateProfile({ availability: newAvailability });
    toast({
      title: "Availability Updated",
      description: `Your availability is now set to ${newAvailability}`
    });
  };

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <Card className="divide-y divide-gray-200">
          <CardContent className="py-8 px-5">
            {/* Avatar Section */}
            <div className="mb-6 flex flex-col items-center">
              <Avatar className="w-24 h-24 rounded-full border-4 border-white shadow-md">
                <AvatarImage src={`https://avatar.iran.liara.run/public/${userProfile.name}`} alt={userProfile.name || "Avatar"} />
                <AvatarFallback>{userProfile.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">{userProfile.name || 'Update your name'}</h2>
              <p className="text-sm text-gray-500">{userProfile.email || userProfile.phone}</p>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t('profile.location', 'Location')}</span>
                <span className="font-medium">{userProfile.location || 'Add location'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">{t('profile.role', 'Role')}</span>
                <span className="font-medium">{t(`role.${userProfile.role}`, userProfile.role)}</span>
              </div>
              {userProfile.role === 'jobseeker' && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{t('profile.experience', 'Experience')}</span>
                  <span className="font-medium">{userProfile.bio || 'Add experience'}</span>
                </div>
              )}
            </div>

            {/* Availability Switch */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
              <Label htmlFor="availability" className="text-sm font-medium text-gray-700">
                {t('profile.availability', 'Availability')}
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="availability"
                  checked={availability === 'available'}
                  onCheckedChange={(checked) => {
                    const newAvailability = checked ? 'available' : 'busy';
                    handleAvailabilityChange(newAvailability as 'available' | 'busy');
                  }}
                />
                <span className="text-sm text-gray-500">{availability}</span>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              variant="outline"
              className="mt-6 w-full justify-center"
              onClick={() => navigate('/profile-setup')}
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('profile.edit_profile', 'Edit Profile')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
