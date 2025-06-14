
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModernCard } from '@/components/ui/modern-card';

interface SalaryRates {
  daily: string;
  weekly: string;
  monthly: string;
}

interface EnhancedSalaryStepProps {
  salaryRates: SalaryRates;
  setSalaryRates: (rates: SalaryRates) => void;
  onNext: () => void;
  onBack: () => void;
}

const EnhancedSalaryStep: React.FC<EnhancedSalaryStepProps> = ({
  salaryRates,
  setSalaryRates,
  onNext,
  onBack
}) => {
  const handleRateChange = (period: keyof SalaryRates, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setSalaryRates({
      ...salaryRates,
      [period]: numericValue
    });
  };

  const hasValidRates = salaryRates.daily || salaryRates.weekly || salaryRates.monthly;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Set Your Rates</h2>
        <p className="text-gray-600 text-sm">Enter your expected salary for different periods</p>
      </div>

      <div className="space-y-4">
        {/* Daily Rate */}
        <ModernCard className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">Daily Rate</Label>
              <p className="text-xs text-gray-500">For single day work</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-700">₹</span>
              <Input
                type="text"
                placeholder="300"
                value={salaryRates.daily}
                onChange={(e) => handleRateChange('daily', e.target.value)}
                className="w-24 text-right text-lg font-medium"
              />
            </div>
          </div>
        </ModernCard>

        {/* Weekly Rate */}
        <ModernCard className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">Weekly Rate</Label>
              <p className="text-xs text-gray-500">For 6-7 days work</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-700">₹</span>
              <Input
                type="text"
                placeholder="2000"
                value={salaryRates.weekly}
                onChange={(e) => handleRateChange('weekly', e.target.value)}
                className="w-24 text-right text-lg font-medium"
              />
            </div>
          </div>
        </ModernCard>

        {/* Monthly Rate */}
        <ModernCard className="p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label className="text-sm font-medium text-gray-700">Monthly Rate</Label>
              <p className="text-xs text-gray-500">For full month work</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-700">₹</span>
              <Input
                type="text"
                placeholder="8000"
                value={salaryRates.monthly}
                onChange={(e) => handleRateChange('monthly', e.target.value)}
                className="w-24 text-right text-lg font-medium"
              />
            </div>
          </div>
        </ModernCard>
      </div>

      <div className="flex gap-3 mt-6">
        <Button 
          type="button" 
          onClick={onBack} 
          variant="outline"
          className="flex-1 h-12 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!hasValidRates}
          className="flex-1 h-12 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EnhancedSalaryStep;
