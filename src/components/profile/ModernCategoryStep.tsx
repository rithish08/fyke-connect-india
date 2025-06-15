
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import { CheckCircle, X } from 'lucide-react';

interface ModernCategoryStepProps {
  form: UseFormReturn<ProfileSetupFormData>;
  onNext: () => Promise<boolean>;
  userName: string;
}

const ModernCategoryStep: React.FC<ModernCategoryStepProps> = ({ form, onNext, userName }) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    form.getValues('subcategories') || []
  );

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev => {
      let newSelection;
      const isSelected = prev.includes(subcategory);
      if (isSelected) {
        newSelection = prev.filter(sub => sub !== subcategory);
      } else if (prev.length < 3) {
        newSelection = [...prev, subcategory];
      } else {
        newSelection = prev;
      }
      form.setValue('subcategories', newSelection);
      return newSelection;
    });
  };

  const removeSubcategory = (subcategory: string) => {
    const newSelection = selectedSubcategories.filter(sub => sub !== subcategory);
    setSelectedSubcategories(newSelection);
    form.setValue('subcategories', newSelection);
  };

  const handleNext = async () => {
    const isValid = await onNext();
    if (!isValid) {
      // Optionally show toast or feedback
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome user */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-bold mb-1 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
          {userName ? `Welcome, ${userName}!` : "Welcome!"}
        </h2>
        <div className="text-gray-700 text-base mb-4 font-medium">
          Select your work category type
        </div>
      </div>

      {/* Selected specializations panel */}
      {selectedSubcategories.length > 0 && (
        <AestheticCard variant="glass" className="p-4 bg-blue-50 border-blue-200">
          <div>
            <div className="font-semibold text-blue-900 text-sm mb-2">
              Selected Specializations ({selectedSubcategories.length}/3)
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSubcategories.map(sub => (
                <Badge 
                  key={sub} 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-800 flex items-center gap-1 pr-1"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => removeSubcategory(sub)}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </AestheticCard>
      )}

      {/* Categories & subcategories */}
      <FormField
        control={form.control}
        name="subcategories"
        render={() => (
          <FormItem>
            <FormLabel className="sr-only">Specializations</FormLabel>
            <FormControl>
              <div className="space-y-6">
                {categories.map((category) => (
                  <AestheticCard
                    key={category.name}
                    variant="elevated"
                    className="p-4 border-2 border-transparent hover:border-blue-200"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 mb-1">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg`}>
                          <span className="text-white text-xl">{category.icon}</span>
                        </div>
                        <h3 className="font-bold text-gray-900">{category.name}</h3>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {category.subcategories.map((subcategory) => {
                          const isSelected = selectedSubcategories.includes(subcategory);
                          const isDisabled = !isSelected && selectedSubcategories.length >= 3;
                          return (
                            <button
                              key={subcategory}
                              type="button"
                              onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                              disabled={isDisabled}
                              className={`p-3 rounded-lg text-left transition-all duration-200 border flex items-center justify-between ${
                                isSelected
                                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500'
                                  : isDisabled
                                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                              }`}
                            >
                              <span className={`font-medium ${isSelected ? 'text-blue-900' : isDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
                                {subcategory}
                              </span>
                              {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </AestheticCard>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button
        type="button"
        onClick={handleNext}
        disabled={selectedSubcategories.length === 0}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold shadow-xl"
      >
        {selectedSubcategories.length === 0
          ? 'Select at least 1 specialization'
          : `Continue with ${selectedSubcategories.length} specialization${selectedSubcategories.length !== 1 ? 's' : ''}`
        }
      </Button>
    </div>
  );
};

export default ModernCategoryStep;
