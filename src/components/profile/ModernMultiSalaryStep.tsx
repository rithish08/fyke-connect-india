import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { BadgeCheck } from 'lucide-react';

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

type SalaryEntry = { amount: string; period: 'daily' | 'weekly' | 'monthly' };

const ModernMultiSalaryStep: React.FC<ModernMultiSalaryStepProps> = ({ form, onNext, onBack }) => {
  const subcategories: string[] = form.watch('subcategories') || [];
  const initialSalaryBySubcat = form.getValues('salaryBySubcategory') as Record<string, SalaryEntry> || {};

  // Track salary for each chosen subcategory
  const [salaryInputs, setSalaryInputs] = useState<Record<string, SalaryEntry>>(() => {
    // Make sure to provide values for current subcategories only
    const map: Record<string, SalaryEntry> = {};
    subcategories.forEach(sub => {
      if (initialSalaryBySubcat && initialSalaryBySubcat[sub]) {
        const entry = initialSalaryBySubcat[sub];
        map[sub] = {
          amount: typeof entry.amount === 'string' ? entry.amount : '',
          period: (entry.period === 'daily' || entry.period === 'weekly' || entry.period === 'monthly')
            ? entry.period
            : 'daily'
        };
      } else {
        map[sub] = { amount: '', period: 'daily' };
      }
    });
    return map;
  });

  // Keep wage state in sync if subcategories change (user removes/changes selection)
  useEffect(() => {
    setSalaryInputs(prev => {
      const updated: Record<string, SalaryEntry> = {};
      subcategories.forEach(sub => {
        updated[sub] = prev[sub] || { amount: '', period: 'daily' };
      });
      return updated;
    });
  }, [subcategories]);

  const handleInputChange = (sub: string, key: keyof SalaryEntry, value: string) => {
    setSalaryInputs(prev => ({
      ...prev,
      [sub]: {
        ...prev[sub],
        [key]: key === 'period'
          ? (['daily', 'weekly', 'monthly'].includes(value) ? value as 'daily' | 'weekly' | 'monthly' : 'daily')
          : value
      }
    }));
  };

  const isAmountValid = (amount: string) =>
    amount && !isNaN(Number(amount)) && Number(amount) > 0;

  const canProceed = subcategories.length > 0
    && subcategories.every(sub => isAmountValid(salaryInputs[sub]?.amount));

  // Save salaries/periods on continue, move to next step if valid
  const handleNext = async () => {
    // Only save salaries for selected subcategories
    const cleaned = subcategories.reduce((acc, sub) => {
      acc[sub] = salaryInputs[sub];
      return acc;
    }, {} as Record<string, SalaryEntry>);

    form.setValue('salaryBySubcategory', cleaned);
    const isValid = canProceed;
    if (!isValid) return false;
    await onNext();
    return true;
  };

  // Elegant wage design + summary
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
          <BadgeCheck className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Set Wage For Each Type</h2>
      </div>
      <p className="text-center text-gray-600 text-sm mb-2">
        Enter the expected wage for <span className="font-semibold">{subcategories.length}</span> specialization{subcategories.length > 1 && 's'} you selected. You can update these anytime!
      </p>
      <div className="flex flex-col gap-4">
        {subcategories.map(sub => (
          <div key={sub} className="bg-white rounded-2xl p-4 border border-blue-100 mb-2 shadow-sm">
            <div className="flex flex-col gap-2">
              <div className="font-medium text-indigo-900 text-[16px]">{sub}</div>
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold text-gray-600 text-lg">₹</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Amount"
                    className="pl-7 h-12 rounded-lg font-medium text-lg border border-gray-200 bg-blue-50 focus:bg-white"
                    value={salaryInputs[sub]?.amount || ""}
                    onChange={e => handleInputChange(sub, 'amount', e.target.value)}
                  />
                </div>
                <select
                  value={salaryInputs[sub]?.period || "daily"}
                  onChange={e => handleInputChange(sub, 'period', e.target.value)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-base bg-white font-medium text-gray-800 outline-none focus:border-blue-400 transition"
                >
                  {periods.map(period => (
                    <option key={period.value} value={period.value}>{period.label}</option>
                  ))}
                </select>
              </div>
              {!isAmountValid(salaryInputs[sub]?.amount) && (
                <FormMessage>Please enter a valid amount</FormMessage>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Summary Section */}
      <div className="bg-gradient-to-r from-green-100 to-blue-50 rounded-xl p-4 mt-1 text-[15px]">
        <div className="font-semibold text-green-900 mb-1">Wage Summary:</div>
        <ul className="grid gap-2">
          {subcategories.map(sub =>
            isAmountValid(salaryInputs[sub]?.amount) && (
              <li key={sub} className="text-green-900 flex items-center gap-2">
                <span className="font-semibold">{sub}:</span>
                <span>₹{Number(salaryInputs[sub].amount).toLocaleString()} / {salaryInputs[sub].period}</span>
              </li>
            )
          )}
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
          disabled={!canProceed}
          className="flex-1 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300"
        >
          Finish
        </Button>
      </div>
    </div>
  );
};

export default ModernMultiSalaryStep;
