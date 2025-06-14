
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { categories } from './CategorySelection';

interface SubcategorySelectionProps {
  categoryId: string;
  onSubcategorySelect: (subcategory: string) => void;
  onBack: () => void;
  selectedSubcategories?: string[];
  multiSelect?: boolean;
}

const SubcategorySelection: React.FC<SubcategorySelectionProps> = ({ 
  categoryId, 
  onSubcategorySelect, 
  onBack,
  selectedSubcategories = [],
  multiSelect = false
}) => {
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Category not found</p>
        <Button onClick={onBack} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const IconComponent = category.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
        </div>
      </div>

      {multiSelect && selectedSubcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-blue-50 rounded-lg">
          <p className="w-full text-sm font-medium text-blue-900 mb-2">Selected Specializations:</p>
          {selectedSubcategories.map((sub) => (
            <Badge key={sub} variant="default" className="bg-blue-600">
              {sub}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="space-y-2">
        {category.subcategories.map((subcategory) => {
          const isSelected = selectedSubcategories.includes(subcategory);
          return (
            <ModernCard
              key={subcategory}
              className={`p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                isSelected ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' : 'hover:bg-gray-50'
              }`}
              onClick={() => onSubcategorySelect(subcategory)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">{subcategory}</span>
                {isSelected && (
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </ModernCard>
          );
        })}
      </div>

      {multiSelect && (
        <div className="pt-4 border-t bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-3">
            {selectedSubcategories.length === 0 
              ? 'Select one or more specializations to continue'
              : `${selectedSubcategories.length} specialization${selectedSubcategories.length > 1 ? 's' : ''} selected`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SubcategorySelection;
