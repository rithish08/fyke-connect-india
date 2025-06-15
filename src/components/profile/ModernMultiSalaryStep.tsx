
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';

interface ModernMultiSalaryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
  onBack: () => void;
}
const periods = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
] as const;

const ModernMultiSalaryStep: React.FC<ModernMultiSalaryStepProps> = ({ form, onNext, onBack }) => {
  const subcategories: string[] = form.watch('subcategories') || [];
  const [salaryInputs, setSalaryInputs] = useState<{ [sub: string]: { amount: string; period: string } }>(() => {
    if (form.getValues('salaryBySubcategory')) return form.getValues('salaryBySubcategory');
    return Object.fromEntries(subcategories.map(s => [s, { amount: '', period: 'daily' }]));
  });

  const handleInputChange = (sub: string, key: 'amount' | 'period', value: string) => {
    setSalaryInputs(prev => ({
      ...prev,
      [sub]: { ...prev[sub], [key]: value }
    }));
  };

  // Save salaries/periods on continue
  const handleNext = async () => {
    form.setValue('salaryBySubcategory', salaryInputs);
    // Simple validation: amount required and > 0
    const isValid = subcategories.length > 0 && subcategories.every(sub => {
      const salary = salaryInputs[sub]?.amount;
      return salary && !isNaN(Number(salary)) && Number(salary) > 0;
    });
    if (!isValid) return false;
    await onNext();
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Set Your Wage Expectation</h2>
        <p className="text-gray-600 text-sm">Enter the expected wage for each work type you selected.</p>
      </div>
      <div className="flex flex-col gap-4">
        {subcategories.map(sub => (
          <div key={sub} className="bg-blue-50 rounded-xl p-4 border border-blue-100 mb-3">
            <div className="flex flex-col gap-2">
              <div className="font-medium text-blue-900">{sub}</div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold text-gray-600">₹</span>
                  <Input
                    type="number"
                    placeholder="Amount"
                    min={0}
                    className="pl-7"
                    value={salaryInputs[sub]?.amount || ""}
                    onChange={e => handleInputChange(sub, 'amount', e.target.value)}
                  />
                </div>
                <select
                  value={salaryInputs[sub]?.period || "daily"}
                  onChange={e => handleInputChange(sub, 'period', e.target.value)}
                  className="rounded-xl border border-gray-200 px-2 py-2 text-gray-700"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>{period.label}</option>
                  ))}
                </select>
              </div>
              {(!salaryInputs[sub]?.amount || isNaN(Number(salaryInputs[sub]?.amount)) || Number(salaryInputs[sub]?.amount) <= 0) && (
                <FormMessage>Please enter a valid amount</FormMessage>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Preview */}
      <div className="bg-green-50 rounded-xl p-4 mt-2">
        <div className="text-xs text-green-900">Summary:</div>
        <ul className="mt-1 space-y-1">
          {subcategories.map(sub => salaryInputs[sub]?.amount && (
            <li key={sub} className="text-green-800 flex items-center gap-2">
              <span className="font-semibold">{sub}:</span>
              <span>₹{Number(salaryInputs[sub].amount).toLocaleString()} / {salaryInputs[sub].period}</span>
            </li>
          ))}
        </ul>
      </div>
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
          onClick={handleNext}
          disabled={
            !(subcategories.length > 0 && subcategories.every(sub =>
              salaryInputs[sub]?.amount && !isNaN(Number(salaryInputs[sub]?.amount)) && Number(salaryInputs[sub].amount) > 0
            ))
          }
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300"
        >
          Finish
        </Button>
      </div>
    </div>
  );
};
export default ModernMultiSalaryStep;
