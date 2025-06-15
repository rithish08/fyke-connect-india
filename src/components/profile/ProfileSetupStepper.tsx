
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface StepperProps {
  currentStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

const ProfileSetupStepper: React.FC<StepperProps> = ({ currentStep, steps }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600">
          Step {currentStep + 1} of {steps.length}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      {/* Current Step Info */}
      <div className="text-center">
        <h3 className="font-semibold text-gray-900 text-lg">
          {steps[currentStep]?.title}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {steps[currentStep]?.description}
        </p>
      </div>
      
      {/* Step Indicators */}
      <div className="flex justify-center space-x-2 mt-6">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentStep 
                ? 'bg-green-500 scale-110' 
                : index === currentStep 
                ? 'bg-blue-500 scale-125' 
                : 'bg-gray-300'
            }`}
          >
            {index < currentStep && (
              <CheckCircle className="w-3 h-3 text-white" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileSetupStepper;
