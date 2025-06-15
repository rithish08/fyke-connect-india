
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { BadgeCheck, DollarSign } from 'lucide-react';
import { FloatingCard } from '@/components/ui/floating-card';
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

  const [salaryInputs, setSalaryInputs] = useState<Record<string, SalaryEntry>>(() => {
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

  const handleNext = async () => {
    const cleaned = subcategories.reduce((acc, sub) => {
      acc[sub] = salaryInputs[sub];
      return acc;
    }, {} as Record<string, SalaryEntry>);

    form.setValue('salaryBySubcategory', cleaned);
    if (canProceed) {
      await onNext();
    }
  };

  return (
    <div className="pb-24">
      <div className="space-y-6">
        {/* Header */}
        <FloatingCard variant="glow" size="sm" className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Set Your Wages</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Enter expected wages for your {subcategories.length} specialization{subcategories.length > 1 ? 's' : ''}
          </p>
        </FloatingCard>

        {/* Salary Inputs */}
        <div className="space-y-4">
          {subcategories.map(sub => (
            <FloatingCard key={sub} variant="elevated" size="sm" className="bg-gradient-to-br from-white to-blue-50/30">
              <div className="space-y-3">
                <div className="font-semibold text-gray-900 text-base">{sub}</div>
                <div className="flex gap-3 items-center">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 font-bold text-gray-600 text-lg">₹</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Amount"
                      className="pl-8 h-12 rounded-xl font-medium text-lg border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400/20"
                      value={salaryInputs[sub]?.amount || ""}
                      onChange={e => handleInputChange(sub, 'amount', e.target.value)}
                    />
                  </div>
                  <select
                    value={salaryInputs[sub]?.period || "daily"}
                    onChange={e => handleInputChange(sub, 'period', e.target.value)}
                    className="rounded-xl border border-gray-200 px-4 py-3 text-base bg-white font-medium text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                  >
                    {periods.map(period => (
                      <option key={period.value} value={period.value}>{period.label}</option>
                    ))}
                  </select>
                </div>
                {!isAmountValid(salaryInputs[sub]?.amount) && salaryInputs[sub]?.amount && (
                  <FormMessage>Please enter a valid amount</FormMessage>
                )}
              </div>
            </FloatingCard>
          ))}
        </div>

        {/* Summary */}
        {canProceed && (
          <FloatingCard variant="minimal" size="sm" className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200/50">
            <div>
              <div className="font-semibold text-green-900 mb-2 flex items-center">
                <BadgeCheck className="w-4 h-4 mr-2" />
                Wage Summary
              </div>
              <div className="space-y-1">
                {subcategories.map(sub =>
                  isAmountValid(salaryInputs[sub]?.amount) && (
                    <div key={sub} className="text-green-800 text-sm flex justify-between">
                      <span className="font-medium">{sub}:</span>
                      <span>₹{Number(salaryInputs[sub].amount).toLocaleString()} / {salaryInputs[sub].period}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </FloatingCard>
        )}
      </div>

      {/* Sticky Footer Button */}
      <StickyFooterButton
        onClick={handleNext}
        disabled={!canProceed}
      >
        Continue to Availability
      </StickyFooterButton>
    </div>
  );
};

export default ModernMultiSalaryStep;
