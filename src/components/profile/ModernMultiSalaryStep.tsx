import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { BadgeCheck } from 'lucide-react';
import StickyFooterButton from '@/components/ui/StickyFooterButton';

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
    if (!canProceed) return false;
    await onNext();
    return true;
  };

  // Compact wage card design
  return (
    <div className="flex flex-col items-center pt-6 mb-36 min-h-[70vh]">
      <div className="w-full max-w-lg">
        <div className="bg-white/90 shadow-2xl border border-blue-100/50 ring-1 ring-blue-500/10 rounded-2xl px-5 py-6 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
              <BadgeCheck className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-[19px] font-bold text-gray-900">Set Wage</h2>
          </div>
          <p className="text-gray-600 text-sm mb-1 text-center">Wages for <span className="font-semibold">{subcategories.length}</span> specialization{subcategories.length > 1 && 's'} selected</p>
        </div>
        <div className="flex flex-col gap-3">
          {subcategories.map(sub => (
            <div key={sub} className="bg-blue-50 rounded-xl px-4 py-3 flex items-center gap-2 shadow-sm border border-blue-100">
              <div className="flex-1 flex flex-col">
                <div className="font-medium text-indigo-900 text-[15px] mb-1">{sub}</div>
                <div className="flex gap-2 items-center">
                  <span className="font-bold text-gray-600 text-base">₹</span>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Amount"
                    className="w-24 h-10 px-2 py-0 rounded-lg text-base border border-gray-200 bg-white"
                    value={salaryInputs[sub]?.amount || ""}
                    onChange={e => handleInputChange(sub, 'amount', e.target.value)}
                  />
                  <select
                    value={salaryInputs[sub]?.period || "daily"}
                    onChange={e => handleInputChange(sub, 'period', e.target.value)}
                    className="rounded-lg border border-gray-200 px-2 py-1 text-base bg-white font-medium text-gray-800 outline-none focus:border-blue-400 transition"
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
        {/* Padding for sticky footer */}
        <div className="h-36 w-full" />
      </div>

      {/* Sticky footer */}
      <StickyFooterButton disabled={!canProceed} onClick={handleNext}>
        {canProceed ? "Continue" : "Enter all wage amounts"}
      </StickyFooterButton>
    </div>
  );
};

export default ModernMultiSalaryStep;
