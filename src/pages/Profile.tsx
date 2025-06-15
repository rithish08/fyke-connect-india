
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import ProfileEditableInfo from "@/components/profile/ProfileEditableInfo";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Profile = () => {
  const { userProfile, updateProfile } = useAuth();
  const [availability, setAvailability] = React.useState(userProfile?.availability || "available");

  React.useEffect(() => {
    if (userProfile) {
      setAvailability(userProfile.availability);
    }
  }, [userProfile]);

  const handleAvailabilityChange = async (newVal: boolean) => {
    const newStatus = newVal ? "available" : "busy";
    setAvailability(newStatus);
    try {
      await updateProfile({ availability: newStatus });
      toast({
        title: "Availability Updated",
        description: `Your availability is now set to "${newStatus}".`,
      });
    } catch (e: any) {
      toast({ title: "Failed to Update", description: e.message, variant: "destructive" });
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col px-2 py-10 md:py-14">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Profile summary card */}
        <ProfileSummaryCard
          name={userProfile.name || ""}
          primaryCategory={userProfile.primary_category || ""}
          rating={4.5}
          reviewCount={19}
          avatarUrl={userProfile.avatar_url || ""}
          isVerified={true}
          location={userProfile.location}
          phone={userProfile.phone}
          email={userProfile.email}
        />
        {/* Editable info card */}
        <ProfileEditableInfo
          initialName={userProfile.name || ""}
          initialLocation={userProfile.location || ""}
          initialBio={userProfile.bio || ""}
          initialEmail={userProfile.email || ""}
        />
        {/* Availability switch */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-md flex items-center justify-between">
          <Label htmlFor="availability" className="text-base font-medium text-gray-800">
            Availability
          </Label>
          <div className="flex items-center gap-3">
            <Switch
              id="availability"
              checked={availability === "available"}
              onCheckedChange={handleAvailabilityChange}
            />
            <span className={`font-semibold text-sm ${
              availability === "available"
                ? "text-green-600"
                : "text-orange-500"
            }`}>
              {availability === "available" ? "Available" : "Busy"}
            </span>
          </div>
        </div>
        {/* Edit profile setup button */}
        <Button
          variant="outline"
          className="w-full justify-center mt-2"
          onClick={() => window.location.assign("/profile-setup")}
        >
          Edit Full Profile
        </Button>
      </div>
    </div>
  );
};

export default Profile;
