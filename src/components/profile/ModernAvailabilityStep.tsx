
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { CheckCircle, Calendar } from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';
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
    icon: '✅',
    bgClass: 'from-green-50 to-emerald-50',
    borderClass: 'border-green-300',
    textClass: 'text-green-900'
  },
  {
    value: 'busy',
    label: 'Currently Busy',
    description: 'Working but open to opportunities',
    color: 'yellow',
    icon: '⚠️',
    bgClass: 'from-yellow-50 to-orange-50',
    borderClass: 'border-yellow-300',
    textClass: 'text-yellow-900'
  },
  {
    value: 'offline',
    label: 'Not Available',
    description: 'Not looking for work right now',
    color: 'red',
    icon: '❌',
    bgClass: 'from-red-50 to-pink-50',
    borderClass: 'border-red-300',
    textClass: 'text-red-900'
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
    <div className="pb-24">
      <div className="space-y-6">
        {/* Header */}
        <FloatingCard variant="glow" size="sm" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Set Availability</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Let employers know when you're ready to work
          </p>
        </FloatingCard>

        {/* Availability Options */}
        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Availability Status</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  {availabilityOptions.map(option => (
                    <FloatingCard
                      key={option.value}
                      variant="elevated"
                      size="sm"
                      className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        availability === option.value
                          ? `bg-gradient-to-r ${option.bgClass} border-2 ${option.borderClass} shadow-lg scale-[1.02]`
                          : "bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md"
                      }`}
                      onClick={() => field.onChange(option.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl">{option.icon}</div>
                          <div>
                            <div className={`font-semibold text-lg ${availability === option.value ? option.textClass : 'text-gray-900'}`}>
                              {option.label}
                            </div>
                            <div className={`text-sm ${availability === option.value ? option.textClass : 'text-gray-600'}`}>
                              {option.description}
                            </div>
                          </div>
                        </div>
                        {availability === option.value && (
                          <CheckCircle className={`w-7 h-7 text-${option.color}-500`} />
                        )}
                      </div>
                    </FloatingCard>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Success Preview */}
        <FloatingCard variant="minimal" size="sm" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-6 h-6 text-blue-500" />
            <div>
              <div className="font-semibold text-blue-900">Almost Done!</div>
              <div className="text-sm text-blue-700">
                Complete your profile to start receiving opportunities
              </div>
            </div>
          </div>
        </FloatingCard>
      </div>

      {/* Sticky Footer Button */}
      <StickyFooterButton
        onClick={handleFinish}
        disabled={!availability || isSubmitting}
        isLoading={isSubmitting}
        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
      >
        {isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
      </StickyFooterButton>
    </div>
  );
};

export default ModernAvailabilityStep;
