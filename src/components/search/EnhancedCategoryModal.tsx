
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ChevronDown, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { categories } from '@/data/categories';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';

interface EnhancedCategoryModalProps {
  selectedCategories: { [catId: string]: string[] }; // map of categoryId to subcategories
  onCategorySelect: (categoryId: string) => void; // open popup for this category
  onSubcategorySelect: (categoryId: string, subcategories: string[]) => void;
  onClear: (categoryId: string) => void;
}

const EnhancedCategoryModal: React.FC<EnhancedCategoryModalProps> = ({
  selectedCategories,
  onCategorySelect,
  onSubcategorySelect,
  onClear,
}) => {
  const { translateCategory, translateText } = useTranslation();
  const [popupCategoryId, setPopupCategoryId] = useState<string | null>(null);
  const [tempSelectedSubcategories, setTempSelectedSubcategories] = useState<string[]>([]);

  const openSubcategoryPopup = (categoryId: string) => {
    const already = selectedCategories[categoryId] || [];
    setPopupCategoryId(categoryId);
    setTempSelectedSubcategories([...already]);
  };

  const closePopup = () => {
    setPopupCategoryId(null);
    setTempSelectedSubcategories([]);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setTempSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : prev.length < 3 ? [...prev, subcategory] : prev
    );
  };

  const handleConfirm = () => {
    if (popupCategoryId) {
      onSubcategorySelect(popupCategoryId, tempSelectedSubcategories);
    }
    closePopup();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const translatedName = translateCategory(category.name);
          const catId = category.name.toLowerCase();
          const selectedSubs = selectedCategories[catId] || [];
          const hasSelections = selectedSubs.length > 0;
          const categoryTextSize = getResponsiveTextSize(translatedName, {
            baseSize: 14,
            minSize: 11,
            maxSize: 15
          });
          return (
            <div
              key={catId}
              className={`relative bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 ${hasSelections ? 'ring-2 ring-blue-400' : ''}`}
              style={{
                minHeight: hasSelections ? 140 + selectedSubs.length * 22 : 120,
                transition: 'min-height 0.15s',
              }}
              onClick={() => openSubcategoryPopup(catId)}
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
              {hasSelections && (
                <div className="mt-2 flex flex-wrap justify-center gap-2">
                  {selectedSubs.map((sub) => (
                    <Badge key={sub} variant="secondary" className="bg-blue-100 text-blue-800 rounded-full text-xs px-2 py-1">
                      {sub}
                    </Badge>
                  ))}
                  <button
                    title="Clear selection"
                    onClick={e => { e.stopPropagation(); onClear(catId); }}
                    className="ml-1 text-gray-400 hover:text-gray-600"
                    aria-label="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Subcategory Selection Sheet */}
      <Sheet open={!!popupCategoryId} onOpenChange={open => !open && closePopup()}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
          {popupCategoryId && (() => {
            const category = categories.find(
              (cat) => cat.name.toLowerCase() === popupCategoryId
            );
            if (!category) return null;
            return (
              <>
                <SheetHeader className="text-left pb-4">
                  <SheetTitle className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                      <span className="text-white text-lg">{category.icon}</span>
                    </div>
                    <span>
                      {translateCategory(category.name)}{' '}
                      {translateText('category.specializations', 'Specializations')}
                    </span>
                  </SheetTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {translateText('category.select_up_to_three', 'Select up to 3 specializations')}
                  </p>
                </SheetHeader>
                <div className="space-y-3 py-4 max-h-[50vh] overflow-y-auto">
                  {category.subcategories.map((subcategory) => {
                    const isSelected = tempSelectedSubcategories.includes(subcategory);
                    const isDisabled =
                      !isSelected && tempSelectedSubcategories.length >= 3;
                    return (
                      <div
                        key={subcategory}
                        className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                          isSelected
                            ? 'bg-blue-50 border-blue-500 shadow-md'
                            : isDisabled
                            ? 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                        }`}
                        onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-medium text-gray-900 ${getResponsiveTextSize(
                            subcategory,
                            { baseSize: 14, minSize: 12, maxSize: 16 }
                          )}`}>
                            {subcategory}
                          </span>
                          {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t bg-white">
                  <p className="text-sm text-gray-600">
                    {tempSelectedSubcategories.length}/3 {translateText('category.selected', 'selected')}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={closePopup}>
                      {translateText('common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
                      {translateText('common.confirm', 'Confirm')}
                    </Button>
                  </div>
                </div>
              </>
            );
          })()}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default EnhancedCategoryModal;
