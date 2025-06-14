
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/hooks/useLocalization';
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
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Edit3, Briefcase, Star, MapPin } from 'lucide-react';

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const { getLocalizedText } = useLocalization();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || 'Mumbai, Maharashtra',
    experience: '2 years',
    bio: user?.bio || '',
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
        title: getLocalizedText('profile.profileComplete', 'Profile Updated'),
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
  const hasEmail = !!profileData.email;
  const hasPhoto = true;
  const hasSkills = profileData.skills && profileData.skills.length > 0;
  const hasLocation = !!profileData.location;
  const hasBio = !!profileData.bio;
  const hasCategories = user.categories && user.categories.length > 0;
  const hasSalaryRates = user.salaryRates && (user.salaryRates.daily || user.salaryRates.weekly || user.salaryRates.monthly);
  
  const fields = [hasName, hasEmail, hasPhoto, hasSkills, hasLocation, hasBio, hasCategories, hasSalaryRates];
  const completePercent = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {showBanner && <BannerAd onClose={() => setShowBanner(false)} />}
      <ProfileProgress />
      
      {/* Compact Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {profileData.name?.charAt(0)?.toUpperCase() || user.phone?.charAt(0) || 'U'}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">
                {profileData.name || user.phone}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{profileData.location}</span>
              </div>
              {user.role === 'jobseeker' && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Briefcase className="w-3 h-3" />
                  <span>{profileData.experience}</span>
                </div>
              )}
            </div>
            
            {/* Completion Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="absolute top-0 left-0" width="48" height="48">
                  <circle cx="24" cy="24" r="20" stroke="#F2F3F6" strokeWidth="4" fill="none" />
                  <circle
                    cx="24" cy="24" r="20" stroke="#254778" strokeWidth="4" fill="none"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - completePercent / 100)}
                    style={{ transition: 'stroke-dashoffset 0.7s' }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs font-medium z-10 text-[#254778]">{completePercent}%</span>
              </div>
            </div>
          </div>

          {/* Categories Display */}
          {user.categories && user.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {user.categories.slice(0, 3).map((category, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                  {category}
                </Badge>
              ))}
              {user.categories.length > 3 && (
                <Badge variant="secondary" className="bg-gray-100 text-gray-600 text-xs">
                  +{user.categories.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Profile Sections */}
      <div className="w-full max-w-xl mx-auto space-y-3 px-4 pt-4">
        {/* Enhanced Profile Info */}
        <EnhancedProfileInfo
          profileData={profileData}
          userRole={user.role}
          onUpdate={handleProfileUpdate}
        />

        {/* Salary Rates Card */}
        {user.role === 'jobseeker' && user.salaryRates && (
          <ModernCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                {getLocalizedText('profile.salaryRates', 'Salary Rates')}
              </h3>
              <Edit3 className="w-4 h-4 text-gray-400" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {user.salaryRates.daily && (
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-700">₹{user.salaryRates.daily}</div>
                  <div className="text-xs text-green-600">{getLocalizedText('profile.dailyRate', 'Daily')}</div>
                </div>
              )}
              {user.salaryRates.weekly && (
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-700">₹{user.salaryRates.weekly}</div>
                  <div className="text-xs text-blue-600">{getLocalizedText('profile.weeklyRate', 'Weekly')}</div>
                </div>
              )}
              {user.salaryRates.monthly && (
                <div className="text-center p-2 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-700">₹{user.salaryRates.monthly}</div>
                  <div className="text-xs text-purple-600">{getLocalizedText('profile.monthlyRate', 'Monthly')}</div>
                </div>
              )}
            </div>
          </ModernCard>
        )}
        
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
