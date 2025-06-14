
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CheckCircle } from 'lucide-react';

interface SubcategoryPopupProps {
  open: boolean;
  closePopup: () => void;
  popupCategoryId: string | null;
  tempSelectedSubcategories: string[];
  setTempSelectedSubcategories: (subs: string[]) => void;
  onConfirm: () => void;
  category: {
    name: string;
    icon: React.ReactNode;
    color: string;
    subcategories: string[];
  } | undefined;
  translateCategory: (name: string) => string;
  translateText: (key: string, fallback: string) => string;
  getResponsiveTextSize: (txt: string, opts: { baseSize: number; minSize: number; maxSize: number }) => string;
}

const SubcategoryPopup: React.FC<SubcategoryPopupProps> = ({
  open,
  closePopup,
  popupCategoryId,
  tempSelectedSubcategories,
  setTempSelectedSubcategories,
  onConfirm,
  category,
  translateCategory,
  translateText,
  getResponsiveTextSize,
}) => {
  const handleSubcategoryToggle = (subcategory: string) => {
    setTempSelectedSubcategories(
      tempSelectedSubcategories.includes(subcategory)
        ? tempSelectedSubcategories.filter((s) => s !== subcategory)
        : tempSelectedSubcategories.length < 3
          ? [...tempSelectedSubcategories, subcategory]
          : tempSelectedSubcategories
    );
  };

  if (!category) return null;

  return (
    <Sheet open={open} onOpenChange={openVal => !openVal && closePopup()}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
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
            const isDisabled = !isSelected && tempSelectedSubcategories.length >= 3;
            return (
              <div
                key={subcategory}
                className={`p-3 rounded-xl cursor-pointer transition-all duration-200 border-2 ${isSelected
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
            <Button onClick={onConfirm} className="bg-blue-600 hover:bg-blue-700">
              {translateText('common.confirm', 'Confirm')}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SubcategoryPopup;
