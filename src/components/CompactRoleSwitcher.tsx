
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const CompactRoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const switchLabel = user.role === "jobseeker" ? "Employer" : "Jobseeker";

  return (
    <div className="flex items-center justify-center mb-1">
      <Button
        onClick={switchRole}
        variant="ghost"
        size="icon"
        className="rounded-full p-1 border border-gray-200 bg-white shadow-none hover:bg-gray-100 w-8 h-8"
        title="Switch Role"
      >
        <ArrowRightLeft className="w-4 h-4 text-gray-600" />
        <span className="sr-only">Switch to {switchLabel}</span>
      </Button>
      <span className="ml-2 text-xs font-medium text-gray-500">{switchLabel} mode</span>
    </div>
  );
};
export default CompactRoleSwitcher;
