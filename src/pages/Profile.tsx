
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
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit3, Briefcase, Star, MapPin, TrendingUp, Award, Clock } from 'lucide-react';

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

  // Enhanced profile completeness calculation
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

  // Trust score calculation
  const trustScore = Math.min(100, (completePercent + (user.verified ? 25 : 0) + (hasSalaryRates ? 15 : 0)) / 1.4);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {showBanner && <BannerAd onClose={() => setShowBanner(false)} />}
      <ProfileProgress />
      
      {/* Enhanced Profile Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            {/* Profile Picture with Status */}
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {profileData.name?.charAt(0)?.toUpperCase() || user.phone?.charAt(0) || 'U'}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center ${
                user.availability === 'available' ? 'bg-green-500' : 
                user.availability === 'busy' ? 'bg-yellow-500' : 'bg-gray-400'
              }`}>
                {user.verified && <Award className="w-3 h-3 text-white" />}
              </div>
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  {profileData.name || user.phone}
                </h1>
                {user.verified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{profileData.location}</span>
              </div>
              {user.role === 'jobseeker' && (
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Briefcase className="w-3 h-3" />
                  <span>{profileData.experience}</span>
                </div>
              )}
              
              {/* Trust Score */}
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Trust Score: {Math.round(trustScore)}%
                </span>
              </div>
            </div>
            
            {/* Completion Ring */}
            <div className="flex flex-col items-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="absolute top-0 left-0" width="64" height="64">
                  <circle cx="32" cy="32" r="26" stroke="#F2F3F6" strokeWidth="4" fill="none" />
                  <circle
                    cx="32" cy="32" r="26" stroke="#254778" strokeWidth="4" fill="none"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - completePercent / 100)}
                    style={{ transition: 'stroke-dashoffset 0.7s' }}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-bold z-10 text-[#254778]">{completePercent}%</span>
              </div>
              <span className="text-xs text-gray-500 mt-1">Complete</span>
            </div>
          </div>

          {/* Categories and Quick Stats */}
          {user.categories && user.categories.length > 0 && (
            <div className="mt-4">
              <div className="flex flex-wrap gap-2 mb-3">
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
              
              {/* Quick Stats Row */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">12</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">4.8</div>
                  <div className="text-xs text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {user.availability === 'available' ? 'Online' : 
                     user.availability === 'busy' ? 'Busy' : 'Offline'}
                  </div>
                  <div className="text-xs text-gray-500">Status</div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Improvement Suggestion */}
          {completePercent < 100 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Complete your profile to get {100 - completePercent}% more visibility
                  </p>
                  <Progress value={completePercent} className="w-full mt-2 h-2" />
                </div>
                <Button size="sm" className="ml-3 bg-blue-600 hover:bg-blue-700">
                  <Edit3 className="w-3 h-3 mr-1" />
                  Edit
                </Button>
              </div>
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

        {/* Salary Rates Card with Performance Indicator */}
        {user.role === 'jobseeker' && user.salaryRates && (
          <ModernCard className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                {getLocalizedText('profile.salaryRates', 'Salary Rates')}
              </h3>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <TrendingUp className="w-3 h-3" />
                Competitive
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {user.salaryRates.daily && (
                <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-lg font-bold text-green-700">₹{user.salaryRates.daily}</div>
                  <div className="text-xs text-green-600">{getLocalizedText('profile.dailyRate', 'Daily')}</div>
                </div>
              )}
              {user.salaryRates.weekly && (
                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-lg font-bold text-blue-700">₹{user.salaryRates.weekly}</div>
                  <div className="text-xs text-blue-600">{getLocalizedText('profile.weeklyRate', 'Weekly')}</div>
                </div>
              )}
              {user.salaryRates.monthly && (
                <div className="text-center p-3 bg-purple-50 rounded-xl border border-purple-200">
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
