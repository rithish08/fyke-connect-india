import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResponsiveTextSize, getFlexibleContainerClass } from '@/utils/textSizing';
import CategoryCard from './CategoryCard';
import SubcategoryCardPopup from './SubcategoryCardPopup';
import { categories } from '@/data/categories';

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

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const translatedName = translateCategory(category.name);
          const catId = category.name.toLowerCase();
          const selectedSubs = selectedCategories[catId] || [];
          const hasSelections = selectedSubs.length > 0;
          const categoryTextSize = getResponsiveTextSize(translatedName, {
            baseSize: 14,
            minSize: 11,
            maxSize: 15
          });
          return (
            <CategoryCard
              key={catId}
              catId={catId}
              category={category}
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
            ? categories.find((cat) => cat.name.toLowerCase() === popupCategoryId)
            : undefined
        }
        translateCategory={translateCategory}
        translateText={translateText}
      />
    </div>
  );
};

export default EnhancedCategoryModal;
