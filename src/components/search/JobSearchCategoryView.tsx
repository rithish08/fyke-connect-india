import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { categories as allCategories } from '@/data/categories';
import { FloatingCard } from '@/components/ui/floating-card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, Users, Briefcase, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { Category } from '@/types/job';

interface JobSearchCategoryViewProps {
  currentView: 'categories' | 'subcategories';
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
  onSubcategorySelect: (subcategories: string[]) => void;
  onBack: () => void;
}

const JobSearchCategoryView = ({
  currentView,
  selectedCategory,
  onCategorySelect,
  onSubcategorySelect,
  onBack,
}: JobSearchCategoryViewProps) => {
  const { user } = useAuth();
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const isEmployer = user?.role === 'employer';

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories((prev) =>
      prev.includes(subcategory)
        ? prev.filter((s) => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleSearch = () => {
    if (selectedSubcategories.length > 0) {
      onSubcategorySelect(selectedSubcategories);
    }
  };

  const renderHeader = () => {
    const isSubcategoryView = currentView === 'subcategories' && selectedCategory;
    const title = isSubcategoryView ? `Specializations in ${selectedCategory.name}` : (isEmployer ? 'Find Workers by Category' : 'Find Jobs by Category');
    const IconComponent = isEmployer ? Users : Briefcase;

    return (
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-2">
          {isSubcategoryView ? (
            <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <IconComponent className="w-6 h-6 text-white" />
            </div>
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        </div>
        <p className="text-gray-600 text-sm">
          {isSubcategoryView
            ? 'Select one or more specializations to continue.'
            : isEmployer
            ? 'Select a category to find skilled workers in your area.'
            : 'Select a category to find jobs that match your skills.'}
        </p>
      </div>
    );
  };

  const renderCategoryList = () => (
    <div className="grid grid-cols-2 gap-3 p-4">
      {allCategories.map((category) => (
        <FloatingCard
          key={category.id}
          variant="elevated"
          size="sm"
          className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-md bg-white"
          onClick={() => onCategorySelect(category)}
        >
          <div className="text-center space-y-3">
            <div className="text-3xl">{category.icon}</div>
            <div>
              <h3 className="font-semibold text-sm text-gray-900">{category.name}</h3>
              <p className="text-xs text-gray-600">{category.subcategories.length} specializations</p>
            </div>
          </div>
        </FloatingCard>
      ))}
    </div>
  );

  const renderSubcategoryList = () => {
    if (!selectedCategory) return null;
    return (
      <div className="p-4 space-y-3">
        {selectedCategory.subcategories.map((subcategory) => {
          const isSelected = selectedSubcategories.includes(subcategory);
          return (
            <FloatingCard
              key={subcategory}
              variant={isSelected ? "glow" : "elevated"}
              size="sm"
              className={`cursor-pointer transition-all w-full text-left ${
                isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white'
              }`}
              onClick={() => handleSubcategoryToggle(subcategory)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">{subcategory}</span>
                {isSelected && <Badge variant="secondary" className="bg-blue-100 text-blue-800">Selected</Badge>}
              </div>
            </FloatingCard>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {renderHeader()}
      {currentView === 'categories' ? renderCategoryList() : renderSubcategoryList()}

      {currentView === 'subcategories' && selectedSubcategories.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-50 p-4">
          <div className="w-full max-w-lg mx-auto">
            <Button
              onClick={handleSearch}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl"
            >
              <Search className="w-5 h-5 mr-2" />
              Show Results
            </Button>
          </div>
        </div>
      )}
      <BottomNavigation />
    </div>
  );
};

export default JobSearchCategoryView;
