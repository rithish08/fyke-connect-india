
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/hooks/useLocalization";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, Users, Briefcase, Search } from "lucide-react";

const roleConfig = {
  jobseeker: {
    gradient: "from-blue-500/10 to-indigo-500/10",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    icon: <User className="w-5 h-5 text-blue-600" />,
    title: "Job Seeker",
    subtitle: "Find & apply to jobs",
    textColor: "text-blue-700",
    actionIcon: <Search className="w-4 h-4" />
  },
  employer: {
    gradient: "from-green-500/10 to-emerald-500/10",
    border: "border-green-200", 
    iconBg: "bg-green-100",
    icon: <Users className="w-5 h-5 text-green-600" />,
    title: "Employer",
    subtitle: "Post jobs & hire",
    textColor: "text-green-700",
    actionIcon: <Briefcase className="w-4 h-4" />
  }
};

const EnhancedRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { getLocalizedText } = useLocalization();
  
  if (!user) return null;

  const config = roleConfig[user.role];
  const otherRole = user.role === "jobseeker" ? "employer" : "jobseeker";
  const switchLabel = user.role === "jobseeker" 
    ? getLocalizedText("common.switchToEmployer", "Switch to Employer")
    : getLocalizedText("common.switchToJobSeeker", "Switch to Job Seeker");

  return (
    <div className="max-w-2xl mx-auto px-4 mb-4">
      <div className={`bg-gradient-to-r ${config.gradient} ${config.border} border rounded-xl p-4 shadow-sm`}>
        <div className="flex items-center justify-between">
          {/* Current Role Info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className={`${config.iconBg} rounded-full p-2 shadow-sm`}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className={`font-semibold ${config.textColor} text-sm`}>
                  {config.title}
                </h3>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </div>
              <p className="text-gray-600 text-xs truncate">
                {config.subtitle}
              </p>
            </div>
          </div>

          {/* Switch Button */}
          <Button
            onClick={switchRole}
            variant="outline"
            size="sm"
            className="bg-white hover:bg-gray-50 border-gray-200 shadow-sm h-9 px-3 flex-shrink-0"
            aria-label={switchLabel}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            <span className="text-xs font-medium">Switch</span>
          </Button>
        </div>
        
        {/* Quick Action Hint */}
        <div className="mt-3 pt-3 border-t border-white/50">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            {config.actionIcon}
            <span>
              {user.role === "jobseeker" 
                ? "Tap search to find jobs in your area"
                : "Tap switch to browse available workers"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedRoleSwitcher;
