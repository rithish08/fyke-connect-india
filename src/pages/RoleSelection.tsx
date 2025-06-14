import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { User2, Users2 } from "lucide-react";
import { useLocalization } from "@/contexts/LocalizationContext";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
  const [hoveredRole, setHoveredRole] = useState<'jobseeker' | 'employer' | null>(null);
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
      icon: <User2 className="w-7 h-7 text-indigo-500"/>,
      color: "from-indigo-100 to-indigo-300",
      title: t("role.jobseeker", "Job Seeker"),
      subtitle: t("role.jobseeker_desc", "Find work opportunities and build your career"),
      bullet1: t("role.jobseeker_feature1", "Find Jobs Nearby"),
      bullet2: t("role.jobseeker_feature2", "Apply Instantly"),
      gradient: "from-indigo-400 to-violet-500",
      stat: t("role.jobseeker_stat", "50,000+ jobs posted daily"),
      story: t("role.jobseeker_story", "Raj found 5 jobs this week and earned ₹12,000"),
    },
    {
      type: 'employer' as const,
      icon: <Users2 className="w-7 h-7 text-green-600"/>,
      color: "from-green-100 to-teal-200",
      title: t("role.employer", "Employer"),
      subtitle: t("role.employer_desc", "Hire skilled workers and manage projects"),
      bullet1: t("role.employer_feature1", "Find Verified Workers"),
      bullet2: t("role.employer_feature2", "Hire in Minutes"),
      gradient: "from-green-400 to-emerald-500",
      stat: t("role.employer_stat", "2 lakh+ verified workers"),
      story: t("role.employer_story", "Priya hired 3 workers in 2 hours for her restaurant"),
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md mx-auto space-y-8">
        {/* Brand header */}
        <div className="flex flex-col items-center gap-4 mb-2">
          <span className="flex rounded-full bg-gray-900 text-white w-14 h-14 justify-center items-center text-2xl font-bold shadow border-2 border-gray-100">fyke</span>
          <h2 className="text-3xl font-bold text-gray-900">{t('role.title', 'Choose Your Path')}</h2>
          <p className="text-base text-gray-400">{t('role.subtitle', 'Select how you want to use Fyke')}</p>
        </div>
        {/* Modern role cards */}
        <div className="flex flex-col gap-6">
        {roles.map((role) => (
          <button
            key={role.type}
            type="button"
            onClick={() => setSelectedRole(role.type)}
            className={`w-full flex rounded-2xl p-6 border-2 shadow group transition-all duration-200 bg-white ${
              selectedRole === role.type
                ? "border-gray-900 scale-105 shadow-lg"
                : "border-gray-100 hover:border-gray-400"
            }`}
          >
            <div className={`flex-none w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${role.gradient} text-white text-2xl mr-4`}>{role.icon}</div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-lg font-bold text-gray-900">{role.title}</span>
                <span className="ml-1 text-xs text-gray-500">{role.subtitle}</span>
              </div>
              <div className="flex items-center gap-4 mt-1 mb-1 text-xs text-gray-500">
                <span>• {role.bullet1}</span>
                <span className="text-gray-200">|</span>
                <span>• {role.bullet2}</span>
              </div>
              <div className="text-xs text-gray-400 font-medium">📊 {role.stat}</div>
              <div className="bg-gray-50 mt-2 p-2 rounded-lg text-xs text-gray-700">{role.story}</div>
            </div>
            {/* Selected marker */}
            {selectedRole === role.type && (<div className="ml-4 flex items-center"><span className="w-3 h-3 rounded-full bg-green-500"></span></div>)}
          </button>
        ))}
        </div>
        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full font-medium py-4 rounded-2xl shadow mt-2 text-lg ${
            selectedRole
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedRole
            ? t('common.continue', 'Continue') + " as " + (selectedRole === 'jobseeker'
                ? t('role.jobseeker', 'Job Seeker')
                : t('role.employer', 'Employer'))
            : t('common.select_role', 'Select your role to continue')}
        </Button>
        <div className="text-center text-xs text-gray-400 mt-1">{t('role.switch_hint', 'You can switch roles anytime later in the app')}</div>
      </div>
    </div>
  );
};

export default RoleSelection;
