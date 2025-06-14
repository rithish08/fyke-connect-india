
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, User, Users, Briefcase, Search } from "lucide-react";

const roleConfig = {
  jobseeker: {
    gradient: "from-blue-50 to-slate-50",
    iconBg: "bg-blue-100",
    icon: <User className="w-6 h-6 text-blue-600" />,
    title: "Job Seeker",
    subtitle: "Browse & apply to jobs",
    accent: "bg-blue-500",
    actionIcon: <Search className="w-4 h-4" />
  },
  employer: {
    gradient: "from-green-50 to-slate-50",
    iconBg: "bg-green-100",
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: "Employer",
    subtitle: "Post jobs & hire workers",
    accent: "bg-green-500",
    actionIcon: <Briefcase className="w-4 h-4" />
  }
};

const ModernRoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLocalization();
  
  if (!user) return null;

  const conf = roleConfig[user.role];
  const otherRole = user.role === "jobseeker" ? "employer" : "jobseeker";
  const otherConf = roleConfig[otherRole];
  const switchLabel = user.role === "jobseeker" 
    ? "Switch to Employer" 
    : "Switch to Job Seeker";

  return (
    <section className="max-w-2xl mx-auto w-full px-2 md:px-4">
      <div className={`relative flex flex-col md:flex-row items-stretch bg-gradient-to-br ${conf.gradient} border border-gray-100 rounded-2xl overflow-hidden`}>
        
        {/* Current role icon section */}
        <div className={`flex items-center justify-center min-w-[80px] md:min-w-[100px] h-20 md:h-24 ${conf.iconBg}`}>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md">
            {conf.icon}
          </div>
        </div>
        
        {/* Current role information */}
        <div className="flex-1 flex flex-col justify-center px-6 py-4 min-h-[80px]">
          <h2 className="text-lg font-bold text-gray-900 mb-1">{conf.title}</h2>
          <p className="text-sm text-gray-600">{conf.subtitle}</p>
        </div>
        
        {/* Switcher section */}
        <div className="flex min-w-[200px] md:min-w-[220px] items-center justify-center bg-white/80 px-4 py-4 md:py-0 border-l border-gray-100">
          <div className="w-full space-y-2">
            <Button
              onClick={switchRole}
              className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-all duration-200"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {switchLabel}
            </Button>
            
            {/* Preview of other role */}
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Switch to {otherConf.title.toLowerCase()} mode
              </p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mt-1">
                {otherConf.actionIcon}
                <span>{otherConf.subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModernRoleSwitcher;
