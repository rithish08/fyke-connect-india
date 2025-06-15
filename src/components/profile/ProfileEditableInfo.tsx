
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileEditableInfoProps {
  initialName?: string;
  initialLocation?: string;
  initialBio?: string;
  initialEmail?: string;
  editableFields?: { [key: string]: boolean }; // for future, not used now
}

const ProfileEditableInfo: React.FC<ProfileEditableInfoProps> = ({
  initialName = "",
  initialLocation = "",
  initialBio = "",
  initialEmail = "",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name] = useState(initialName); // name cannot be edited, lock field
  const [location, setLocation] = useState(initialLocation);
  const [bio, setBio] = useState(initialBio);
  const [email, setEmail] = useState(initialEmail);

  const { updateProfile } = useAuth();

  const handleSave = async () => {
    try {
      await updateProfile({ location: location.trim(), bio: bio, email: email.trim() });
      setIsEditing(false);
      toast({ title: "Profile Updated", description: "Your details have been updated." });
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    }
  };

  return (
    <Card className="rounded-2xl shadow-md px-6 pb-6 pt-4 border-gray-100 bg-white">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-gray-900 text-lg">Personal Information</span>
        {!isEditing && (
          <Button size="sm" variant="outline" className="text-blue-600 border-blue-100" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        )}
      </div>

      <form
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div>
          <Label htmlFor="profile-name" className="block mb-1 font-medium">Full Name</Label>
          <Input
            id="profile-name"
            value={name}
            disabled
            placeholder="Name cannot be changed"
            className="rounded-xl bg-gray-50 border border-gray-200"
          />
          <div className="text-xs text-gray-400 pt-1">Contact support to update your name.</div>
        </div>
        <div>
          <Label htmlFor="profile-email" className="block mb-1 font-medium">Email</Label>
          <Input
            id="profile-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your email"
            className="rounded-xl bg-gray-50 border border-gray-200"
          />
        </div>
        <div>
          <Label htmlFor="profile-location" className="block mb-1 font-medium">Location</Label>
          <Input
            id="profile-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={!isEditing}
            className="rounded-xl bg-gray-50 border border-gray-200"
          />
        </div>
        <div>
          <Label htmlFor="profile-bio" className="block mb-1 font-medium">Bio / Experience</Label>
          <Input
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={!isEditing}
            className="rounded-xl bg-gray-50 border border-gray-200"
            placeholder="Tell us about yourself (optional)"
          />
        </div>
        {isEditing && (
          <div className="flex space-x-2 pt-2">
            <Button type="submit" className="flex-1 rounded-xl h-11 text-base font-semibold bg-blue-600 text-white">Save</Button>
            <Button type="button" onClick={() => setIsEditing(false)} variant="outline" className="flex-1 h-11 rounded-xl">Cancel</Button>
          </div>
        )}
      </form>
    </Card>
  );
};

export default ProfileEditableInfo;
