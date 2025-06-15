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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Clock, User, Eye, Edit, Trash2, Briefcase, Star, Settings, PlusCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

const ProfileCategoryManager = ({
  categories,
  handleAdd,
  handleRemove,
}: {
  categories: string[];
  handleAdd: () => void;
  handleRemove: (idx: number) => void;
}) => {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        Work Categories
      </h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category: string, index: number) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 flex items-center gap-2">
              {category}
              <button
                onClick={() => handleRemove(index)}
                className="ml-1 text-red-500 hover:text-red-700 font-bold"
                aria-label="Remove category"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
        {categories.length < 3 && (
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center justify-center"
            onClick={handleAdd}
            type="button"
          >
            <PlusCircle className="w-4 h-4" />
            {categories.length === 0
              ? "Add Your First Category"
              : categories.length === 1
                ? "Add Second Category"
                : "Add Third Category"}
          </Button>
        )}
        <p className="text-sm text-gray-500">
          You can select up to 3 work categories to show your expertise areas.
        </p>
      </div>
    </Card>
  );
};

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || 'Mumbai, Maharashtra',
    experience: '2 years',
    bio: user?.bio || '',
    skills: user?.skills || ['Construction', 'Manual Labor', 'Team Work'],
    categories: user?.categories || []
  });
  const [showBanner, setShowBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const isEmployer = user?.role === 'employer';

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

  const handleAddCategory = () => {
    navigate('/profile-setup');
  };
  
  const handleRemoveCategory = (idx: number) => {
    const newCategories = profileData.categories.filter((_: any, i: number) => i !== idx);
    handleProfileUpdate({ categories: newCategories });
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
  const hasEmail = !!profileData.email;
  const hasPhoto = true;
  const hasSkills = profileData.skills && profileData.skills.length > 0;
  const hasLocation = !!profileData.location;
  const hasBio = !!profileData.bio;
  const fields = [hasName, hasEmail, hasPhoto, hasSkills, hasLocation, hasBio];
  const completePercent = Math.round((fields.filter(Boolean).length / fields.length) * 100);

  // Mock data for employer statistics
  const employerStats = {
    jobsPosted: 12,
    activeJobs: 3,
    totalHires: 45,
    avgRating: 4.7,
    responseRate: 92
  };

  // Mock data for job seeker statistics  
  const jobSeekerStats = {
    jobsApplied: 23,
    interviewsScheduled: 5,
    jobsCompleted: 15,
    avgRating: 4.5,
    responseRate: 89
  };

  const EmployerProfileContent = () => (
    <div className="space-y-4">
      {/* Employer Stats */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          Employer Dashboard
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{employerStats.jobsPosted}</div>
            <div className="text-sm text-gray-600">Jobs Posted</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{employerStats.activeJobs}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{employerStats.totalHires}</div>
            <div className="text-sm text-gray-600">Total Hires</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-2xl font-bold text-yellow-600">{employerStats.avgRating}</span>
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions for Employers */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => navigate('/post-job')} className="h-12">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
          <Button variant="outline" onClick={() => navigate('/my-jobs')} className="h-12">
            <Eye className="w-4 h-4 mr-2" />
            View My Jobs
          </Button>
          <Button variant="outline" onClick={() => navigate('/search')} className="h-12">
            <User className="w-4 h-4 mr-2" />
            Find Workers
          </Button>
          <Button variant="outline" onClick={() => navigate('/messages')} className="h-12">
            Messages
          </Button>
        </div>
      </Card>

      {/* Work Category Management */}
      <ProfileCategoryManager
        categories={profileData.categories}
        handleAdd={handleAddCategory}
        handleRemove={handleRemoveCategory}
      />

      {/* Company Information */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Company Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Company Name</span>
            <span className="font-medium">{profileData.name || 'Not specified'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Business Type</span>
            <span className="font-medium">Construction & Services</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Established</span>
            <span className="font-medium">2020</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Response Rate</span>
            <Badge variant="secondary">{employerStats.responseRate}%</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const JobSeekerProfileContent = () => (
    <div className="space-y-4">
      {/* Job Seeker Stats */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Job Seeker Dashboard
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{jobSeekerStats.jobsApplied}</div>
            <div className="text-sm text-gray-600">Jobs Applied</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{jobSeekerStats.interviewsScheduled}</div>
            <div className="text-sm text-gray-600">Interviews</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{jobSeekerStats.jobsCompleted}</div>
            <div className="text-sm text-gray-600">Jobs Completed</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-2xl font-bold text-yellow-600">{jobSeekerStats.avgRating}</span>
            </div>
            <div className="text-sm text-gray-600">Avg Rating</div>
          </div>
        </div>
      </Card>

      {/* Quick Actions for Job Seekers */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button onClick={() => navigate('/search')} className="h-12">
            Search Jobs
          </Button>
          <Button variant="outline" onClick={() => navigate('/my-jobs')} className="h-12">
            <Eye className="w-4 h-4 mr-2" />
            My Applications
          </Button>
          <Button variant="outline" onClick={() => navigate('/messages')} className="h-12">
            Messages
          </Button>
          <Button variant="outline" onClick={() => navigate('/profile-setup')} className="h-12">
            <Edit className="w-4 h-4 mr-2" />
            Edit Skills
          </Button>
        </div>
      </Card>

      {/* Categories and Skills */}
      <ProfileCategoryManager
        categories={profileData.categories}
        handleAdd={handleAddCategory}
        handleRemove={handleRemoveCategory}
      />

      {/* Skills & Experience */}
      <ProfileSkills
        userRole={user.role}
        skills={profileData.skills}
        isEditing={false}
      />
    </div>
  );

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
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4 mt-4">
            <EnhancedProfileInfo
              profileData={profileData}
              userRole={user.role}
              onUpdate={handleProfileUpdate}
            />
            
            {isEmployer ? <EmployerProfileContent /> : <JobSeekerProfileContent />}
            
            <ProfileStats userRole={user.role} />
            <ProfileVerification verified={!!user.verified} />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-4">
            <ProfileSettings onLogout={handleLogout} />
          </TabsContent>
        </Tabs>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
