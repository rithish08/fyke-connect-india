
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight } from 'lucide-react';

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
    className={`
      relative bg-white rounded-2xl p-4 cursor-pointer transition-all duration-300 
      border-2 group hover:shadow-xl hover:scale-[1.02]
      ${hasSelections 
        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg ring-2 ring-blue-200' 
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
      }
    `}
    style={{
      minHeight: hasSelections ? 160 + selectedSubs.length * 24 : 140,
    }}
    onClick={() => openSubcategoryPopup(catId)}
  >
    {/* Selection Indicator */}
    {hasSelections && (
      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
        <ArrowRight className="w-3 h-3 text-white" />
      </div>
    )}

    <div className="text-center space-y-3">
      {/* Category Icon */}
      <div className={`
        w-14 h-14 mx-auto rounded-2xl bg-gradient-to-r ${category.color} 
        flex items-center justify-center shadow-lg text-2xl
        transition-transform duration-300 group-hover:scale-110
      `}>
        {category.icon}
      </div>
      
      {/* Category Info */}
      <div>
        <h3 className={`font-bold text-gray-900 ${categoryTextSize} ${flexibleClass} mb-1`}>
          {translatedName}
        </h3>
        <p className="text-xs text-gray-500">
          {category.subcategories.length} specializations
        </p>
      </div>

      {/* Selected Subcategories */}
      {hasSelections && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap justify-center gap-2">
            {selectedSubs.map((sub) => (
              <Badge 
                key={sub} 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full border border-blue-200"
              >
                {sub}
              </Badge>
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear(catId);
            }}
            className="flex items-center justify-center w-full py-2 text-xs text-gray-500 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
          >
            <X className="w-3 h-3 mr-1" />
            Clear Selection
          </button>
        </div>
      )}

      {/* Hover Effect Arrow */}
      {!hasSelections && (
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
            <ArrowRight className="w-3 h-3 text-blue-600" />
          </div>
        </div>
      )}
    </div>
  </div>
);

export default CategoryCard;
