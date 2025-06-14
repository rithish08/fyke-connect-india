
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CategoryData {
  name: string;
  icon: string;
  subcategories: string[];
}

interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryData: CategoryData;
  selectedSubcategories: string[];
  onSubcategoryToggle: (subcategory: string) => void;
}

const SubcategoryModal = ({
  isOpen,
  onClose,
  categoryData,
  selectedSubcategories,
  onSubcategoryToggle
}: SubcategoryModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center">
            <span className="text-2xl mr-2">{categoryData.icon}</span>
            Choose Specializations
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">
          Select up to 3 specializations that match your expertise
        </p>
        
        <div className="grid grid-cols-1 gap-2 mb-6">
          {categoryData.subcategories.map(sub => (
            <button
              key={sub}
              className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                selectedSubcategories.includes(sub)
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : selectedSubcategories.length >= 3
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
              onClick={() => onSubcategoryToggle(sub)}
              disabled={!selectedSubcategories.includes(sub) && selectedSubcategories.length >= 3}
              type="button"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{sub}</span>
                {selectedSubcategories.includes(sub) && (
                  <span className="text-blue-500 font-bold">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-500 mb-4 text-center">
          {selectedSubcategories.length}/3 specializations selected
        </div>

        <Button
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
        >
          Done {selectedSubcategories.length > 0 && `(${selectedSubcategories.length} selected)`}
        </Button>
      </div>
    </div>
  );
};

export default SubcategoryModal;
