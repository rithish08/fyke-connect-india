
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react"; // Minimum size per Lucide docs

const CompactRoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const switchLabel = user.role === "jobseeker" ? "Employer" : "Jobseeker";

  return (
    <div className="flex items-center justify-center mb-1 mt-0">
      <Button
        onClick={switchRole}
        variant="ghost"
        size="icon"
        className="rounded-full p-0 border border-gray-200 bg-white shadow-none hover:bg-gray-100 w-7 h-7"
        title="Switch Role"
        aria-label={`Switch to ${switchLabel}`}
        style={{ minWidth: 0, minHeight: 0 }}
      >
        <ArrowRightLeft className="w-3.5 h-3.5 text-gray-600" />
        <span className="sr-only">{`Switch to ${switchLabel}`}</span>
      </Button>
      <span className="ml-1.5 text-[11px] font-medium text-gray-500">{switchLabel} mode</span>
    </div>
  );
};
export default CompactRoleSwitcher;
