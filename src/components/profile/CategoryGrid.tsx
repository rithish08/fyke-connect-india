
import { ChevronRight } from 'lucide-react';
import { categories } from '@/data/categories';

interface CategoryGridProps {
  selectedCategory: string;
  selectedSubcategories: string[];
  onCategorySelect: (categoryName: string) => void;
}

const CategoryGrid = ({ selectedCategory, selectedSubcategories, onCategorySelect }: CategoryGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map(cat => (
        <button
          key={cat.name}
          className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 transform ${
            selectedCategory === cat.name 
              ? "border-blue-500 bg-blue-50 shadow-lg scale-105 z-10" 
              : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-102"
          }`}
          onClick={() => onCategorySelect(cat.name)}
          type="button"
        >
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 rounded-2xl`} />
          
          <div className="relative">
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</div>
            <div className="text-xs text-gray-500 mb-2">
              {cat.subcategories.length} specializations
            </div>
            
            {selectedCategory === cat.name && selectedSubcategories.length > 0 && (
              <div className="text-xs text-blue-600 font-medium">
                {selectedSubcategories.length} selected
              </div>
            )}
            
            {selectedCategory === cat.name && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default CategoryGrid;
