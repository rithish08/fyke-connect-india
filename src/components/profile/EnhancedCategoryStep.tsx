
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { Check, Plus } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface Category {
  id: string;
  name: string;
  subcategories: string[];
}

const categories: Category[] = [
  {
    id: 'construction',
    name: 'Construction',
    subcategories: ['Mason', 'Carpenter', 'Electrician', 'Plumber', 'Painter', 'Welder']
  },
  {
    id: 'delivery',
    name: 'Delivery',
    subcategories: ['Food Delivery', 'Package Delivery', 'Grocery Delivery', 'Medicine Delivery']
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    subcategories: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Post-Construction']
  },
  {
    id: 'security',
    name: 'Security',
    subcategories: ['Night Guard', 'Event Security', 'CCTV Operator', 'Residential Security']
  },
  {
    id: 'driver',
    name: 'Driver',
    subcategories: ['Taxi Driver', 'Delivery Driver', 'Personal Driver', 'Tour Guide']
  }
];

interface EnhancedCategoryStepProps {
  selectedCategories: string[];
  selectedSubcategories: { [key: string]: string[] };
  setSelectedCategories: (categories: string[]) => void;
  setSelectedSubcategories: (subcategories: { [key: string]: string[] }) => void;
  onNext: () => void;
}

const EnhancedCategoryStep: React.FC<EnhancedCategoryStepProps> = ({
  selectedCategories,
  selectedSubcategories,
  setSelectedCategories,
  setSelectedSubcategories,
  onNext
}) => {
  const { translateCategory } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
      const newSubcategories = { ...selectedSubcategories };
      delete newSubcategories[categoryId];
      setSelectedSubcategories(newSubcategories);
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, categoryId]);
      setExpandedCategory(categoryId);
    }
  };

  const toggleSubcategory = (categoryId: string, subcategory: string) => {
    const currentSubs = selectedSubcategories[categoryId] || [];
    const newSubs = currentSubs.includes(subcategory)
      ? currentSubs.filter(sub => sub !== subcategory)
      : [...currentSubs, subcategory];
    
    setSelectedSubcategories({
      ...selectedSubcategories,
      [categoryId]: newSubs
    });
  };

  const hasSelections = selectedCategories.length > 0 && 
    Object.values(selectedSubcategories).some(subs => subs.length > 0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Choose Your Skills</h2>
        <p className="text-gray-600 text-sm">Select up to 3 categories and their specializations</p>
        <div className="mt-2 text-xs text-blue-600 font-medium">
          {selectedCategories.length}/3 categories selected
        </div>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          const isExpanded = expandedCategory === category.id;
          const canSelect = selectedCategories.length < 3 || isSelected;

          return (
            <ModernCard key={category.id} className="overflow-hidden">
              <button
                onClick={() => toggleCategory(category.id)}
                disabled={!canSelect}
                className={`w-full p-4 text-left transition-all ${
                  isSelected 
                    ? 'bg-blue-50 border-blue-200' 
                    : canSelect 
                      ? 'hover:bg-gray-50 border-gray-200' 
                      : 'opacity-50 cursor-not-allowed border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </div>
                    <span className="font-medium text-gray-900">
                      {translateCategory(category.name)}
                    </span>
                  </div>
                  {isSelected && (
                    <Plus className={`w-5 h-5 text-blue-500 transition-transform ${
                      isExpanded ? 'rotate-45' : ''
                    }`} />
                  )}
                </div>
              </button>

              {isSelected && (
                <div className="px-4 pb-4">
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-3">Choose specializations:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {category.subcategories.map((sub) => {
                        const isSubSelected = selectedSubcategories[category.id]?.includes(sub);
                        return (
                          <button
                            key={sub}
                            onClick={() => toggleSubcategory(category.id, sub)}
                            className={`p-2 text-xs rounded-lg border transition-all ${
                              isSubSelected
                                ? 'bg-blue-100 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {translateCategory(sub)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </ModernCard>
          );
        })}
      </div>

      <Button
        onClick={onNext}
        disabled={!hasSelections}
        className="w-full h-12 rounded-xl bg-gray-900 text-white hover:bg-gray-800"
      >
        Continue
      </Button>
    </div>
  );
};

export default EnhancedCategoryStep;
