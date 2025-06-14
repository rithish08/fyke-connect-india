
import React from "react";
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import ShimmerLoader from './ui/ShimmerLoader';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

const steps = [{
  id: 'name',
  title: "Add Your Name",
  benefit: "60% more trusted",
  icon: "👤"
}, {
  id: 'photo',
  title: "Upload Photo",
  benefit: "70% more likely hired",
  icon: "📸"
}, {
  id: 'skills',
  title: "List Skills",
  benefit: "3x jobs",
  icon: "🛠️"
}, {
  id: 'location',
  title: "Set Location",
  benefit: "See jobs nearby",
  icon: "📍"
}];

const ProfileProgress = () => {
  const { user } = useAuth();
  const { goTo } = useScreenNavigation();

  if (!user) return <ShimmerLoader height={96} className="my-6 mx-auto max-w-xl" />;

  const completion = steps.reduce((acc, step) => user[step.id] ? acc + 1 : acc, 0);
  const pct = Math.round(completion / steps.length * 100);
  
  // Show progress card even when not 100% complete
  if (pct === 100) {
    return (
      <ModernCard className="mx-4 my-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div>
              <h3 className="font-semibold text-green-800">Profile Complete!</h3>
              <p className="text-sm text-green-600">You're ready to find great opportunities</p>
            </div>
          </div>
        </div>
      </ModernCard>
    );
  }

  const nextStep = steps.find(step => !user[step.id]);

  return (
    <ModernCard className="mx-4 my-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="absolute top-0 left-0" width="48" height="48">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#E5E7EB"
                strokeWidth="4"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#3B82F6"
                strokeWidth="4"
                fill="none"
                strokeDasharray={2 * Math.PI * 20}
                strokeDashoffset={2 * Math.PI * 20 * (1 - pct / 100)}
                style={{ transition: 'stroke-dashoffset 0.5s' }}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-sm font-bold text-blue-600">{pct}%</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
            <p className="text-sm text-gray-600">
              {nextStep ? `Next: ${nextStep.title}` : 'Almost done!'}
            </p>
          </div>
        </div>
        <Button 
          size="sm" 
          onClick={() => goTo('/profile')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="mt-3 grid grid-cols-4 gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
              user[step.id] ? 'bg-blue-500' : 'bg-gray-200'
            }`}>
              {user[step.id] ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1 text-center">{step.title}</span>
          </div>
        ))}
      </div>
    </ModernCard>
  );
};

export default ProfileProgress;
