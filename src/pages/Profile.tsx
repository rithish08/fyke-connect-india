
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import EnhancedProfileInfo from '@/components/profile/EnhancedProfileInfo';
import ProfileSkills from '@/components/profile/ProfileSkills';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileVerification from '@/components/profile/ProfileVerification';
import ProfileSettings from '@/components/profile/ProfileSettings';
import BannerAd from '@/components/BannerAd';
import ProfileProgress from '@/components/ProfileProgress';
import BottomNavigation from '@/components/BottomNavigation';
import { SkeletonProfileCard } from '@/components/ui/skeleton-cards';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: '',
    location: 'Mumbai, Maharashtra',
    experience: '2 years',
    bio: '',
    skills: user?.skills || ['Construction', 'Manual Labor', 'Team Work']
  });
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileUpdate = async (updates: any) => {
    setIsLoading(true);
    try {
      updateProfile(updates);
      setProfileData(prev => ({ ...prev, ...updates }));
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully"
    });
  };

  // Show loading state
  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="max-w-xl mx-auto pt-8 px-4 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-gray-200 rounded-full animate-pulse mb-4" />
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
          <SkeletonProfileCard />
          <SkeletonProfileCard />
          <SkeletonProfileCard />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Profile completeness calculation
  const hasName = !!profileData.name;
  const hasPhoto = true;
  const hasSkills = profileData.skills && profileData.skills.length > 0;
  const hasLocation = !!profileData.location;
  const fields = [hasName, hasPhoto, hasSkills, hasLocation];
  const completePercent = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {showBanner && <BannerAd onClose={() => setShowBanner(false)} />}
      <ProfileProgress />
      
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-8 pb-4 px-4">
        <ProfileHeader
          name={profileData.name}
          phone={user.phone}
          role={user.role}
          verified={!!user.verified}
        />
        
        {/* Profile Completion Ring */}
        <div className="flex flex-col items-center mt-4">
          <div className="relative w-20 h-20 flex items-center justify-center mb-2">
            <svg className="absolute top-0 left-0" width="80" height="80">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#F2F3F6"
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
      </div>

      {/* Profile Sections */}
      <div className="w-full max-w-xl mx-auto space-y-4 px-4">
        <EnhancedProfileInfo
          profileData={profileData}
          userRole={user.role}
          onUpdate={handleProfileUpdate}
        />
        
        <ProfileSkills
          userRole={user.role}
          skills={profileData.skills}
          isEditing={false}
        />
        
        <ProfileStats userRole={user.role} />
        <ProfileVerification verified={!!user.verified} />
        <ProfileSettings onLogout={handleLogout} />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
