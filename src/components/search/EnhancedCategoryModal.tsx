
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronDown, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { categories } from '@/data/categories';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';

interface EnhancedCategoryModalProps {
  selectedCategory: {id: string, name: string} | null;
  selectedSubcategories: string[];
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  onSubcategorySelect: (subcategories: string[]) => void;
  children?: React.ReactNode;
}

const EnhancedCategoryModal: React.FC<EnhancedCategoryModalProps> = ({
  selectedCategory,
  selectedSubcategories,
  onCategorySelect,
  onSubcategorySelect,
  children
}) => {
  const { translateCategory, translateText } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [tempSelectedSubcategories, setTempSelectedSubcategories] = useState<string[]>(selectedSubcategories);

  const selectedCategoryData = selectedCategory ? 
    categories.find(cat => cat.name.toLowerCase() === selectedCategory.id.toLowerCase()) : null;

  const handleCategoryClick = (category: any) => {
    onCategorySelect(category.name.toLowerCase(), category.name);
    setTempSelectedSubcategories([]);
    setIsOpen(true);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setTempSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleConfirm = () => {
    onSubcategorySelect(tempSelectedSubcategories);
    setIsOpen(false);
  };

  const handleClear = () => {
    onCategorySelect('', '');
    onSubcategorySelect([]);
    setTempSelectedSubcategories([]);
  };

  return (
    <div className="space-y-4">
      {/* Selected Category Display */}
      {selectedCategory && selectedCategoryData && (
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${selectedCategoryData.color} flex items-center justify-center shadow-md`}>
                <span className="text-white text-xl">{selectedCategoryData.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-semibold text-gray-900 ${getResponsiveTextSize(translateCategory(selectedCategory.name), { baseSize: 16, minSize: 14, maxSize: 18 })}`}>
                  {translateCategory(selectedCategory.name)}
                </h3>
                {selectedSubcategories.length > 0 && (
                  <p className="text-sm text-blue-600">
                    {selectedSubcategories.length} {translateText('category.selected', 'selected')}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center space-x-1">
                    <span>{translateText('category.edit', 'Edit')}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
                  <SheetHeader className="text-left pb-4">
                    <SheetTitle className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${selectedCategoryData.color} flex items-center justify-center`}>
                        <span className="text-white text-lg">{selectedCategoryData.icon}</span>
                      </div>
                      <span>{translateCategory(selectedCategoryData.name)} {translateText('category.specializations', 'Specializations')}</span>
                    </SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-3 py-4 max-h-[50vh] overflow-y-auto">
                    {selectedCategoryData.subcategories.map((subcategory) => {
                      const isSelected = tempSelectedSubcategories.includes(subcategory);
                      return (
                        <div
                          key={subcategory}
                          className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-500 shadow-md' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                          }`}
                          onClick={() => handleSubcategoryToggle(subcategory)}
                        >
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-gray-900 ${getResponsiveTextSize(subcategory, { baseSize: 14, minSize: 12, maxSize: 16 })}`}>
                              {subcategory}
                            </span>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t bg-white">
                    <p className="text-sm text-gray-600">
                      {tempSelectedSubcategories.length} {translateText('category.selected', 'selected')}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsOpen(false)}>
                        {translateText('common.cancel', 'Cancel')}
                      </Button>
                      <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
                        {translateText('common.confirm', 'Confirm')}
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Button variant="ghost" size="sm" onClick={handleClear}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {selectedSubcategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSubcategories.map(sub => (
                <Badge key={sub} variant="secondary" className="bg-blue-100 text-blue-800 rounded-full">
                  {sub}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Grid - Only show if no category selected */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const translatedName = translateCategory(category.name);
            const categoryTextSize = getResponsiveTextSize(translatedName, {
              baseSize: 14,
              minSize: 11,
              maxSize: 15
            });
            
            return (
              <div
                key={category.name}
                className="bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-200"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="text-center space-y-3">
                  <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg text-2xl`}>
                    {category.icon}
                  </div>
                  <div>
                    <h3 className={`font-semibold text-gray-900 ${categoryTextSize} ${getFlexibleContainerClass(translatedName, 'mx-auto')}`}>
                      {translatedName}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.subcategories.length} {translateText('category.types', 'types')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {children}
    </div>
  );
};

export default EnhancedCategoryModal;
