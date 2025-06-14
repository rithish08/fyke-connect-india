
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";

const roleConfig = {
  jobseeker: {
    color: "from-indigo-500 to-violet-500",
    iconBg: "bg-gradient-to-br from-indigo-400 to-violet-500",
    icon: "🔍",
    title: "Job Seeker",
    subtitle: "Browse, apply, and earn quickly.",
    activeDot: "bg-indigo-500",
    description: "You're exploring jobs and applying for work opportunities."
  },
  employer: {
    color: "from-green-500 to-emerald-500",
    iconBg: "bg-gradient-to-br from-green-400 to-emerald-500",
    icon: "🏢",
    title: "Employer",
    subtitle: "Find and hire workers with ease.",
    activeDot: "bg-green-500",
    description: "You're posting jobs to quickly hire the right people."
  }
};

const ModernRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLocalization();
  if (!user) return null;
  const conf = roleConfig[user.role];
  const other = user.role === "jobseeker" ? "employer" : "jobseeker";
  const switchLabel = user.role === "jobseeker"
    ? t("common.switchMode", "Switch to Employer")
    : t("common.switchMode", "Switch to Job Seeker");

  return (
    <section
      className="w-full max-w-2xl mx-auto px-2"
      aria-label="Current role and switch"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-stretch bg-white border border-gray-100 shadow-lg rounded-2xl overflow-hidden mb-4 mt-2 transition-all">
        {/* Icon + dot */}
        <div className={`flex items-center gap-3 p-4 sm:p-6 ${conf.iconBg} bg-opacity-60`}>
          <span className="text-4xl" aria-hidden="true">{conf.icon}</span>
          <span className={`w-3 h-3 rounded-full border-2 border-white ${conf.activeDot} shadow-sm`} />
        </div>
        {/* Textual info */}
        <div className="flex-1 px-4 py-3 sm:p-6 flex flex-col justify-center min-w-0">
          <h2 className="text-base font-semibold text-gray-900">{conf.title}</h2>
          <span className="text-sm text-gray-600">{conf.subtitle}</span>
          <span className="hidden sm:block text-xs text-gray-400 mt-2">{conf.description}</span>
        </div>
        {/* Switcher */}
        <div className="w-full sm:w-auto px-4 pb-4 sm:p-6 flex items-end sm:items-center">
          <Button
            onClick={switchRole}
            className="w-full sm:w-auto flex items-center justify-center gap-2 h-11 min-w-[128px] rounded-xl border border-gray-200 bg-gray-900 text-white text-base font-medium transition-colors shadow hover:bg-gray-800 focus-visible:outline focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <ArrowRightLeft className="w-5 h-5" />
            <span>{switchLabel}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ModernRoleSwitcher;
