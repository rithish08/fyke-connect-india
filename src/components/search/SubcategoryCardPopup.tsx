
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

  // Compute dynamic width
  const longestSub = Math.max(...category.subcategories.map(str => str.length));
  const cardMinWidth = Math.min(390 + longestSub * 7, 520);

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal && onClose()}>
      <DialogContent
        className="max-w-full w-auto rounded-3xl p-0 overflow-visible bg-white shadow-2xl flex flex-col border border-blue-100 animate-fade-in"
        style={{
          minWidth: cardMinWidth,
          minHeight: 320,
          maxHeight: "90vh",
          boxShadow: "0px 14px 40px 0px rgba(38,54,106,0.14), 0 2px 8px 0 rgba(0,0,0,0.04)"
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            <div className={`w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-r ${category.color} shadow-lg`}>
              <span className="text-white text-2xl">{category.icon}</span>
            </div>
            <div className="ml-1">
              <div className="font-bold text-lg text-gray-900">
                {translateCategory(category.name)}
              </div>
              <div className="text-[0.82rem] text-gray-500">
                {translateText('category.specializations', 'Specializations')}
              </div>
            </div>
          </div>
          <button
            className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            onClick={onClose}
            aria-label="Close"
            type="button"
            tabIndex={0}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-1 text-sm text-gray-500 text-center">
          {translateText('category.select_up_to_three', 'Select up to 3 specializations')}
        </div>
        {/* Subcategory Flexible "Pills" */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: category.subcategories.length > 4 ? '1fr 1fr' : '1fr',
            gap: "0.85rem",
            padding: "1.35rem 1.5rem 1.15rem 1.5rem",
            overflowY: "auto",
            maxHeight: 230 + Math.floor(category.subcategories.length / 6) * 24,
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
                  rounded-full border shadow
                  flex items-center gap-2
                  justify-between px-5 py-2
                  ${isSelected
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-500 text-blue-700 font-semibold shadow-md'
                    : isDisabled
                      ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                      : 'bg-gray-50 border-gray-200 hover:bg-blue-100'
                  }
                  hover:scale-105 focus:ring-2 focus:ring-blue-300
                `}
                style={{
                  minWidth: 120,
                  maxWidth: 260,
                  minHeight: 42,
                  fontSize: 'clamp(14px, 2.5vw, 17px)'
                }}
                onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                tabIndex={0}
                aria-pressed={!!isSelected}
                aria-disabled={isDisabled}
              >
                <span className={`flex-1 break-words text-center font-medium`}>
                  {subcategory}
                </span>
                {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
              </button>
            );
          })}
        </div>
        <div className="px-6 pb-5 pt-3 flex items-center justify-between border-t bg-white rounded-b-3xl">
          <div className="text-xs text-gray-500">
            {tempSelectedSubcategories.length}/3 {translateText('category.selected', 'selected')}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="rounded-xl text-sm px-3 py-2">
              {translateText('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={onConfirm}
              className={`rounded-xl text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-150
                ${tempSelectedSubcategories.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              disabled={tempSelectedSubcategories.length === 0}
            >
              {translateText('common.confirm', 'Confirm')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;
