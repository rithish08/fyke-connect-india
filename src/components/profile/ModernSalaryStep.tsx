
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';

interface ModernSalaryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
  onBack: () => void;
}

const periods = [
  { value: 'daily', label: 'Daily', description: 'Per day wage' },
  { value: 'weekly', label: 'Weekly', description: 'Per week salary' },
  { value: 'monthly', label: 'Monthly', description: 'Per month salary' },
] as const;

const ModernSalaryStep: React.FC<ModernSalaryStepProps> = ({ form, onNext, onBack }) => {
  const salaryAmount = form.watch('salary.amount');
  const salaryPeriod = form.watch('salary.period');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Set Your Salary Expectation</h2>
        <p className="text-gray-600 text-sm">This helps employers find you for the right opportunities</p>
      </div>

      {/* Salary Amount */}
      <FormField
        control={form.control}
        name="salary.amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Expected Amount</FormLabel>
            <FormControl>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-bold text-gray-700">
                  ₹
                </span>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter amount"
                  className="pl-8 h-14 text-lg border-2 rounded-xl"
                  min="0"
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Salary Period */}
      <FormField
        control={form.control}
        name="salary.period"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-medium">Payment Period</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 gap-3 mt-3"
              >
                {periods.map(period => (
                  <div key={period.value} className="flex items-center space-x-3">
                    <RadioGroupItem 
                      value={period.value} 
                      id={period.value}
                      className="border-2"
                    />
                    <label 
                      htmlFor={period.value}
                      className="flex-1 cursor-pointer p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{period.label}</div>
                      <div className="text-sm text-gray-500">{period.description}</div>
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Preview */}
      {salaryAmount && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="text-sm text-green-800 font-medium">Your expectation:</div>
          <div className="text-lg font-bold text-green-900">
            ₹{Number(salaryAmount).toLocaleString()} per {salaryPeriod}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12 rounded-xl border-2"
        >
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!salaryAmount}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ModernSalaryStep;
