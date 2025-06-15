
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { categories } from '@/data/categories';
import AestheticCategoryCard from '@/components/search/AestheticCategoryCard';
import ElegantSubcategoryModal from '@/components/search/ElegantSubcategoryModal';

interface ModernCategoryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
}

const ModernCategoryStep: React.FC<ModernCategoryStepProps> = ({ form, onNext }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryData, setSelectedCategoryData] = useState<any>(null);
  const [tempSubcategories, setTempSubcategories] = useState<string[]>([]);

  const category = form.watch('category');
  const subcategories = form.watch('subcategories');

  const handleCategorySelect = (categoryName: string) => {
    const categoryData = categories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (categoryData) {
      form.setValue('category', categoryData.name);
      setSelectedCategoryData(categoryData);
      setTempSubcategories(subcategories || []);
      setIsModalOpen(true);
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    const newSubcategories = tempSubcategories.includes(subcategory)
      ? tempSubcategories.filter(s => s !== subcategory)
      : tempSubcategories.length < 3
      ? [...tempSubcategories, subcategory]
      : tempSubcategories;
    
    setTempSubcategories(newSubcategories);
  };

  const handleConfirm = () => {
    form.setValue('subcategories', tempSubcategories);
    setIsModalOpen(false);
  };

  const handleClear = (categoryId: string) => {
    if (category?.toLowerCase() === categoryId) {
      form.setValue('category', '');
      form.setValue('subcategories', []);
    }
  };

  const handleNext = async () => {
    const isValid = await onNext();
    if (!isValid) {
      console.log('Validation failed, staying on current step');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Choose Your Category
        </h2>
        <p className="text-gray-600">Select what type of work you do and your specializations</p>
      </div>

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="sr-only">Work Category</FormLabel>
            <FormControl>
              <div className="grid grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const catId = cat.name.toLowerCase();
                  const isSelected = category?.toLowerCase() === catId;
                  const selectedSubs = isSelected ? subcategories || [] : [];

                  return (
                    <AestheticCategoryCard
                      key={catId}
                      catId={catId}
                      category={cat}
                      selectedSubs={selectedSubs}
                      hasSelections={selectedSubs.length > 0}
                      onSelect={() => handleCategorySelect(cat.name)}
                      onClear={() => handleClear(catId)}
                    />
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Continue Button */}
      <Button
        type="button"
        onClick={handleNext}
        disabled={!category || !subcategories?.length}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold shadow-lg"
      >
        Continue
      </Button>

      {/* Subcategory Selection Modal */}
      <ElegantSubcategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategoryData}
        selectedSubcategories={tempSubcategories}
        onSubcategoryToggle={handleSubcategoryToggle}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default ModernCategoryStep;
