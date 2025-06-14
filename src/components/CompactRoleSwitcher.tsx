
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const CompactRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  
  if (!user) return null;

  const otherRole = user.role === "jobseeker" ? "employer" : "jobseeker";
  const switchLabel = user.role === "jobseeker" ? "Switch to Employer" : "Switch to Job Seeker";

  return (
    <div className="flex items-center justify-center mb-4">
      <Button
        onClick={switchRole}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 h-8 px-3 text-xs border-gray-200 hover:bg-gray-50 rounded-full"
      >
        <ArrowRightLeft className="w-3 h-3" />
        {switchLabel}
      </Button>
    </div>
  );
};

export default CompactRoleSwitcher;
