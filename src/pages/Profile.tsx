
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ModernCard } from '@/components/ui/modern-card';
import { Check, Star } from 'lucide-react';

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

  // Profile completeness calculation for progress ring
  const hasName = !!profileData.name;
  const hasPhoto = true; // assume true for now
  const hasSkills = profileData.skills && profileData.skills.length > 0;
  const hasLocation = !!profileData.location;
  const fields = [hasName, hasPhoto, hasSkills, hasLocation];
  const completePercent = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4f8fc] to-white pb-24">
      {/* Profile Header Modern Card */}
      <div className="flex flex-col items-center pt-7 pb-2">
        <ModernCard
          variant="glass"
          className="w-full max-w-xl mx-auto flex flex-col items-center p-8 pt-10 border-0 bg-white/70 shadow-xl rounded-2xl"
        >
          <div className="relative mb-2">
            <div className="w-28 h-28 bg-white shadow-lg rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white">
              <span className="text-5xl font-bold text-[#264669] uppercase">
                {profileData.name ? profileData.name[0] : user?.phone?.[0] || 'U'}
              </span>
              {/* Replace above with user's photo if available */}
            </div>
            {user?.verified && (
              <span className="absolute bottom-2 right-0 bg-white rounded-full shadow px-1.5 py-0.5">
                <Check className="w-5 h-5 text-green-500 inline" />
              </span>
            )}
          </div>
          <div className="flex flex-col items-center mb-2">
            <span className="font-semibold text-lg text-[#222D3A] flex items-center">
              {profileData.name || "Complete Your Profile"}
              {user?.verified && (
                <Check className="ml-2 w-5 h-5 text-green-500" />
              )}
            </span>
            <span className="text-sm text-gray-500 mt-1">{user?.phone}</span>
            <span className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role}</span>
          </div>
          {/* Profile Progress Ring & status below Avatar */}
          <div className="flex flex-col items-center mt-2">
            <div className="relative w-20 h-20 flex items-center justify-center mb-1">
              {/* Simple Circular Progress Bar */}
              <svg className="absolute top-0 left-0" width="80" height="80">
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#EFF3F9"
                  strokeWidth="7"
                  fill="none"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  stroke="#254778"
                  strokeWidth="7"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - completePercent / 100)}
                  style={{ transition: 'stroke-dashoffset 0.7s' }}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-medium z-10 text-[#254778]">
                {completePercent}%
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {completePercent}% complete
            </span>
          </div>
        </ModernCard>
      </div>

      {/* Main Profile Sections */}
      <div className="w-full max-w-xl mx-auto space-y-7 mt-6">
        {/* Personal Information */}
        <ModernCard className="p-6 rounded-2xl shadow-md border-0 bg-white/70">
          <span className="text-base font-semibold text-gray-900 mb-4 block">
            Personal Information
          </span>
          <div className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!isEditing}
                placeholder="Enter your full name"
                className="rounded-2xl bg-[#f5f8fa] border-0 focus:ring-2 focus:ring-blue-200"
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
                className="rounded-2xl bg-[#f5f8fa] border-0 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                disabled={!isEditing}
                className="rounded-2xl bg-[#f5f8fa] border-0 focus:ring-2 focus:ring-blue-200"
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
                  className="rounded-2xl bg-[#f5f8fa] border-0 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            )}
          </div>
          {isEditing && (
            <div className="flex space-x-2 mt-4">
              <Button onClick={handleSave} className="flex-1 rounded-2xl text-base h-12 font-semibold">
                Save Changes
              </Button>
            </div>
          )}
        </ModernCard>

        {/* Skills (Job Seekers) */}
        {user?.role === 'jobseeker' && (
          <ModernCard className="p-6 rounded-2xl shadow-md border-0 bg-white/65">
            <span className="text-base font-semibold text-gray-900 mb-2 block">Skills</span>
            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full shadow inline-flex items-center"
                >
                  {skill}
                </span>
              ))}
              <Button variant="outline" size="sm" disabled={!isEditing} className="rounded-full border-blue-100 bg-white/60 hover:bg-blue-50 text-blue-600 font-semibold text-xs">
                + Add Skill
              </Button>
            </div>
          </ModernCard>
        )}

        {/* Statistics (with icons) */}
        <ModernCard className="p-6 rounded-2xl shadow-md border-0 bg-white/70 flex justify-between items-center">
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="flex items-center gap-1 text-blue-800 font-bold text-2xl">
              <Star className="w-6 h-6 text-blue-500 mr-1" /> 4.5
            </span>
            <span className="text-xs text-blue-600 font-medium mt-1">Rating</span>
          </div>
          <div className="h-12 w-0.5 bg-gray-100 rounded-full mx-3" />
          <div className="flex flex-col items-center justify-center flex-1">
            <span className="flex items-center gap-1 text-red-700 font-bold text-2xl">
              <span className="bg-red-50 rounded-full p-0.5 mr-1"><svg width="20" height="20" fill="none" stroke="currentColor" className="text-red-500"><path d="M10 2v5"/><path d="M10 14v1"/><path d="M7 9a3 3 0 0 1 6 0c0 2-2 4-3 4s-3-2-3-4z"/></svg></span>
              12
            </span>
            <span className="text-xs text-red-500 font-medium mt-1">{user?.role === 'jobseeker' ? 'Applications' : 'Jobs Posted'}</span>
          </div>
        </ModernCard>

        {/* Verification Status */}
        <ModernCard className="p-6 rounded-2xl shadow-md border-0 bg-white/70">
          <span className="text-base font-semibold text-gray-900 mb-2 block">
            Verification
          </span>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={user?.verified ? 'text-green-500' : 'text-gray-400'}>
                  {user?.verified ? <Check className="w-6 h-6" /> : '⭕'}
                </span>
                <div>
                  <span className="font-medium">Phone Number</span>
                  <span className="block text-xs text-gray-500">Verified with OTP</span>
                </div>
              </div>
              <Badge variant={user?.verified ? 'secondary' : 'outline'} className="rounded-full">
                {user?.verified ? 'Verified' : 'Pending'}
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
              <Button variant="outline" size="sm" className="rounded-full border-blue-100 bg-white/60 hover:bg-blue-50 text-blue-600 font-semibold text-xs">
                Verify Now
              </Button>
            </div>
          </div>
        </ModernCard>

        {/* Settings */}
        <ModernCard className="p-6 rounded-2xl shadow-md border-0 bg-white/60">
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
            <Button variant="outline" className="w-full rounded-2xl bg-white/70 hover:bg-blue-50 font-semibold">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full rounded-2xl bg-white/70 hover:bg-blue-50 font-semibold">
              Help & Support
            </Button>
            <Button
              variant="destructive"
              className="w-full rounded-2xl font-semibold"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </ModernCard>
      </div>

      {/* Edit Button Floating */}
      <Button
        variant="ghost"
        size="lg"
        onClick={() => setIsEditing(!isEditing)}
        className="fixed top-7 right-6 z-40 bg-white/70 shadow-lg rounded-full text-blue-700 hover:bg-blue-100 border-0"
      >
        {isEditing ? "Cancel" : "Edit"}
      </Button>

      <BottomNavigation />
    </div>
  );
};

export default Profile;

