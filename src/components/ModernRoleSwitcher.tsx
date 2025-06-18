
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, User, Users } from "lucide-react";

const roleConfig = {
  jobseeker: {
    gradient: "from-indigo-50 to-slate-50",
    iconBg: "bg-indigo-100",
    icon: <User className="w-7 h-7 text-indigo-600" />,
    title: "Job Seeker",
    subtitle: "Browse & apply to quick jobs.",
    accent: "bg-indigo-500",
    shadow: "shadow-indigo-100/70"
  },
  employer: {
    gradient: "from-green-50 to-slate-50",
    iconBg: "bg-green-100",
    icon: <Users className="w-7 h-7 text-green-600" />,
    title: "Employer",
    subtitle: "Post jobs & hire quickly.",
    accent: "bg-green-500",
    shadow: "shadow-green-100/70"
  }
};

const ModernRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLocalization();
  if (!user) return null;

  const conf = roleConfig[user.role];
  const otherRole = user.role === "jobseeker" ? "employer" : "jobseeker";
  const otherConf = roleConfig[otherRole];
  const switchLabel =
    user.role === "jobseeker"
      ? t("common.switchMode", "Switch to Employer")
      : t("common.switchMode", "Switch to Job Seeker");

  return (
    <section
      className="max-w-2xl mx-auto w-full px-2 md:px-4"
      aria-label="Current role and switch"
    >
      <div
        className={`flex flex-col md:flex-row items-stretch bg-gradient-to-br ${conf.gradient} border border-gray-100 ${conf.shadow} rounded-2xl overflow-hidden mb-3 mt-2 transition-all`}
      >
        {/* Current role icon */}
        <div className={`flex items-center justify-center min-w-[64px] md:min-w-[80px] h-16 md:h-auto ${conf.iconBg}`}>
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80">{conf.icon}</span>
        </div>
        {/* Current role text */}
        <div className="flex-1 flex flex-col justify-center px-5 py-4">
          <h2 className="text-base font-semibold text-gray-900">
            {conf.title}
            <span className={`align-middle ml-2 inline-block w-2.5 h-2.5 rounded-full ${conf.accent} animate-pulse`} aria-label="active" />
          </h2>
          <span className="text-sm text-gray-500">{conf.subtitle}</span>
        </div>
        {/* Switcher button */}
        <div className="flex min-w-[170px] md:min-w-[200px] items-center justify-center bg-white px-4 py-4 md:py-0 border-l border-gray-100">
          <Button
            onClick={switchRole}
            className={`w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gray-900 text-white text-base font-semibold shadow-none hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-primary transition-all`}
            aria-label={switchLabel}
          >
            <ArrowRightLeft className="w-5 h-5" />
            {switchLabel}
          </Button>
        </div>
      </div>
      {/* Small hint for users, especially on mobile */}
      <div className="text-xs text-gray-400 text-center px-2 pb-1">
        {user.role === "jobseeker"
          ? "Switch to Employer to hire workers instantly."
          : "Switch to Job Seeker to browse and apply for jobs."}
      </div>
    </section>
  );
};

export default ModernRoleSwitcher;
