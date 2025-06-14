
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User2, Users2, ArrowRight } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
  const { setRole } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      navigate('/login');
    }
  };

  const roles = [
    {
      type: 'jobseeker' as const,
      icon: <User2 className="w-8 h-8 text-white"/>,
      gradient: "from-blue-500 to-indigo-600",
      title: t("role.jobseeker", "Find Work"),
      subtitle: t("role.jobseeker_desc", "Browse jobs and earn money"),
      features: ["Quick applications", "Daily payments", "Verified employers"],
      bgGradient: "from-blue-50 to-indigo-50",
      iconBg: "bg-blue-500"
    },
    {
      type: 'employer' as const,
      icon: <Users2 className="w-8 h-8 text-white"/>,
      gradient: "from-green-500 to-emerald-600",
      title: t("role.employer", "Hire Workers"),
      subtitle: t("role.employer_desc", "Find skilled people instantly"),
      features: ["Verified workers", "Quick hiring", "Secure payments"],
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-xl">
            <span className="text-3xl font-bold text-white">f</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('role.title', 'Choose Your Role')}</h1>
            <p className="text-gray-500">{t('role.subtitle', 'How do you want to use Fyke?')}</p>
          </div>
        </div>

        {/* Role Cards */}
        <div className="space-y-4">
          {roles.map((role) => (
            <Card
              key={role.type}
              className={`relative overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                selectedRole === role.type
                  ? "border-gray-900 shadow-xl scale-105"
                  : "border-gray-100 hover:border-gray-300 shadow-lg"
              }`}
              onClick={() => setSelectedRole(role.type)}
            >
              <div className={`bg-gradient-to-r ${role.bgGradient} p-6`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-2xl ${role.iconBg} flex items-center justify-center shadow-lg`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{role.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{role.subtitle}</p>
                    <div className="space-y-1">
                      {role.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-xs text-gray-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedRole === role.type && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900">
                      <ArrowRight className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full h-14 font-semibold text-lg rounded-2xl shadow-lg transition-all ${
            selectedRole
              ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedRole ? `Continue as ${selectedRole === 'jobseeker' ? 'Job Seeker' : 'Employer'}` : 'Select your role'}
        </Button>

        <p className="text-center text-xs text-gray-400">
          {t('role.switch_hint', 'You can switch roles anytime in the app')}
        </p>
      </div>
    </div>
  );
};

export default RoleSelection;
