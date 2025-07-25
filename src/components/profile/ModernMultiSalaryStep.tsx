
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FloatingCard } from '@/components/ui/floating-card';
import { DollarSign } from 'lucide-react';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import StickyFooterButton from '@/components/ui/StickyFooterButton';

interface ModernMultiSalaryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => void;
  onBack: () => void;
  allowSkip?: boolean;
}

const ModernMultiSalaryStep: React.FC<ModernMultiSalaryStepProps> = ({ form, onNext, onBack, allowSkip }) => {
  const subcategories = form.watch('subcategories') || [];
  const vehicleOwnerSubs = [
    'Cargo Auto', 'Mini Truck (e.g., Tata Ace)', 'Lorry / Truck (6–12 wheeler)',
    'Tractor with Trailer', 'Bike with Carrier', 'Auto Rickshaw', 'Bike Taxi',
    'Taxi (Sedan/Hatchback)', 'Passenger Van (Eeco, Force)', 'Private Bus (15–50 seats)',
    'Water Tanker', 'Ambulance'
  ];
  const nonVehicleSubcategories = subcategories.filter(sub => !vehicleOwnerSubs.includes(sub));

  // Force completion - skip validation and proceed
  const handleComplete = () => {
    console.log('Complete button clicked - forcing completion');
    
    // Set default values for any missing salary data
    const currentSalaryData = form.getValues('salaryBySubcategory') || {};
    const updatedSalaryData = { ...currentSalaryData };
    
    // Ensure all non-vehicle subcategories have salary data
    nonVehicleSubcategories.forEach(sub => {
      if (!updatedSalaryData[sub]) {
        updatedSalaryData[sub] = {
          amount: '500', // Default amount
          period: 'daily' // Default period
        };
      }
    });
    
    // Update form with default values
    form.setValue('salaryBySubcategory', updatedSalaryData);
    
    // Force proceed to next step
    onNext();
  };

  return (
    <div className="space-y-6 pb-28">
      <FloatingCard variant="glow" size="sm">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Set Your Rates
          </h2>
          <p className="text-gray-600">
            Set competitive rates for your selected specializations (optional)
          </p>
        </div>
      </FloatingCard>

      <div className="space-y-4">
        {nonVehicleSubcategories.map((subcategory) => (
          <FloatingCard key={subcategory} variant="elevated" size="sm">
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                {subcategory}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`salaryBySubcategory.${subcategory}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">Amount (₹)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="500"
                          {...field}
                          className="h-11 rounded-xl border-gray-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`salaryBySubcategory.${subcategory}.period`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-gray-600">Period</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-gray-200">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </FloatingCard>
        ))}
      </div>

      <StickyFooterButton onClick={handleComplete}>
        Complete Profile
      </StickyFooterButton>
      {allowSkip && (
        <div className="w-full max-w-lg mx-auto px-4 mt-2">
          <button
            type="button"
            onClick={onNext}
            className="w-full h-12 rounded-2xl border border-blue-300 text-blue-700 bg-white/60 hover:bg-blue-50 font-semibold shadow-sm transition-all duration-200 text-base mt-2"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
};

export default ModernMultiSalaryStep;
