
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { categories } from '@/data/categories';
import VehicleSelection from './VehicleSelection';

interface ModernCategoryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
}

const ModernCategoryStep: React.FC<ModernCategoryStepProps> = ({ form, onNext }) => {
  const selectedCategory = form.watch('category');
  const selectedSubcategories = form.watch('subcategories');
  const selectedVehicle = form.watch('vehicle');

  const handleCategorySelect = (categoryName: string) => {
    form.setValue('category', categoryName);
    // Reset subcategories when changing category
    if (categoryName !== selectedCategory) {
      form.setValue('subcategories', []);
      form.setValue('vehicle', '');
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    const current = selectedSubcategories || [];
    const updated = current.includes(subcategory)
      ? current.filter(s => s !== subcategory)
      : [...current, subcategory];
    
    form.setValue('subcategories', updated);
  };

  const selectedCategoryData = categories.find(cat => cat.name === selectedCategory);
  const canProceed = selectedCategory && 
                    selectedSubcategories.length > 0 && 
                    (selectedCategory !== "Driver" || selectedVehicle);

  return (
    <div className="space-y-6">
      {/* Category Selection */}
      <FormField
        control={form.control}
        name="category"
        render={() => (
          <FormItem>
            <FormLabel className="text-lg font-semibold">Select your category</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {categories.map(cat => (
                  <button
                    key={cat.name}
                    type="button"
                    className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${
                      selectedCategory === cat.name 
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105" 
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                    onClick={() => handleCategorySelect(cat.name)}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</div>
                    <div className="text-xs text-gray-500">
                      {cat.subcategories.length} specializations
                    </div>
                  </button>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subcategory Selection */}
      {selectedCategoryData && (
        <FormField
          control={form.control}
          name="subcategories"
          render={() => (
            <FormItem>
              <FormLabel className="text-md font-medium">
                Choose your specializations in {selectedCategory}
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-1 gap-2 mt-3 max-h-48 overflow-y-auto">
                  {selectedCategoryData.subcategories.map(sub => (
                    <button
                      key={sub}
                      type="button"
                      className={`p-3 rounded-lg border text-left text-sm transition-all ${
                        selectedSubcategories.includes(sub)
                          ? "border-blue-500 bg-blue-50 text-blue-900"
                          : "border-gray-200 bg-white hover:border-blue-300"
                      }`}
                      onClick={() => handleSubcategoryToggle(sub)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{sub}</span>
                        {selectedSubcategories.includes(sub) && (
                          <span className="text-blue-500 font-bold">✓</span>
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
      )}

      {/* Vehicle Selection for Drivers */}
      {selectedCategory === "Driver" && (
        <FormField
          control={form.control}
          name="vehicle"
          render={() => (
            <FormItem>
              <FormControl>
                <VehicleSelection
                  selectedVehicle={selectedVehicle}
                  onVehicleSelect={(vehicle) => form.setValue('vehicle', vehicle)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Continue Button */}
      <Button
        type="button"
        className={`w-full h-14 font-semibold text-lg rounded-2xl transition-all ${
          canProceed
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!canProceed}
        onClick={onNext}
      >
        {!selectedCategory
          ? 'Select a category to continue'
          : selectedSubcategories.length === 0
          ? 'Select at least 1 specialization'
          : selectedCategory === "Driver" && !selectedVehicle
          ? 'Select a vehicle type'
          : `Continue with ${selectedCategory}`
        }
      </Button>
    </div>
  );
};

export default ModernCategoryStep;
