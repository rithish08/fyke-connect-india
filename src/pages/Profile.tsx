
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: '',
    location: 'Mumbai, Maharashtra',
    experience: '2 years',
    skills: ['Construction', 'Manual Labor', 'Team Work']
  });

  const handleSave = () => {
    updateProfile({ name: profileData.name });
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully"
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white font-bold">
                {profileData.name ? profileData.name[0].toUpperCase() : user?.phone?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {profileData.name || 'Complete Your Profile'}
                </h2>
                {user?.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">{user?.phone}</p>
              <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          {!user?.profileComplete && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-sm text-yellow-800">
                  Complete your profile to get better job matches
                </span>
              </div>
            </div>
          )}
        </Card>

        {/* Personal Information */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                disabled={!isEditing}
              />
            </div>
            {user?.role === 'jobseeker' && (
              <div>
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => setProfileData({...profileData, experience: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        {/* Skills (Job Seekers) */}
        {user?.role === 'jobseeker' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
              <Button variant="outline" size="sm" disabled={!isEditing}>
                + Add Skill
              </Button>
            </div>
          </Card>
        )}

        {/* Verification Status */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={user?.verified ? 'text-green-500' : 'text-gray-400'}>
                  {user?.verified ? '✅' : '⭕'}
                </span>
                <div>
                  <p className="font-medium">Phone Number</p>
                  <p className="text-sm text-gray-500">Verified with OTP</p>
                </div>
              </div>
              <Badge variant={user?.verified ? 'secondary' : 'outline'}>
                {user?.verified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-gray-400">⭕</span>
                <div>
                  <p className="font-medium">Identity Verification</p>
                  <p className="text-sm text-gray-500">Upload Aadhaar card</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Verify Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {user?.role === 'jobseeker' ? '12' : '8'}
              </div>
              <div className="text-sm text-blue-700">
                {user?.role === 'jobseeker' ? 'Applications' : 'Jobs Posted'}
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">4.5</div>
              <div className="text-sm text-green-700">Rating</div>
            </div>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Job Notifications</p>
                <p className="text-sm text-gray-500">Get notified about new opportunities</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Message Notifications</p>
                <p className="text-sm text-gray-500">Get notified about new messages</p>
              </div>
              <Switch defaultChecked />
            </div>
            
            <Separator />
            
            <Button variant="outline" className="w-full">
              Privacy Settings
            </Button>
            
            <Button variant="outline" className="w-full">
              Help & Support
            </Button>
            
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Profile;
