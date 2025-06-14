
import { useAuth } from "@/contexts/AuthContext";
import { useLocalization } from "@/contexts/LocalizationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, User, Users, Briefcase, Search, TrendingUp } from "lucide-react";

const roleConfig = {
  jobseeker: {
    gradient: "from-indigo-50 to-slate-50",
    iconBg: "bg-indigo-100",
    icon: <User className="w-7 h-7 text-indigo-600" />,
    title: "Job Seeker",
    subtitle: "Browse & apply to quick jobs",
    accent: "bg-indigo-500",
    shadow: "shadow-indigo-100/70",
    stats: "12 applications • 4.8★ rating",
    actionIcon: <Search className="w-4 h-4" />
  },
  employer: {
    gradient: "from-green-50 to-slate-50",
    iconBg: "bg-green-100",
    icon: <Users className="w-7 h-7 text-green-600" />,
    title: "Employer",
    subtitle: "Post jobs & hire quickly",
    accent: "bg-green-500",
    shadow: "shadow-green-100/70",
    stats: "3 active posts • 95% response rate",
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
    <section className="max-w-2xl mx-auto w-full px-2 md:px-4" aria-label="Current role and switch">
      <div className={`relative flex flex-col md:flex-row items-stretch bg-gradient-to-br ${conf.gradient} border border-gray-100 ${conf.shadow} rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg`}>
        
        {/* Role Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className={`${conf.accent} text-white text-xs font-medium px-2 py-1`}>
            Active
          </Badge>
        </div>

        {/* Current role icon section */}
        <div className={`flex items-center justify-center min-w-[80px] md:min-w-[100px] h-20 md:h-24 ${conf.iconBg} relative`}>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/90 shadow-md">
            {conf.icon}
          </div>
          <div className={`absolute bottom-2 right-2 w-3 h-3 rounded-full ${conf.accent} animate-pulse`} />
        </div>
        
        {/* Current role information */}
        <div className="flex-1 flex flex-col justify-center px-6 py-4 min-h-[80px]">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-gray-900">{conf.title}</h2>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mb-2">{conf.subtitle}</p>
          <div className="text-xs text-gray-500 font-medium">{conf.stats}</div>
        </div>
        
        {/* Enhanced switcher section */}
        <div className="flex min-w-[200px] md:min-w-[220px] items-center justify-center bg-white/80 backdrop-blur-sm px-4 py-4 md:py-0 border-l border-gray-100">
          <div className="w-full space-y-2">
            <Button
              onClick={switchRole}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-gray-900 text-white text-sm font-semibold shadow-lg hover:bg-gray-800 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-gray-900 transition-all duration-200 group"
              aria-label={switchLabel}
            >
              <ArrowRightLeft className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
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
      
      {/* Enhanced hint with better engagement */}
      <div className="text-center mt-3 px-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          {user.role === "jobseeker" 
            ? "💼 Switch to Employer to hire workers instantly and manage your team"
            : "🔍 Switch to Job Seeker to browse opportunities and build your career"
          }
        </p>
      </div>
    </section>
  );
};

export default ModernRoleSwitcher;
