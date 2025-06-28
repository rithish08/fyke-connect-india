import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';
import CategoryCard from './CategoryCard';
import SubcategoryCardPopup from './SubcategoryCardPopup';
import { useCategories } from '@/hooks/useCategories';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface EnhancedCategoryModalProps {
  selectedCategories: { [catId: string]: string[] };
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (categoryId: string, subcategories: string[]) => void;
  onClear: (categoryId: string) => void;
}

const EnhancedCategoryModal: React.FC<EnhancedCategoryModalProps> = ({
  selectedCategories,
  onCategorySelect,
  onSubcategorySelect,
  onClear,
}) => {
  const { translateCategory, translateText } = useTranslation();
  const { categories, loading, error } = useCategories();
  const [popupCategoryId, setPopupCategoryId] = useState<string | null>(null);
  const [tempSelectedSubcategories, setTempSelectedSubcategories] = useState<string[]>([]);

  const openSubcategoryPopup = (categoryId: string) => {
    const already = selectedCategories[categoryId] || [];
    setPopupCategoryId(categoryId);
    setTempSelectedSubcategories([...already]);
    // Call category select so ProfileCategoryStep stays in sync
    if (onCategorySelect) onCategorySelect(categoryId);
  };

  const closePopup = () => {
    setPopupCategoryId(null);
    setTempSelectedSubcategories([]);
  };

  const handleConfirm = () => {
    if (popupCategoryId) {
      onSubcategorySelect(popupCategoryId, tempSelectedSubcategories);
    }
    closePopup();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
        <span className="ml-2">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Error loading categories: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const translatedName = translateCategory(category.name);
          const catId = category.id;
          const selectedSubs = selectedCategories[catId] || [];
          const hasSelections = selectedSubs.length > 0;
          const categoryTextSize = getResponsiveTextSize(translatedName, {
            baseSize: 14,
            minSize: 11,
            maxSize: 15
          });
          
          // Create a category object that matches the expected interface
          const categoryObj = {
            name: category.name,
            icon: category.icon || '🏢',
            color: 'from-blue-400 to-indigo-500', // Default color
            subcategories: [] // Will be populated by subcategories hook
          };
          
          return (
            <CategoryCard
              key={catId}
              catId={catId}
              category={categoryObj}
              translatedName={translatedName}
              selectedSubs={selectedSubs}
              hasSelections={hasSelections}
              categoryTextSize={categoryTextSize}
              flexibleClass={getFlexibleContainerClass(translatedName, 'mx-auto')}
              openSubcategoryPopup={openSubcategoryPopup}
              onClear={onClear}
            />
          );
        })}
      </div>
      {/* Subcategory Selection Card Popup */}
      <SubcategoryCardPopup
        open={!!popupCategoryId}
        onClose={closePopup}
        tempSelectedSubcategories={tempSelectedSubcategories}
        setTempSelectedSubcategories={setTempSelectedSubcategories}
        onConfirm={handleConfirm}
        category={
          popupCategoryId
            ? categories.find((cat) => cat.id === popupCategoryId)
            : undefined
        }
        translateCategory={translateCategory}
        translateText={translateText}
      />
    </div>
  );
};

export default EnhancedCategoryModal;
