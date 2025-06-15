
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { 
  User, MapPin, Phone, Mail, Star, Award, Settings, 
  Edit, Camera, Plus, FileText, CheckCircle, Clock,
  Shield, AlertTriangle, LogOut 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';

interface ProfileData {
  name: string;
  email: string;
  location: string;
  phone: string;
  bio: string;
  skills: string[];
  categories: string[];
}

const Profile = () => {
  const { userProfile, logout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const [profileData, setProfileData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    location: userProfile?.location || '',
    phone: userProfile?.phone || '',
    bio: userProfile?.bio || '',
    skills: userProfile?.skills || [],
    categories: userProfile?.categories || []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProfileData(prev => ({ ...prev, skills: value.split(',').map(s => s.trim()) }));
  };

  const handleCategoriesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProfileData(prev => ({ ...prev, categories: value.split(',').map(c => c.trim()) }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Reset form data to original values
    setProfileData({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      location: userProfile?.location || '',
      phone: userProfile?.phone || '',
      bio: userProfile?.bio || '',
      skills: userProfile?.skills || [],
      categories: userProfile?.categories || []
    });
  };

  const handleSaveClick = () => {
    // In a real app, this would update the profile data in the database
    setIsEditing(false);
    console.log('Saving profile data:', profileData);
    // Here you would typically call an API to update the profile
  };

  const handleLogout = async () => {
    setShowLogoutConfirmation(false);
    await logout();
  };

  const ProfileHeader = () => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-white shadow-md">
              <AvatarImage src="/placeholder.svg" alt={profileData.name} />
              <AvatarFallback className="bg-muted">
                <User className="w-10 h-10 text-gray-500" />
              </AvatarFallback>
            </Avatar>
            {isEditing && (
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                <Camera className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{profileData.name}</h1>
              {isEditing ? (
                <div className="space-x-2">
                  <Button size="sm" onClick={handleSaveClick}>Save</Button>
                  <Button size="sm" variant="ghost" onClick={handleCancelClick}>Cancel</Button>
                </div>
              ) : (
                <Button size="sm" variant="secondary" onClick={handleEditClick}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
            
            <div className="space-y-2 text-gray-600">
              <div className="flex items-center justify-center md:justify-start space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{profileData.location}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-1">
                <Phone className="w-4 h-4" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-1">
                <Mail className="w-4 h-4" />
                <span>{profileData.email}</span>
              </div>
            </div>

            <p className="mt-3 text-gray-700">{profileData.bio}</p>
            
            <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
              {profileData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
              {profileData.categories.map((category, index) => (
                <Badge key={index} variant="outline">{category}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EditProfileSection = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input 
            type="text" 
            id="name" 
            name="name" 
            value={profileData.name} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            type="email" 
            id="email" 
            name="email" 
            value={profileData.email} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input 
            type="text" 
            id="location" 
            name="location" 
            value={profileData.location} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input 
            type="tel" 
            id="phone" 
            name="phone" 
            value={profileData.phone} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea 
            id="bio" 
            name="bio" 
            value={profileData.bio} 
            onChange={handleInputChange} 
          />
        </div>
        <div>
          <Label htmlFor="skills">Skills (comma separated)</Label>
          <Input 
            type="text" 
            id="skills" 
            name="skills" 
            value={profileData.skills.join(', ')} 
            onChange={handleSkillsChange} 
          />
        </div>
        <div>
          <Label htmlFor="categories">Categories (comma separated)</Label>
          <Input 
            type="text" 
            id="categories" 
            name="categories" 
            value={profileData.categories.join(', ')} 
            onChange={handleCategoriesChange} 
          />
        </div>
      </CardContent>
    </Card>
  );

  const AccountSettings = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Account Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Notifications</span>
          <Switch />
        </div>
        <div className="flex items-center justify-between">
          <span>Dark Mode</span>
          <Switch />
        </div>
        <Separator />
        <Button variant="destructive" className="w-full justify-start" onClick={() => setShowLogoutConfirmation(true)}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );

  const VerificationStatus = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Verification Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Account Verified</span>
          {userProfile?.verified ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          )}
        </div>
        
        <div className="text-sm text-gray-500">
          {userProfile?.verified ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 inline-block mr-1" />
              Your account is verified.
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-yellow-500 inline-block mr-1" />
              Verification pending.
            </>
          )}
        </div>
        
        {!userProfile?.verified && (
          <Button className="w-full" variant="outline">
            Start Verification Process
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="container max-w-4xl mx-auto px-4">
        <ProfileHeader />
        
        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-4">
            {isEditing ? <EditProfileSection /> : null}
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <AccountSettings />
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-4">
            <VerificationStatus />
          </TabsContent>
        </Tabs>

        {/* Logout Confirmation Dialog */}
        {showLogoutConfirmation && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <h3 className="text-lg font-medium text-gray-800">Logout Confirmation</h3>
              <div className="mt-2 text-gray-600">
                Are you sure you want to logout?
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => setShowLogoutConfirmation(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      <BottomNavigation />
    </div>
  );

  // Helper functions for handlers
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  }

  function handleSkillsChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setProfileData(prev => ({ ...prev, skills: value.split(',').map(s => s.trim()) }));
  }

  function handleCategoriesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setProfileData(prev => ({ ...prev, categories: value.split(',').map(c => c.trim()) }));
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleCancelClick() {
    setIsEditing(false);
    // Reset form data to original values
    setProfileData({
      name: userProfile?.name || '',
      email: userProfile?.email || '',
      location: userProfile?.location || '',
      phone: userProfile?.phone || '',
      bio: userProfile?.bio || '',
      skills: userProfile?.skills || [],
      categories: userProfile?.categories || []
    });
  }

  function handleSaveClick() {
    // In a real app, this would update the profile data in the database
    setIsEditing(false);
    console.log('Saving profile data:', profileData);
    // Here you would typically call an API to update the profile
  }

  async function handleLogout() {
    setShowLogoutConfirmation(false);
    await logout();
  }

  function EditProfileSection() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input 
              type="text" 
              id="name" 
              name="name" 
              value={profileData.name} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              type="email" 
              id="email" 
              name="email" 
              value={profileData.email} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              type="text" 
              id="location" 
              name="location" 
              value={profileData.location} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input 
              type="tel" 
              id="phone" 
              name="phone" 
              value={profileData.phone} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea 
              id="bio" 
              name="bio" 
              value={profileData.bio} 
              onChange={handleInputChange} 
            />
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input 
              type="text" 
              id="skills" 
              name="skills" 
              value={profileData.skills.join(', ')} 
              onChange={handleSkillsChange} 
            />
          </div>
          <div>
            <Label htmlFor="categories">Categories (comma separated)</Label>
            <Input 
              type="text" 
              id="categories" 
              name="categories" 
              value={profileData.categories.join(', ')} 
              onChange={handleCategoriesChange} 
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  function AccountSettings() {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Account Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Notifications</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch />
          </div>
          <Separator />
          <Button variant="destructive" className="w-full justify-start" onClick={() => setShowLogoutConfirmation(true)}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </CardContent>
      </Card>
    );
  }

  function VerificationStatus() {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Verification Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Account Verified</span>
            {userProfile?.verified ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            {userProfile?.verified ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-500 inline-block mr-1" />
                Your account is verified.
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-yellow-500 inline-block mr-1" />
                Verification pending.
              </>
            )}
          </div>
          
          {!userProfile?.verified && (
            <Button className="w-full" variant="outline">
              Start Verification Process
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
};

export default Profile;
