import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';
import { Button } from '@/components/ui/button';
import StickyActionButton from '@/components/ui/StickyActionButton';
import JobSearchBreadcrumbs from './JobSearchBreadcrumbs';

interface JobSearchCategoryViewProps {
  onSelectionComplete: (selectedCategories: { [catId: string]: string[] }) => void;
}

const JobSearchCategoryView = ({ onSelectionComplete }: JobSearchCategoryViewProps) => {
  const { user } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<{ [catId: string]: string[] }>({});

  const handleCategorySelect = (_categoryId: string) => {
    // Handled in EnhancedCategoryModal - opens sheet
  };

  const handleSubcategorySelect = (categoryId: string, subcategories: string[]) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: subcategories
    }));
  };

  const handleClear = (categoryId: string) => {
    setSelectedCategories(prev => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });
  };

  // Enable "Search" if at least one category with subcategory is selected
  const hasSelected = Object.values(selectedCategories).some((arr) => arr.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <JobSearchBreadcrumbs
            currentStep="category"
            selectedCategory={null}
            selectedSubcategories={undefined}
            onStepChange={() => {}} // At first step, do nothing
          />
          <h1 className="text-xl font-bold text-gray-900">
            Find Workers by Category
          </h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-6">
        <EnhancedCategoryModal
          selectedCategories={selectedCategories}
          onCategorySelect={handleCategorySelect}
          onSubcategorySelect={handleSubcategorySelect}
          onClear={handleClear}
        />
      </div>
      <StickyActionButton
        disabled={!hasSelected}
        onClick={() => onSelectionComplete(selectedCategories)}
      >
        {user?.role === 'employer' ? 'Search Workers' : 'Search Jobs'}
      </StickyActionButton>
      <BottomNavigation />
    </div>
  );
};

export default JobSearchCategoryView;
