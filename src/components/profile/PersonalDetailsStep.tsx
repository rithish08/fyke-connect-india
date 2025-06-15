
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, MapPin, FileText } from 'lucide-react';

interface PersonalDetailsStepProps {
  name: string;
  setName: (name: string) => void;
  location: string;
  setLocation: (location: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  onComplete: () => void;
  loading: boolean;
}

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  name,
  setName,
  location,
  setLocation,
  bio,
  setBio,
  onComplete,
  loading
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-gray-500">Tell us about yourself</p>
      </div>
      
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <User className="w-4 h-4" />
            <span>Full Name *</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <MapPin className="w-4 h-4" />
            <span>Location *</span>
          </label>
          <Input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, State"
            className="h-12"
          />
        </div>
        
        <div className="space-y-2">
          <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4" />
            <span>About You (Optional)</span>
          </label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell employers about your experience and skills..."
            className="min-h-[100px]"
          />
        </div>
      </Card>
      
      <Button
        onClick={onComplete}
        disabled={loading || !name.trim() || !location.trim()}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-2xl"
      >
        {loading ? 'Completing Setup...' : 'Complete Profile'}
      </Button>
    </div>
  );
};

export default PersonalDetailsStep;
