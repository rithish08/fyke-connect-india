
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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

  // Dynamic height based on content
  const MIN_HEIGHT = isMobile ? 260 : 300;
  const baseHeight = MIN_HEIGHT + Math.ceil(category.subcategories.length / (isMobile ? 2 : 3)) * 45;
  const MAX_HEIGHT = isMobile ? window.innerHeight * 0.75 : 520;

  const PopupContent = (
    <div
      className={`
        bg-white w-full relative flex flex-col justify-between
        rounded-2xl border
        shadow-lg
        ${isMobile ? 'px-3 pt-4 pb-3' : 'px-8 pt-7 pb-6'}
        animate-fade-in
        `}
      style={{
        minHeight: MIN_HEIGHT,
        maxHeight: MAX_HEIGHT,
        height: Math.min(baseHeight, MAX_HEIGHT),
        borderColor: '#cebbaa',
        boxShadow: '0 4px 32px 0 rgba(79,60,61,0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r ${category.color} shadow`}>
            <span className="text-white text-lg">{category.icon}</span>
          </div>
          <div>
            <div className="font-semibold text-base text-gray-900">
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
          tabIndex={0}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Instruction */}
      <div className="mb-2 text-xs text-gray-600">{translateText('category.select_up_to_three', 'Select up to 3 specializations')}</div>
      {/* Pills List */}
      <div
        className={`
          flex flex-wrap gap-2 w-full items-center justify-start
          rounded-xl px-1 py-2
        `}
        style={{
          minHeight: 46,
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
                rounded-full border transition font-semibold flex items-center
                px-4 py-2 mb-1
                shadow-sm
                ${isSelected
                  ? 'bg-neutral-900 text-white border-neutral-700'
                  : isDisabled
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-200'
                }
                ${isSelected ? 'scale-105' : ''}
                `}
              style={{
                minWidth: 70,
                maxWidth: 180,
                fontSize: '1rem',
                outline: isSelected ? '2px solid #453822' : 'none',
              }}
              onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
              tabIndex={0}
              aria-pressed={!!isSelected}
              aria-disabled={isDisabled}
            >
              <span className="mx-auto">{subcategory}</span>
            </button>
          );
        })}
      </div>
      {/* Actions */}
      <div className="mt-4 w-full flex items-center justify-between gap-1">
        <div className="text-xs text-gray-500">
          {tempSelectedSubcategories.length}/3 {translateText('category.selected', 'selected')}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-xs font-semibold px-3 py-1">
            {translateText('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className={`
              rounded-xl text-xs font-semibold px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white shadow
              ${tempSelectedSubcategories.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            disabled={tempSelectedSubcategories.length === 0}
          >
            {translateText('common.confirm', 'Confirm')}
          </Button>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={val => !val && onClose()}>
        <SheetContent side="bottom" className="w-full max-w-full p-0 bg-transparent border-0">
          {PopupContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal && onClose()}>
      <DialogContent
        className="max-w-lg w-auto rounded-3xl p-0 bg-transparent shadow-2xl border-none animate-fade-in"
        style={{
          minWidth: 350,
          minHeight: MIN_HEIGHT,
          maxHeight: "90vh",
          boxShadow: "0px 14px 40px 0px rgba(38,54,106,0.14), 0 2px 8px 0 rgba(0,0,0,0.04)"
        }}
      >
        {PopupContent}
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;
