
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';
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
        {categories.map((category) => {
          const translatedName = translateCategory(category.name);
          const categoryTextSize = getResponsiveTextSize(translatedName, {
            baseSize: 14,
            minSize: 11,
            maxSize: 15
          });
          const subcategoryText = `${category.subcategories.length} ${translateText('category.types', 'types')}`;
          const subcategoryTextSize = getResponsiveTextSize(subcategoryText, {
            baseSize: 12,
            minSize: 9,
            maxSize: 12
          });

          return (
            <ModernCard
              key={category.name}
              className="p-3 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => onCategorySelect(category.name.toLowerCase(), category.name)}
            >
              <div className="text-center space-y-2">
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg text-2xl`}>
                  {category.icon}
                </div>
                <div className="space-y-1">
                  <h3 className={`font-semibold text-gray-900 ${categoryTextSize} ${getFlexibleContainerClass(translatedName, 'mx-auto')}`}>
                    {translatedName}
                  </h3>
                  <p className={`text-gray-500 ${subcategoryTextSize} ${getFlexibleContainerClass(subcategoryText, 'mx-auto')}`}>
                    {subcategoryText}
                  </p>
                </div>
              </div>
            </ModernCard>
          );
        })}
      </div>
    </div>
  );
};

export default LocalizedCategorySelection;
