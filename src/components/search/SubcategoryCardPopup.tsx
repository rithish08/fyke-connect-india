import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
  // Always use Dialog, not Sheet, to float as a card above the content
  if (!category) return null;

  // Limit max rows displayed, otherwise scroll; dynamic sizing
  const MAX_HEIGHT = 400; // px, approx 7 pills per column
  const isMobile = useIsMobile();

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
        className={`
          p-0 border-none shadow-xl bg-white
          !rounded-2xl max-w-md w-full
          transition-all
          animate-fade-in
        `}
        style={{
          minWidth: isMobile ? 290 : 360,
          maxWidth: 400,
          padding: 0,
          background: '#fff',
          border: 'none',
          boxShadow: '0 6px 32px 0 rgba(23,36,61,.13)',
          margin: 0,
          bottom: isMobile ? 'env(safe-area-inset-bottom,24px)' : undefined
        }}
      >
        {/* Card Container */}
        <div
          className={`
            rounded-2xl border border-gray-100 bg-white shadow-lg
            flex flex-col items-stretch
            transition-all w-full max-w-full
            relative
          `}
          style={{
            padding: isMobile ? '20px 10px 18px 10px' : '32px 26px 24px 26px',
            minWidth: isMobile ? 246 : 340,
            minHeight: 180,
            maxHeight: isMobile ? '78vh' : 400,
          }}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none"
            onClick={onClose}
            aria-label="Close popup"
            type="button"
            tabIndex={0}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-r ${category.color} shadow`}>
              <span className="text-white text-lg">{category.icon}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base text-gray-900 truncate mb-0.5">
                {translateCategory(category.name)}
              </span>
              <span className="text-xs text-gray-400 font-light tracking-wide">
                {translateText('category.specializations', 'Specializations')}
              </span>
            </div>
          </div>
          {/* Instruction */}
          <div className="mb-2 text-xs text-gray-600">
            {translateText('category.select_up_to_three', 'Select up to 3 specializations')}
          </div>

          {/* Pills */}
          <div
            className={`
              flex flex-wrap gap-2 w-full px-1 py-1 overflow-y-auto
              transition-all
            `}
            style={{
              minHeight: 44,
              maxHeight: isMobile ? '30vh' : 180,
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
                    rounded-full border font-medium select-none
                    transition-all duration-150
                    flex items-center px-4 py-1
                    shadow-sm
                    ${isSelected
                      ? 'bg-blue-600 text-white border-blue-500'
                      : isDisabled
                        ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-blue-50 text-blue-800 border-blue-100 hover:bg-blue-100'
                    }
                    ${isSelected ? 'scale-105' : ''}
                    `}
                  style={{
                    fontSize: '0.96rem',
                    minWidth: 64,
                    maxWidth: 160,
                    outline: isSelected ? '2px solid #3b82f6' : 'none',
                  }}
                  onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                  tabIndex={0}
                  aria-pressed={!!isSelected}
                  aria-disabled={isDisabled}
                >
                  <span className="truncate">{subcategory}</span>
                  {isSelected && (
                    <span className="ml-1.5 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                      <span className="block w-2 h-2 bg-blue-600 rounded-full" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions Footer */}
          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-600">
              {tempSelectedSubcategories.length}/3 {translateText('category.selected', 'selected')}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={onClose}
                className="rounded-full text-xs font-medium px-3 py-1"
              >
                {translateText('common.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={onConfirm}
                className={`
                  rounded-full text-xs font-semibold px-4 py-1.5 shadow bg-blue-600 hover:bg-blue-700 text-white
                  ${tempSelectedSubcategories.length === 0 ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                disabled={tempSelectedSubcategories.length === 0}
              >
                {translateText('common.confirm', 'Confirm')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;
