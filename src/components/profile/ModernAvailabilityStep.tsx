
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FloatingCard } from '@/components/ui/floating-card';
import { Clock, CheckCircle } from 'lucide-react';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';

interface ModernAvailabilityStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onBack: () => void;
  onFinish: (data: ProfileSetupFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

const ModernAvailabilityStep = ({ form, onBack, onFinish, isSubmitting }: ModernAvailabilityStepProps) => {
  const availability = form.watch('availability');

  const handleFinish = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      await onFinish(data);
    }
  };

  const availabilityOptions = [
    { value: 'available', label: 'Available', icon: '🟢', description: 'Ready to work' },
    { value: 'busy', label: 'Busy', icon: '🟡', description: 'Limited availability' },
    { value: 'offline', label: 'Offline', icon: '🔴', description: 'Not available' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <FloatingCard variant="glow" size="md">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Set Your Availability</h2>
          <p className="text-gray-600">Let employers know when you're ready to work</p>
        </div>
      </FloatingCard>

      {/* Availability Options */}
      <FloatingCard variant="elevated" size="md">
        <div className="space-y-3">
          {availabilityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => form.setValue('availability', option.value)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                availability === option.value
                  ? 'border-green-500 bg-green-50 scale-[1.02]'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:bg-green-25'
              }`}
            >
              <div className="flex items-center space-x-4">
                <span className="text-2xl">{option.icon}</span>
                <div className="flex-1">
                  <h3 className={`font-semibold ${availability === option.value ? 'text-green-900' : 'text-gray-900'}`}>
                    {option.label}
                  </h3>
                  <p className={`text-sm ${availability === option.value ? 'text-green-700' : 'text-gray-600'}`}>
                    {option.description}
                  </p>
                </div>
                {availability === option.value && (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </FloatingCard>

      {/* Action Buttons */}
      <FloatingCard variant="minimal" size="md">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 h-12 rounded-xl"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={handleFinish}
            disabled={isSubmitting}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Completing...</span>
              </div>
            ) : (
              'Complete Profile'
            )}
          </Button>
        </div>
      </FloatingCard>
    </div>
  );
};

export default ModernAvailabilityStep;
