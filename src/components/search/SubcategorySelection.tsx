
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
    return <div>Category not found</div>;
  }

  const IconComponent = category.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
            <IconComponent className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{category.name}</h2>
        </div>
      </div>

      {multiSelect && selectedSubcategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
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
                isSelected ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
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
        <div className="pt-4 border-t">
          <Button 
            className="w-full"
            disabled={selectedSubcategories.length === 0}
            onClick={() => {
              // This would trigger the search with selected subcategories
              console.log('Search with:', selectedSubcategories);
            }}
          >
            Search {selectedSubcategories.length > 0 ? `(${selectedSubcategories.length} selected)` : ''}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SubcategorySelection;
