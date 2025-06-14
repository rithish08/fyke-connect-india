
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const modeConfig = {
  jobseeker: {
    color: "from-indigo-500 to-violet-400",
    iconBg: "bg-gradient-to-br from-indigo-400 to-violet-500",
    icon: "🔍",
    title: "Job Seeker Mode",
    subtitle: "Find and apply for jobs",
    bullet1: "Find opportunities",
    bullet2: "Earn money",
    activeDot: "bg-blue-500",
    switchGradient: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
    switchLabel: "Switch to Hiring Mode"
  },
  employer: {
    color: "from-green-500 to-teal-400",
    iconBg: "bg-gradient-to-br from-green-400 to-emerald-400",
    icon: "➕",
    title: "Hiring Mode",
    subtitle: "Post jobs and hire workers",
    bullet1: "Build your team",
    bullet2: "Grow business",
    activeDot: "bg-green-500",
    switchGradient: "bg-gradient-to-r from-indigo-400 to-violet-500 text-white",
    switchLabel: "Switch to Job Seeker"
  }
};

const ModernRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLocalization();
  if (!user) return null;
  const conf = modeConfig[user.role];
  const otherMode = user.role === "jobseeker" ? "employer" : "jobseeker";
  const switchLabel = modeConfig[otherMode].switchLabel;

  return (
    <div className="flex max-w-2xl w-full items-center bg-white rounded-2xl shadow border border-gray-100 px-4 py-4 gap-4 mb-4 mt-2 mx-auto">
      {/* Icon Circle */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${conf.iconBg} text-white text-3xl relative`}>
        <span>{conf.icon}</span>
        <span className="absolute top-0 right-0 w-3 h-3 block rounded-full border-2 border-white bg-yellow-400"></span>
      </div>
      {/* Mode Info */}
      <div className="flex-1 min-w-0">
        <div>
          <span className="text-lg font-bold text-gray-900">{conf.title}</span>
          <span className="ml-1 text-gray-500 font-normal">{conf.subtitle}</span>
        </div>
        <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
          <span className={`w-2 h-2 rounded-full ${conf.activeDot} mr-1`}></span>
          <span>Active Mode</span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{conf.bullet1}</span>
          <span className="mx-1 text-gray-300">|</span>
          <span>{conf.bullet2}</span>
        </div>
      </div>
      {/* Switch Button */}
      <Button
        className={`flex items-center justify-center px-5 h-11 rounded-xl shadow-none text-base font-semibold whitespace-nowrap ${modeConfig[otherMode].switchGradient}`}
        onClick={switchRole}
      >
        <ArrowRightLeft className="w-5 h-5 mr-2" /> {t("common.switchMode", switchLabel)}
      </Button>
    </div>
  );
};

export default ModernRoleSwitcher;
