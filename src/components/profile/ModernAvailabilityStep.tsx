
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { CheckCircle } from 'lucide-react';

interface ModernAvailabilityStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onBack: () => void;
  onFinish: (data: ProfileSetupFormData) => Promise<boolean>;
  isSubmitting: boolean;
}

const availabilityOptions = [
  {
    value: 'available',
    label: 'Available Now',
    description: 'Ready to start work immediately',
    color: 'green',
    icon: '✅'
  },
  {
    value: 'busy',
    label: 'Currently Busy',
    description: 'Working but open to new opportunities',
    color: 'yellow',
    icon: '⚠️'
  },
  {
    value: 'offline',
    label: 'Not Available',
    description: 'Not looking for work right now',
    color: 'red',
    icon: '❌'
  }
] as const;

const ModernAvailabilityStep: React.FC<ModernAvailabilityStepProps> = ({ 
  form, 
  onBack, 
  onFinish, 
  isSubmitting 
}) => {
  const availability = form.watch('availability');

  const handleFinish = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const data = form.getValues();
      await onFinish(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Set Your Availability</h2>
        <p className="text-gray-600 text-sm">Let employers know when you're ready to work</p>
      </div>

      <FormField
        control={form.control}
        name="availability"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Availability Status</FormLabel>
            <FormControl>
              <div className="space-y-3">
                {availabilityOptions.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                      availability === option.value
                        ? `border-${option.color}-500 bg-${option.color}-50 shadow-lg scale-105`
                        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                    }`}
                    onClick={() => field.onChange(option.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                      </div>
                      {availability === option.value && (
                        <CheckCircle className={`w-6 h-6 text-${option.color}-500`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Success Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-6 h-6 text-blue-500" />
          <div>
            <div className="font-semibold text-blue-900">Almost Done!</div>
            <div className="text-sm text-blue-700">
              Complete your profile to start receiving job opportunities
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 h-12 rounded-xl border-2"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={handleFinish}
          disabled={isSubmitting}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-300 disabled:to-gray-300"
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
    </div>
  );
};

export default ModernAvailabilityStep;
