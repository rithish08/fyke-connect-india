import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CheckCircle, ChevronDown, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useCategories, Category } from '@/hooks/useCategories';
import { useSubcategories } from '@/hooks/useSubcategories';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface EnhancedCategorySelectionProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
  onSubcategorySelect?: (categoryId: string, subcategories: string[]) => void;
  selectedCategory?: {id: string, name: string} | null;
  selectedSubcategories?: string[];
  showSubcategories?: boolean;
}

const EnhancedCategorySelection: React.FC<EnhancedCategorySelectionProps> = ({ 
  onCategorySelect,
  onSubcategorySelect,
  selectedCategory,
  selectedSubcategories = [],
  showSubcategories = false
}) => {
  const { translateCategory, translateText } = useTranslation();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { subcategories, loading: subcategoriesLoading } = useSubcategories(selectedCategory?.id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [tempSelectedSubcategories, setTempSelectedSubcategories] = useState<string[]>(selectedSubcategories);

  const handleCategoryClick = (category: Category) => {
    if (showSubcategories) {
      onCategorySelect(category.id, category.name);
      setIsDialogOpen(true);
    } else {
      onCategorySelect(category.id, category.name);
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setTempSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleConfirmSelection = () => {
    if (selectedCategory && onSubcategorySelect) {
      onSubcategorySelect(selectedCategory.id, tempSelectedSubcategories);
    }
    setIsDialogOpen(false);
  };

  const selectedCategoryData = selectedCategory ? 
    categories.find(cat => cat.id === selectedCategory.id) : null;

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  if (categoriesError) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Error loading categories: {categoriesError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Selected Category Display */}
      {selectedCategory && selectedCategoryData && (
        <ModernCard className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                <span className="text-white text-xl">{selectedCategoryData.icon || '🏢'}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
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
              {showSubcategories && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsDialogOpen(true)}
                  className="flex items-center space-x-1"
                >
                  <span>{translateText('category.edit', 'Edit')}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onCategorySelect('', '');
                  setTempSelectedSubcategories([]);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {selectedSubcategories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedSubcategories.map(sub => (
                <Badge key={sub} variant="secondary" className="bg-blue-100 text-blue-800">
                  {sub}
                </Badge>
              ))}
            </div>
          )}
        </ModernCard>
      )}

      {/* Category Grid */}
      {!selectedCategory && (
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <ModernCard
              key={category.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => handleCategoryClick(category)}
            >
              <div className="text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg text-2xl">
                  {category.icon || '🏢'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {translateCategory(category.name)}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {category.description || 'Various specializations'}
                  </p>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      )}

      {/* Subcategory Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedCategoryData && (
                <>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-lg">{selectedCategoryData.icon || '🏢'}</span>
                  </div>
                  <span>{translateCategory(selectedCategoryData.name)} {translateText('category.specializations', 'Specializations')}</span>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-2 py-4">
            {subcategoriesLoading ? (
              <div className="flex items-center justify-center p-4">
                <LoadingSpinner />
                <span className="ml-2">Loading specializations...</span>
              </div>
            ) : (
              subcategories.map((subcategory) => {
                const isSelected = tempSelectedSubcategories.includes(subcategory.name);
                return (
                  <div
                    key={subcategory.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                      isSelected 
                        ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => handleSubcategoryToggle(subcategory.name)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{subcategory.name}</span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-600">
              {tempSelectedSubcategories.length} {translateText('category.selected', 'selected')}
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {translateText('common.cancel', 'Cancel')}
              </Button>
              <Button onClick={handleConfirmSelection}>
                {translateText('common.confirm', 'Confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedCategorySelection;
