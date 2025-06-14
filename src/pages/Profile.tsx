
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInfo from '@/components/profile/ProfileInfo';
import ProfileSkills from '@/components/profile/ProfileSkills';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileVerification from '@/components/profile/ProfileVerification';
import ProfileSettings from '@/components/profile/ProfileSettings';
import FloatingEditButton from '@/components/profile/FloatingEditButton';
import BannerAd from '@/components/BannerAd';
import ProfileProgress from '@/components/ProfileProgress';
import BottomNavigation from '@/components/BottomNavigation';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: '',
    location: 'Mumbai, Maharashtra',
    experience: '2 years',
    skills: user?.skills || ['Construction', 'Manual Labor', 'Team Work']
  });
  const [showBanner, setShowBanner] = useState(true);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white pb-24">
      {showBanner && <BannerAd onClose={() => setShowBanner(false)} />}
      <ProfileProgress />
      <div className="flex flex-col items-center pt-8 pb-4">
        <ProfileHeader
          name={profileData.name}
          phone={user.phone}
          role={user.role}
          verified={!!user.verified}
        />
        {/* Profile Progress Ring */}
        <div className="flex flex-col items-center mt-2">
          <div className="relative w-20 h-20 flex items-center justify-center mb-1">
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

      {/* Main Profile Sections */}
      <div className="w-full max-w-xl mx-auto space-y-7 mt-6">
        <ProfileInfo
          profileData={profileData}
          isEditing={isEditing}
          setProfileData={setProfileData}
          handleSave={handleSave}
          userRole={user.role}
        />
        <ProfileSkills
          userRole={user.role}
          skills={profileData.skills}
          isEditing={isEditing}
        />
        <ProfileStats userRole={user.role} />
        <ProfileVerification verified={!!user.verified} />
        <ProfileSettings onLogout={handleLogout} />
      </div>
      <FloatingEditButton isEditing={isEditing} setIsEditing={setIsEditing} />
      <BottomNavigation />
    </div>
  );
};

export default Profile;
