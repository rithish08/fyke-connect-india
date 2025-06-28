import { useState, useMemo } from 'react';
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
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Settings, Star, PlusCircle, Loader2, MapPin, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '@/contexts/LocalizationContext';
import { notificationService } from '@/services/notificationService';
import { AvailabilityWages } from '@/components/profile/AvailabilityWages';
import { getCurrentLocationArea } from '@/utils/locationUtils';

const ProfileCategoryManager = ({
  categories,
  onAdd,
}: {
  categories: string[] | undefined;
  onAdd: () => void;
}) => {
  const { t } = useLocalization();
  const currentCategories = categories || [];

  return (
    <Card className="p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center">
        <Settings className="w-5 h-5 mr-2" />
        {t('profile.workCategories', 'Work Categories')}
      </h3>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {currentCategories.map((category: string, index: number) => (
            <Badge key={index} variant="secondary" className="px-3 py-1 text-base">
              {category}
            </Badge>
          ))}
           {currentCategories.length === 0 && <p className="text-sm text-gray-500">{t('profile.noCategories', 'No categories selected.')}</p>}
        </div>
        {currentCategories.length < 3 && (
          <Button
            variant="outline"
            className="w-full flex gap-2 items-center justify-center mt-2"
            onClick={onAdd}
            type="button"
          >
            <PlusCircle className="w-4 h-4" />
            {t('profile.manageCategories', 'Manage Categories')}
          </Button>
        )}
        <p className="text-sm text-gray-500">
          {t('profile.categoryHintEditable', 'You can select up to 3 work categories.')}
        </p>
      </div>
    </Card>
  );
};

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLocalization();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: t('profile.loggedOutTitle', 'Logged Out'),
      description: t('profile.loggedOutDesc', 'You have been logged out successfully'),
    });
  };

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const locationData = await getCurrentLocationArea();
      if (locationData) {
        const { area, lat, lng } = locationData;
        await updateProfile({ location: area, latitude: lat, longitude: lng });
        
        // Send notification for location update
        try {
          await notificationService.sendProfileUpdateNotification();
        } catch (notificationError) {
          console.warn('Could not send profile update notification:', notificationError);
        }
        
        toast({
          title: t('profile.locationUpdated', 'Location Updated'),
          description: `${t('profile.yourLocationSetTo', 'Your location has been set to')} ${area}`,
        });
      } else {
        throw new Error('Could not detect location.');
      }
    } catch (error) {
      console.error("Location detection error:", error);
      toast({
        title: t('common.error', 'Error'),
        description: t('profile.locationDetectFailed', 'Failed to detect your location.'),
        variant: 'destructive',
      });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const completePercent = useMemo(() => {
    if (!user) return 0;
    const fields = [
      !!user.name,
      !!user.email,
      !!user.avatar_url,
      !!user.skills && user.skills.length > 0,
      !!user.location,
      !!user.bio,
      !!user.categories && user.categories.length > 0,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-500">{t('profile.loading', 'Loading profile...')}</p>
        </div>
      </div>
    );
  }

  const isEmployer = user.role === 'employer';

  const EmployerProfileContent = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <Briefcase className="w-5 h-5 mr-2" />
          {t('profile.employerDashboard', 'Employer Dashboard')}
        </h3>
        <p className="text-sm text-gray-600">{t('profile.dashboardComingSoon', 'Statistics and tools to manage your job postings will appear here.')}</p>
      </Card>
    </div>
  );

  const JobSeekerProfileContent = () => (
    <div className="space-y-4">
       <AvailabilityWages 
          availability={user.availability || 'offline'} 
          wages={user.wages || {}} 
          onUpdate={updateProfile}
        />
      <ProfileCategoryManager
        categories={user.categories}
        onAdd={() => navigate('/profile-setup/category')}
      />
      <ProfileSkills skills={user.skills || []} onEdit={() => navigate('/profile-setup/skills')} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <ProfileHeader
        name={user.name || t('common.unnamed', 'Unnamed User')}
        avatarUrl={user.avatar_url}
        role={user.role}
        location={user.location}
        onEdit={() => navigate('/profile-setup/name')}
      />

      <div className="p-4 space-y-6">
        <ProfileProgress
          progress={completePercent}
          onCompleteProfile={() => navigate('/profile-setup')}
        />

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">{t('profile.overview', 'Overview')}</TabsTrigger>
            <TabsTrigger value="settings">{t('profile.settings', 'Settings')}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <EnhancedProfileInfo bio={user.bio} onEdit={() => navigate('/profile-setup/bio')} />
            {isEmployer ? <EmployerProfileContent /> : <JobSeekerProfileContent />}
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-4">
                <Button onClick={handleDetectLocation} disabled={isDetectingLocation} className="w-full mb-2">
                    {isDetectingLocation ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MapPin className="mr-2 h-4 w-4" />}
                    {t('profile.updateLocation', 'Update Location')}
                </Button>
                <Button variant="outline" onClick={() => navigate('/profile-setup')} className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('profile.editFullProfile', 'Edit Full Profile')}
                </Button>
            </Card>
            <ProfileSettings onLogout={handleLogout} />
          </TabsContent>
        </Tabs>
        
        {showBanner && <BannerAd onClose={() => setShowBanner(false)} />}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Profile;
