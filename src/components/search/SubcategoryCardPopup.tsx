
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

  // Estimate card width based on subcategory text lengths for flexibility
  const longestSub = Math.max(...category.subcategories.map(str => str.length));
  const cardMinWidth = Math.min(360 + longestSub * 8, 480);

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal && onClose()}>
      <DialogContent
        className="max-w-full w-auto rounded-3xl p-0 overflow-visible bg-white shadow-2xl flex flex-col"
        style={{
          minWidth: cardMinWidth,
          minHeight: 320,
          maxHeight: "90vh",
        }}
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
        {/* Subcategory Flexible "Pills" */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: category.subcategories.length > 4 ? '1fr 1fr' : '1fr',
            gap: "0.75rem",
            padding: "1.2rem 1.2rem 1rem 1.2rem",
            overflowY: "auto",
            maxHeight: 230,
          }}
        >
          {category.subcategories.map((subcategory) => {
            const isSelected = tempSelectedSubcategories.includes(subcategory);
            const isDisabled = !isSelected && tempSelectedSubcategories.length >= 3;
            return (
              <button
                key={subcategory}
                type="button"
                disabled={isDisabled}
                className={`
                  transition
                  rounded-full border
                  flex items-center gap-2
                  justify-between px-4 py-2
                  ${getFlexibleContainerClass(subcategory, 'mx-auto')}
                  ${isSelected
                    ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold shadow'
                    : isDisabled
                        ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-200 hover:bg-blue-100'
                  }
                `}
                style={{
                  minWidth: 110,
                  maxWidth: 220,
                  minHeight: 38,
                  fontSize: 'clamp(13px, 2.5vw, 17px)'
                }}
                onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
              >
                <span className={`${getResponsiveTextSize(
                  subcategory,
                  { baseSize: 15, minSize: 13, maxSize: 17 }
                )} flex-1 break-words text-center`}>
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
