
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';
import { getResponsiveTextSize, getFlexibleContainerClass, getResponsivePadding } from '@/utils/textSizing';
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

  // Calculate dynamic height based on number of subcategories
  // On mobile: fixed min, max at 80vh, auto scroll with soft insets
  // On desktop: minHeight 320, maxHeight 480-90vh
  const subcategoryCount = category.subcategories.length;
  const baseHeight = isMobile ? Math.min(128 + subcategoryCount * 48, window.innerHeight * 0.8) : Math.min(220 + subcategoryCount * 44, 520);

  // Responsive grid columns
  const getColumns = () => {
    if (subcategoryCount >= 10) return '1fr 1fr';
    if (subcategoryCount >= 5 && !isMobile) return '1fr 1fr';
    return '1fr';
  };

  // Reusable content
  const RenderPopupContent = (
    <div
      style={{
        minWidth: isMobile ? '100%' : undefined,
        minHeight: isMobile ? undefined : 320,
        maxHeight: isMobile ? '80vh' : '90vh',
        height: isMobile ? 'auto' : baseHeight,
        boxShadow: isMobile
          ? '0 -18px 50px 0px rgba(56,56,100,0.13)'
          : '0px 14px 40px 0px rgba(38,54,106,0.14), 0 2px 8px 0 rgba(0,0,0,0.04)'
      }}
      className={`bg-white w-full relative p-0 flex flex-col justify-between rounded-t-3xl ${isMobile ? 'rounded-b-none animate-slide-in-right' : 'rounded-3xl animate-fade-in'} border border-blue-100 overflow-hidden shadow-2xl`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-6 pt-5 pb-2 ${isMobile ? 'pb-2 pt-4 px-4' : ''}`}>
        <div className="flex items-center gap-2">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-r ${category.color} shadow-md`}>
            <span className="text-white text-2xl">{category.icon}</span>
          </div>
          <div className="ml-1">
            <div className="font-bold text-lg text-gray-900">
              {translateCategory(category.name)}
            </div>
            <div className="text-[0.81rem] text-gray-500">
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
      <div className={`px-6 pb-1 text-sm text-gray-500 text-center ${isMobile ? 'px-4' : ''}`}>
        {translateText('category.select_up_to_three', 'Select up to 3 specializations')}
      </div>
      {/* Subcategory Flexible "Pills" */}
      <div
        className={`grid overflow-y-auto ${isMobile ? 'px-3 py-2 gap-2' : ''}`}
        style={{
          gridTemplateColumns: getColumns(),
          gap: isMobile ? "0.55rem" : "0.85rem",
          padding: isMobile ? undefined : "1.4rem 1.5rem 1.15rem 1.5rem",
          maxHeight: isMobile ? '45vh' : (220 + Math.floor(subcategoryCount / 6) * 24)
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
                select-none rounded-full border transition
                flex items-center gap-2 justify-between
                font-medium
                ${isMobile
                  ? 'px-4 py-[0.8rem] text-base'
                  : 'px-5 py-2'}
                ${isSelected
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400 text-blue-700 font-semibold shadow-md'
                  : isDisabled
                    ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed'
                    : 'bg-gray-50 border-gray-200 hover:bg-blue-100'
                }
                hover:scale-[1.05] focus:ring-2 focus:ring-blue-300
              `}
              style={{
                minWidth: isMobile ? 110 : 120,
                maxWidth: isMobile ? 230 : 260,
                minHeight: isMobile ? 46 : 42,
                fontSize: isMobile ? 'clamp(16px, 4vw, 19px)' : 'clamp(14px, 2.5vw, 17px)'
              }}
              onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
              tabIndex={0}
              aria-pressed={!!isSelected}
              aria-disabled={isDisabled}
            >
              <span className="flex-1 break-words text-center">
                {subcategory}
              </span>
              {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
            </button>
          );
        })}
      </div>
      <div className={`w-full border-t bg-white flex items-center justify-between ${isMobile ? 'px-4 pb-4 pt-2' : 'px-6 pb-5 pt-3'} rounded-b-3xl`}>
        <div className="text-xs text-gray-500">
          {tempSelectedSubcategories.length}/3 {translateText('category.selected', 'selected')}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="rounded-xl text-sm px-3 py-2">
            {translateText('common.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={onConfirm}
            className={`
              rounded-xl text-sm px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-150
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

  // Choose Sheet for mobile, Dialog for desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={val => !val && onClose()}>
        <SheetContent side="bottom" className="w-full max-w-full p-0 bg-transparent border-0">
          {RenderPopupContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal && onClose()}>
      <DialogContent
        className="max-w-full w-auto rounded-3xl p-0 overflow-visible bg-white shadow-2xl flex flex-col border border-blue-100 animate-fade-in"
        style={{
          minWidth: 350,
          minHeight: 320,
          maxHeight: "90vh",
          boxShadow: "0px 14px 40px 0px rgba(38,54,106,0.14), 0 2px 8px 0 rgba(0,0,0,0.04)"
        }}
      >
        {RenderPopupContent}
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;
