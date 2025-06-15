
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { categories } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import { FloatingCard } from '@/components/ui/floating-card';
import { CheckCircle, X, Sparkles } from 'lucide-react';

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
      {/* Welcome Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <Sparkles className="w-6 h-6 text-violet-500 mr-2" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            {userName ? `Welcome, ${userName}!` : "Welcome!"}
          </h2>
        </div>
        <p className="text-gray-600 text-base">
          Choose your work specializations to get started
        </p>
      </div>

      {/* Selected Items Preview */}
      {selectedSubcategories.length > 0 && (
        <FloatingCard variant="minimal" size="sm" className="bg-gradient-to-r from-violet-50 to-blue-50 border-violet-200/50">
          <div>
            <div className="font-semibold text-violet-900 text-sm mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Selected ({selectedSubcategories.length}/3)
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSubcategories.map(sub => (
                <Badge 
                  key={sub} 
                  className="bg-gradient-to-r from-violet-100 to-blue-100 text-violet-800 border-violet-200/50 flex items-center gap-1 pr-1 hover:from-violet-200 hover:to-blue-200 transition-all"
                >
                  {sub}
                  <button
                    type="button"
                    onClick={() => removeSubcategory(sub)}
                    className="ml-1 hover:bg-violet-300 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </FloatingCard>
      )}

      {/* Categories Grid */}
      <FormField
        control={form.control}
        name="subcategories"
        render={() => (
          <FormItem>
            <FormLabel className="sr-only">Specializations</FormLabel>
            <FormControl>
              <div className="grid grid-cols-1 gap-4">
                {categories.map((category) => (
                  <FloatingCard
                    key={category.name}
                    variant="elevated"
                    size="sm"
                    className="hover:border-violet-200 transition-all duration-300 group"
                  >
                    <div className="space-y-4">
                      {/* Category Header */}
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <span className="text-white text-2xl">{category.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{category.name}</h3>
                          <p className="text-sm text-gray-500">{category.subcategories.length} options available</p>
                        </div>
                      </div>
                      
                      {/* Subcategories Grid */}
                      <div className="grid grid-cols-2 gap-2">
                        {category.subcategories.map((subcategory) => {
                          const isSelected = selectedSubcategories.includes(subcategory);
                          const isDisabled = !isSelected && selectedSubcategories.length >= 3;
                          return (
                            <button
                              key={subcategory}
                              type="button"
                              onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                              disabled={isDisabled}
                              className={`p-3 rounded-xl text-left transition-all duration-200 border-2 flex items-center justify-between text-sm font-medium ${
                                isSelected
                                  ? 'bg-gradient-to-r from-violet-50 to-blue-50 border-violet-300 ring-2 ring-violet-400/30 scale-105'
                                  : isDisabled
                                    ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
                                    : 'bg-white border-gray-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:border-blue-300 hover:scale-105'
                              }`}
                            >
                              <span className={isSelected ? 'text-violet-900' : isDisabled ? 'text-gray-400' : 'text-gray-900'}>
                                {subcategory}
                              </span>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                  <CheckCircle className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </FloatingCard>
                ))}
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
        disabled={selectedSubcategories.length === 0}
        className="w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 text-lg"
      >
        {selectedSubcategories.length === 0
          ? 'Select at least 1 specialization'
          : `Continue with ${selectedSubcategories.length} specialization${selectedSubcategories.length !== 1 ? 's' : ''} ✨`
        }
      </Button>
    </div>
  );
};

export default ModernCategoryStep;
