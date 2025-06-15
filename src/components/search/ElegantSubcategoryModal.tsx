
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ElegantModal from '@/components/ui/elegant-modal';
import SelectionButton from '@/components/ui/selection-button';
import CategoryIcon from '@/components/ui/category-icon';

interface Category {
  name: string;
  icon: string;
  color: string;
  subcategories: string[];
}

interface ElegantSubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | undefined;
  selectedSubcategories: string[];
  onSubcategoryToggle: (subcategory: string) => void;
  onConfirm: () => void;
}

const ElegantSubcategoryModal: React.FC<ElegantSubcategoryModalProps> = ({
  isOpen,
  onClose,
  category,
  selectedSubcategories,
  onSubcategoryToggle,
  onConfirm
}) => {
  if (!category) return null;

  const handleConfirmAndClose = () => {
    onConfirm();
    onClose();
  };

  return (
    <ElegantModal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Specializations"
      subtitle="Select up to 3 areas that match your expertise"
      className="max-w-lg"
    >
      <div className="space-y-6">
        {/* Category Header */}
        <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
          <CategoryIcon icon={category.icon} color={category.color} size="md" />
          <div>
            <h4 className="font-bold text-gray-900">{category.name}</h4>
            <p className="text-sm text-gray-600">{category.subcategories.length} specializations available</p>
          </div>
        </div>

        {/* Subcategory Selection */}
        <div className="space-y-3">
          {category.subcategories.map(subcategory => (
            <SelectionButton
              key={subcategory}
              label={subcategory}
              selected={selectedSubcategories.includes(subcategory)}
              disabled={!selectedSubcategories.includes(subcategory) && selectedSubcategories.length >= 3}
              onClick={() => onSubcategoryToggle(subcategory)}
            />
          ))}
        </div>

        {/* Selected Count */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <span className="text-sm font-medium text-gray-700">
            Selected Specializations
          </span>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {selectedSubcategories.length}/3
            </Badge>
          </div>
        </div>

        {/* Selected Tags */}
        {selectedSubcategories.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Your Selections:</p>
            <div className="flex flex-wrap gap-2">
              {selectedSubcategories.map(sub => (
                <Badge key={sub} variant="default" className="bg-blue-500 text-white">
                  {sub}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAndClose}
            disabled={selectedSubcategories.length === 0}
            className="flex-1 h-12 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Confirm {selectedSubcategories.length > 0 && `(${selectedSubcategories.length})`}
          </Button>
        </div>
      </div>
    </ElegantModal>
  );
};

export default ElegantSubcategoryModal;
