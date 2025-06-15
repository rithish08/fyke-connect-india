
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';

interface ModernCategoryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
}

const ModernCategoryStep: React.FC<ModernCategoryStepProps> = ({ form, onNext }) => {
  const [selectedCategories, setSelectedCategories] = useState<{ [catId: string]: string[] }>({});

  const category = form.watch('category');
  const subcategories = form.watch('subcategories');

  // Initialize selectedCategories from form data
  React.useEffect(() => {
    if (category && subcategories?.length > 0) {
      setSelectedCategories({
        [category.toLowerCase()]: subcategories
      });
    }
  }, [category, subcategories]);

  const handleCategorySelect = (categoryId: string) => {
    // This will open the subcategory popup in EnhancedCategoryModal
  };

  const handleSubcategorySelect = (categoryId: string, subcategoriesSelected: string[]) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: subcategoriesSelected
    }));

    // Update form with the selected category and subcategories
    const categoryName = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
    form.setValue('category', categoryName);
    form.setValue('subcategories', subcategoriesSelected);
  };

  const handleClear = (categoryId: string) => {
    setSelectedCategories(prev => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });

    // Clear form data
    form.setValue('category', '');
    form.setValue('subcategories', []);
  };

  const handleNext = async () => {
    const isValid = await onNext();
    if (!isValid) {
      console.log('Validation failed, staying on current step');
    }
  };

  // Check if any category with subcategories is selected
  const hasValidSelection = Object.values(selectedCategories).some(subs => subs.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Choose Your Work Category
        </h2>
        <p className="text-gray-600">Select what type of gig work you do and your specializations</p>
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Work Category</FormLabel>
            <FormControl>
              <EnhancedCategoryModal
                selectedCategories={selectedCategories}
                onCategorySelect={handleCategorySelect}
                onSubcategorySelect={handleSubcategorySelect}
                onClear={handleClear}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Continue Button */}
      <Button
        type="button"
        onClick={handleNext}
        disabled={!hasValidSelection}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold shadow-lg"
      >
        Continue to Salary Setup
      </Button>
    </div>
  );
};

export default ModernCategoryStep;
