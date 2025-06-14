
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const CompactRoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const switchLabel = user.role === "jobseeker" ? "→ Employer" : "→ Jobseeker";

  return (
    <div className="flex items-center justify-center mb-2">
      <Button
        onClick={switchRole}
        variant="outline"
        size="sm"
        className="flex items-center gap-1 h-7 px-2 text-xs border-gray-200 hover:bg-gray-50 rounded-full"
        title="Switch Role"
      >
        <ArrowRightLeft className="w-3 h-3" />
        {switchLabel}
      </Button>
    </div>
  );
};
export default CompactRoleSwitcher;
