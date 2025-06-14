
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { getResponsiveTextSize, getFlexibleContainerClass, getResponsivePadding } from '@/utils/textSizing';

interface SubcategoryCardPopupProps {
  open: boolean;
  onClose: () => void;
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
}

const SubcategoryCardPopup: React.FC<SubcategoryCardPopupProps> = ({
  open,
  onClose,
  tempSelectedSubcategories,
  setTempSelectedSubcategories,
  onConfirm,
  category,
  translateCategory,
  translateText,
}) => {
  if (!category) return null;

  const handleSubcategoryToggle = (subcategory: string) => {
    setTempSelectedSubcategories(
      tempSelectedSubcategories.includes(subcategory)
        ? tempSelectedSubcategories.filter((s) => s !== subcategory)
        : tempSelectedSubcategories.length < 3
          ? [...tempSelectedSubcategories, subcategory]
          : tempSelectedSubcategories
    );
  };

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal && onClose()}>
      <DialogContent
        className="max-w-sm w-full rounded-3xl p-0 overflow-visible bg-white shadow-2xl flex flex-col"
        style={{ minHeight: 320, maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-1">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${category.color}`}>
              <span className="text-white text-xl">{category.icon}</span>
            </div>
            <div>
              <div className="font-bold text-base text-gray-900">
                {translateCategory(category.name)}
              </div>
              <div className="text-xs text-gray-500">
                {translateText('category.specializations', 'Specializations')}
              </div>
            </div>
          </div>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            onClick={onClose}
            aria-label="Close"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-5 pb-1 text-sm text-gray-500">
          {translateText('category.select_up_to_three', 'Select up to 3 specializations')}
        </div>
        {/* Subcategory Pills */}
        <div className="grid grid-cols-2 gap-3 px-5 py-4 overflow-y-auto"
             style={{ maxHeight: 250 }}>
          {category.subcategories.map((subcategory) => {
            const isSelected = tempSelectedSubcategories.includes(subcategory);
            const isDisabled = !isSelected && tempSelectedSubcategories.length >= 3;
            return (
              <button
                key={subcategory}
                type="button"
                disabled={isDisabled}
                className={`
                  group w-full transition
                  rounded-xl border
                  flex items-center gap-2
                  justify-between
                  ${getResponsivePadding(subcategory)}
                  ${getFlexibleContainerClass(subcategory, 'mx-auto')} 
                  ${isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow'
                    : isDisabled
                      ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-100'}
                `}
                onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                style={{minHeight: 42}}
              >
                <span className={`${getResponsiveTextSize(
                  subcategory,
                  { baseSize: 14, minSize: 12, maxSize: 16 }
                )} flex-1`}>
                  {subcategory}
                </span>
                {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </button>
            );
          })}
        </div>
        <div className="px-5 pb-4 pt-2 flex items-center justify-between border-t bg-white">
          <div className="text-xs text-gray-500">
            {tempSelectedSubcategories.length}/3 {translateText('category.selected', 'selected')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl text-sm px-3 py-2">
              {translateText('common.cancel', 'Cancel')}
            </Button>
            <Button onClick={onConfirm} className="rounded-xl text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white">
              {translateText('common.confirm', 'Confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;

