
import React from "react";
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ShimmerLoader from './ui/ShimmerLoader';

const steps = [
  { id: 'name', title: "Add Your Name", benefit: "60% more trusted", icon: "👤" },
  { id: 'photo', title: "Upload Photo", benefit: "70% more likely hired", icon: "📸" },
  { id: 'skills', title: "List Skills", benefit: "3x jobs", icon: "🛠️" },
  { id: 'location', title: "Set Location", benefit: "See jobs nearby", icon: "📍" }
];

const ProfileProgress = () => {
  const { user } = useAuth();

  if (!user) return <ShimmerLoader height={96} className="my-6 mx-auto max-w-xl" />;

  const completion = steps.reduce((acc, step) =>
    user[step.id] ? acc + 1 : acc, 0
  );
  const pct = Math.round((completion / steps.length) * 100);
  if (pct === 100) return null;

  return (
    <ModernCard className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 px-3 py-2 sm:p-5 shadow flex flex-col gap-2 mt-3">
      <div className="flex items-center space-x-3 mb-2">
        <span className="w-11 h-11 rounded-xl flex items-center justify-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-extrabold">{steps[completion]?.icon ?? "🚀"}</span>
        <div>
          <div className="text-xs sm:text-sm font-bold text-gray-900">Complete your profile</div>
          <div className="text-xs text-gray-600">{completion} of {steps.length} steps done</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      {steps
        .filter(step => !user[step.id])
        .slice(0, 2)
        .map(step => (
          <div key={step.id} className="flex items-center gap-2 mt-2">
            <span className="text-lg">{step.icon}</span>
            <span className="font-medium text-xs text-gray-700">{step.title}</span>
            <span className="ml-auto text-xs text-green-600">{step.benefit}</span>
            <Button size="sm" variant="outline" className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50 rounded-xl px-2 py-1">
              Complete
            </Button>
          </div>
        ))}
    </ModernCard>
  );
};

export default ProfileProgress;
