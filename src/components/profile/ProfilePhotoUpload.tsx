import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ProfilePhotoUploadProps {
  currentPhoto?: string;
  userName?: string;
  onPhotoUpdate: (photoUrl: string) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  currentPhoto,
  userName,
  onPhotoUpdate
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadPhoto = async (file: File) => {
    if (!user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new photo URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_photo: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      onPhotoUpdate(publicUrl);
      toast({
        title: 'Profile Photo Updated',
        description: 'Your profile photo has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload profile photo. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: 'Please select an image file.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'Please select an image smaller than 5MB.',
          variant: 'destructive',
        });
        return;
      }

      uploadPhoto(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
          <AvatarImage src={currentPhoto} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
            {userName?.split(' ').map(n => n[0]).join('') || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2">
          <Button 
            size="sm" 
            className="rounded-full w-8 h-8 p-0 cursor-pointer shadow-md"
            disabled={uploading}
            aria-label="Upload profile photo"
          >
            {uploading ? (
              <div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Camera className="w-4 h-4" />
            )}
          </Button>
        </label>
        
        <input
          id="photo-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>
      
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">Click the camera icon to change your photo</p>
        <p className="text-xs text-gray-500">Supported: JPG, PNG (max 5MB)</p>
      </div>
    </div>
  );
};

export default ProfilePhotoUpload;