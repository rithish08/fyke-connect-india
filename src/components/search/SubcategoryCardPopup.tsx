
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, CheckCircle2 } from 'lucide-react';
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

  return (
    <Dialog open={open} onOpenChange={openVal => !openVal && onClose()}>
      <DialogContent
        className="p-0 border-none shadow-xl bg-white !rounded-2xl max-w-xs sm:max-w-sm w-full mx-4"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.2)',
        }}
      >
        <div className="relative p-4 sm:p-5">
          {/* Close Button */}
          <button
            className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-colors"
            onClick={onClose}
            aria-label="Close popup"
          >
            <X className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-r ${category.color} shadow-md`}>
                <span className="text-white text-lg">{category.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  {translateCategory(category.name)}
                </h3>
                <p className="text-xs text-gray-500">
                  {translateText('category.select_specializations', 'Select specializations')}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-100">
              <p className="text-xs font-medium text-blue-800">
                {translateText('category.select_up_to_three', 'Choose up to 3 areas')}
              </p>
            </div>
          </div>

          {/* Subcategory Grid */}
          <div className="space-y-2 mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {category.subcategories.map((subcategory) => {
              const isSelected = tempSelectedSubcategories.includes(subcategory);
              const isDisabled = !isSelected && tempSelectedSubcategories.length >= 3;
              
              return (
                <button
                  key={subcategory}
                  type="button"
                  disabled={isDisabled}
                  className={`
                    w-full p-2.5 rounded-lg border-2 text-left transition-all duration-200
                    flex items-center justify-between group
                    ${isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-[1.01]'
                      : isDisabled
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }
                  `}
                  onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                >
                  <span className={`font-medium text-xs ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {subcategory}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selection Counter */}
          <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 mb-4">
            <span className="text-xs font-medium text-gray-700">
              {translateText('category.selected', 'Selected')}
            </span>
            <div className={`px-2 py-1 rounded-full text-xs font-bold ${
              tempSelectedSubcategories.length > 0 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {tempSelectedSubcategories.length}/3
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9 rounded-lg text-xs border-2 hover:bg-gray-50"
            >
              {translateText('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={tempSelectedSubcategories.length === 0}
              className="flex-1 h-9 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold text-xs"
            >
              {translateText('common.confirm', 'Confirm')} 
              {tempSelectedSubcategories.length > 0 && ` (${tempSelectedSubcategories.length})`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;
