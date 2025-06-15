
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import CategoryIcon from '@/components/ui/category-icon';

interface AestheticCategoryCardProps {
  catId: string;
  category: {
    name: string;
    icon: string;
    color: string;
    subcategories: string[];
  };
  selectedSubs: string[];
  hasSelections: boolean;
  onSelect: () => void;
  onClear: () => void;
}

const AestheticCategoryCard: React.FC<AestheticCategoryCardProps> = ({
  catId,
  category,
  selectedSubs,
  hasSelections,
  onSelect,
  onClear,
}) => (
  <AestheticCard
    variant={hasSelections ? 'elevated' : 'default'}
    className={`cursor-pointer transition-all duration-300 ${
      hasSelections ? 'ring-2 ring-blue-400 bg-blue-50' : ''
    }`}
    onClick={onSelect}
  >
    <div className="text-center space-y-4">
      <CategoryIcon 
        icon={category.icon} 
        color={category.color} 
        size="lg"
        className="mx-auto"
      />
      
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500">
          {category.subcategories.length} specializations
        </p>
      </div>

      {hasSelections && (
        <div className="mt-4 space-y-3">
          <div className="flex flex-wrap justify-center gap-2">
            {selectedSubs.map((sub) => (
              <Badge 
                key={sub} 
                variant="secondary" 
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1"
              >
                {sub}
              </Badge>
            ))}
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="flex items-center justify-center w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Selection
          </button>
        </div>
      )}
    </div>
  </AestheticCard>
);

export default AestheticCategoryCard;
