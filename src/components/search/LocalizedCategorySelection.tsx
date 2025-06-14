
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { categories } from '@/data/categories';

interface LocalizedCategorySelectionProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  onBack?: () => void;
  title?: string;
}

const LocalizedCategorySelection: React.FC<LocalizedCategorySelectionProps> = ({ 
  onCategorySelect, 
  onBack,
  title
}) => {
  const { translateCategory, translateText } = useTranslation();

  const defaultTitle = translateText('search.select_category', 'Select Category');

  return (
    <div className="space-y-4">
      {onBack && (
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-bold text-gray-900">{title || defaultTitle}</h2>
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => (
          <ModernCard
            key={category.name}
            className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => onCategorySelect(category.name.toLowerCase(), category.name)}
          >
            <div className="text-center space-y-3">
              <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg text-2xl`}>
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {translateCategory(category.name)}
                </h3>
                <p className="text-xs text-gray-500">
                  {category.subcategories.length} {translateText('category.types', 'types')}
                </p>
              </div>
            </div>
          </ModernCard>
        ))}
      </div>
    </div>
  );
};

export default LocalizedCategorySelection;
