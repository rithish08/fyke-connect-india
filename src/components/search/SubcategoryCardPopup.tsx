
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
        className="p-0 border-none shadow-2xl bg-white !rounded-3xl max-w-sm w-full mx-4"
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
        }}
      >
        <div className="relative p-6">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-100/80 hover:bg-gray-200/80 transition-all duration-200 hover:scale-105"
            onClick={onClose}
            aria-label="Close popup"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-r ${category.color} shadow-lg`}>
                <span className="text-white text-xl">{category.icon}</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {translateCategory(category.name)}
                </h3>
                <p className="text-sm text-gray-500">
                  {translateText('category.select_specializations', 'Select your specializations')}
                </p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
              <p className="text-xs font-medium text-blue-800">
                {translateText('category.select_up_to_three', 'Choose up to 3 areas that match your skills')}
              </p>
            </div>
          </div>

          {/* Subcategory Grid */}
          <div className="space-y-2 mb-6" style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {category.subcategories.map((subcategory) => {
              const isSelected = tempSelectedSubcategories.includes(subcategory);
              const isDisabled = !isSelected && tempSelectedSubcategories.length >= 3;
              
              return (
                <button
                  key={subcategory}
                  type="button"
                  disabled={isDisabled}
                  className={`
                    w-full p-3 rounded-xl border-2 text-left transition-all duration-200
                    flex items-center justify-between group
                    ${isSelected
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-[1.02]'
                      : isDisabled
                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:scale-[1.01]'
                    }
                  `}
                  onClick={() => !isDisabled && handleSubcategoryToggle(subcategory)}
                >
                  <span className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                    {subcategory}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="space-y-4">
            {/* Selection Counter */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-medium text-gray-700">
                {translateText('category.selected', 'Selected')}
              </span>
              <div className="flex items-center gap-2">
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  tempSelectedSubcategories.length > 0 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tempSelectedSubcategories.length}/3
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 rounded-xl border-2 hover:bg-gray-50"
              >
                {translateText('common.cancel', 'Cancel')}
              </Button>
              <Button
                onClick={onConfirm}
                disabled={tempSelectedSubcategories.length === 0}
                className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold shadow-lg"
              >
                {translateText('common.confirm', 'Confirm')} 
                {tempSelectedSubcategories.length > 0 && ` (${tempSelectedSubcategories.length})`}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubcategoryCardPopup;
