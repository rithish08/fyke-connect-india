
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CategoryCardProps {
  catId: string;
  category: {
    name: string;
    icon: React.ReactNode;
    color: string;
    subcategories: string[];
  };
  translatedName: string;
  selectedSubs: string[];
  hasSelections: boolean;
  categoryTextSize: string;
  flexibleClass: string;
  openSubcategoryPopup: (catId: string) => void;
  onClear: (catId: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  catId,
  category,
  translatedName,
  selectedSubs,
  hasSelections,
  categoryTextSize,
  flexibleClass,
  openSubcategoryPopup,
  onClear,
}) => (
  <div
    className={`relative bg-white rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all duration-300 border border-gray-200 ${hasSelections ? 'ring-2 ring-blue-400' : ''}`}
    style={{
      minHeight: hasSelections ? 140 + selectedSubs.length * 22 : 120,
      transition: 'min-height 0.15s',
    }}
    onClick={() => openSubcategoryPopup(catId)}
  >
    <div className="text-center space-y-3">
      <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center shadow-lg text-2xl`}>
        {category.icon}
      </div>
      <div>
        <h3 className={`font-semibold text-gray-900 ${categoryTextSize} ${flexibleClass}`}>
          {translatedName}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {category.subcategories.length} types
        </p>
      </div>
    </div>
    {hasSelections && (
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {selectedSubs.map((sub) => (
          <Badge key={sub} variant="secondary" className="bg-blue-100 text-blue-800 rounded-full text-xs px-2 py-1">
            {sub}
          </Badge>
        ))}
        <button
          title="Clear selection"
          onClick={e => { e.stopPropagation(); onClear(catId); }}
          className="ml-1 text-gray-400 hover:text-gray-600"
          aria-label="Clear selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )}
  </div>
);

export default CategoryCard;
