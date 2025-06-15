
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { CheckCircle } from 'lucide-react';
import StickyFooterButton from '@/components/ui/StickyFooterButton';

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
    <div className="flex flex-col items-center pt-7 mb-36 min-h-[60vh]">
      <div className="w-full max-w-lg">
        <div className="bg-white/90 shadow-2xl border border-blue-100/50 ring-1 ring-blue-500/10 rounded-2xl px-5 py-6 mb-4">
          <div className="text-center mb-2">
            <h2 className="text-lg font-bold text-gray-900">Set Your Availability</h2>
            <p className="text-gray-600 text-[15px]">When are you looking for work?</p>
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
                        className={`w-full p-3 rounded-xl border-2 text-left flex items-center gap-3 transition-all duration-200
                          ${availability === option.value
                            ? `border-${option.color}-500 bg-${option.color}-50 shadow scale-[1.04]`
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                          }`}
                        onClick={() => field.onChange(option.value)}
                        disabled={isSubmitting}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                        {availability === option.value && (
                          <CheckCircle className={`w-5 h-5 text-${option.color}-500 ml-auto`} />
                        )}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Padding for sticky footer */}
        <div className="h-36 w-full" />
      </div>
      {/* Sticky Footer */}
      <StickyFooterButton
        disabled={isSubmitting}
        onClick={handleFinish}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Completing...</span>
          </div>
        ) : (
          "Complete Profile"
        )}
      </StickyFooterButton>
    </div>
  );
};

export default ModernAvailabilityStep;
