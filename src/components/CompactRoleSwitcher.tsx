import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, User, Users } from "lucide-react";

const CompactRoleSwitcher = () => {
  const { userProfile, switchRole } = useAuth();

  if (!userProfile) return null;

  const isJobSeeker = userProfile.role === "jobseeker";
  const switchLabel = isJobSeeker ? "Employer" : "Job Seeker";
  const currentIcon = isJobSeeker ? <User className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  const currentColor = isJobSeeker ? "text-blue-600 bg-blue-50" : "text-green-600 bg-green-50";

  return (
    <div className="flex items-center justify-center mb-2 mt-1">
      <div className={`flex items-center space-x-3 px-4 py-2 rounded-full border ${
        isJobSeeker ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'
      } shadow-sm`}>
        {/* Current Role Indicator */}
        <div className="flex items-center space-x-2">
          <div className={`flex items-center justify-center w-6 h-6 rounded-full ${currentColor}`}>
            {currentIcon}
          </div>
          <span className={`text-sm font-medium ${
            isJobSeeker ? 'text-blue-700' : 'text-green-700'
          }`}>
            {isJobSeeker ? 'Job Seeker' : 'Employer'}
          </span>
        </div>

        {/* Switch Button */}
        <Button
          onClick={switchRole}
          variant="ghost"
          size="sm"
          className="h-8 px-3 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 border"
          title={`Switch to ${switchLabel}`}
          aria-label={`Switch to ${switchLabel}`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5 text-gray-600" />
          <span className="text-xs font-medium text-gray-700">Switch</span>
        </Button>
      </div>
    </div>
  );
};

export default CompactRoleSwitcher;
