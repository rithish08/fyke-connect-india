
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';
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

  const hasSelected = Object.values(selectedCategories).some((arr) => arr.length > 0);
  const selectedCount = Object.values(selectedCategories).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <JobSearchBreadcrumbs
            currentStep="category"
            selectedCategory={null}
            selectedSubcategories={undefined}
            onStepChange={() => {}}
          />
          <div className="flex items-center justify-between mt-2">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {user?.role === 'employer' ? 'Find Workers by Category' : 'Find Jobs by Category'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Select categories that match your {user?.role === 'employer' ? 'hiring needs' : 'skills'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{selectedCount}</div>
              <div className="text-xs text-gray-500">selected</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-6">
        {/* Category Selection */}
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
        className={hasSelected ? "bg-blue-600 hover:bg-blue-700" : ""}
      >
        {!hasSelected 
          ? 'Select categories to continue'
          : `Search ${selectedCount} ${user?.role === 'employer' ? 'Worker' : 'Job'} Type${selectedCount > 1 ? 's' : ''}`
        }
      </StickyActionButton>
      <BottomNavigation />
    </div>
  );
};

export default JobSearchCategoryView;
