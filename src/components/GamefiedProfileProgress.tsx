
import React from "react";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, Circle } from 'lucide-react';

const steps = [
  {
    id: 'name',
    title: "Add Your Name",
    benefit: "60% more trusted",
    icon: "👤",
    field: 'name'
  },
  {
    id: 'phone',
    title: "Verify Phone",
    benefit: "Build trust",
    icon: "📱",
    field: 'phone'
  },
  {
    id: 'location',
    title: "Set Location",
    benefit: "See jobs nearby",
    icon: "📍",
    field: 'location'
  },
  {
    id: 'bio',
    title: "Add Bio",
    benefit: "70% more likely hired",
    icon: "📝",
    field: 'bio'
  }
];

const GamefiedProfileProgress = () => {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  const completion = steps.reduce((acc, step) => {
    const fieldValue = userProfile[step.field as keyof typeof userProfile];
    return fieldValue ? acc + 1 : acc;
  }, 0);

  const percentage = Math.round((completion / steps.length) * 100);

  if (percentage === 100) return null;

  return (
    <Card className="p-6 mb-6 bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Complete Your Profile</h3>
          <span className="text-sm font-medium text-blue-600">{percentage}% Complete</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {steps.map((step) => {
            const fieldValue = userProfile[step.field as keyof typeof userProfile];
            const isComplete = !!fieldValue;
            
            return (
              <div key={step.id} className={`p-3 rounded-lg border-2 transition-all ${
                isComplete 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-blue-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="text-lg">{step.icon}</span>
                </div>
                <h4 className={`font-semibold text-sm mt-1 ${
                  isComplete ? 'text-green-700' : 'text-gray-700'
                }`}>
                  {step.title}
                </h4>
                <p className="text-xs text-gray-500">{step.benefit}</p>
              </div>
            );
          })}
        </div>

        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
          onClick={() => window.location.href = '/profile'}
        >
          Complete Profile
        </Button>
      </div>
    </Card>
  );
};

export default GamefiedProfileProgress;
