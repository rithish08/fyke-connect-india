
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StickyActionButton from '@/components/ui/StickyActionButton';
import JobSearchBreadcrumbs from './JobSearchBreadcrumbs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Target, Users } from 'lucide-react';

interface JobSearchCategoryViewProps {
  onSelectionComplete: (selectedCategories: { [catId: string]: string[] }) => void;
}

const JobSearchCategoryView = ({ onSelectionComplete }: JobSearchCategoryViewProps) => {
  const { user } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<{ [catId: string]: string[] }>({});
  const [searchStep, setSearchStep] = useState(1);

  const handleCategorySelect = (_categoryId: string) => {
    // Handled in EnhancedCategoryModal - opens sheet
  };

  const handleSubcategorySelect = (categoryId: string, subcategories: string[]) => {
    setSelectedCategories(prev => ({
      ...prev,
      [categoryId]: subcategories
    }));
    
    // Auto-advance step when user makes first selection
    if (searchStep === 1 && subcategories.length > 0) {
      setSearchStep(2);
    }
  };

  const handleClear = (categoryId: string) => {
    setSelectedCategories(prev => {
      const copy = { ...prev };
      delete copy[categoryId];
      return copy;
    });
  };

  // Calculate search progress
  const hasSelected = Object.values(selectedCategories).some((arr) => arr.length > 0);
  const selectedCount = Object.values(selectedCategories).reduce((acc, arr) => acc + arr.length, 0);
  const progressValue = hasSelected ? Math.min(100, (selectedCount / 3) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto p-4">
          <JobSearchBreadcrumbs
            currentStep="category"
            selectedCategory={null}
            selectedSubcategories={undefined}
            onStepChange={() => {}} // At first step, do nothing
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
          
          {/* Progress indicator */}
          {hasSelected && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Search Progress</span>
                <span>{Math.round(progressValue)}% ready</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-4 pb-6 space-y-4">
        {/* Smart Tips */}
        {searchStep === 1 && (
          <Alert className="border-blue-200 bg-blue-50">
            <Lightbulb className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Pro tip:</strong> Select multiple categories to see more {user?.role === 'employer' ? 'worker' : 'job'} opportunities
            </AlertDescription>
          </Alert>
        )}

        {searchStep === 2 && selectedCount >= 3 && (
          <Alert className="border-green-200 bg-green-50">
            <Target className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Great selection!</strong> You've chosen {selectedCount} specializations. Ready to search?
            </AlertDescription>
          </Alert>
        )}

        {/* Category Selection */}
        <EnhancedCategoryModal
          selectedCategories={selectedCategories}
          onCategorySelect={handleCategorySelect}
          onSubcategorySelect={handleSubcategorySelect}
          onClear={handleClear}
        />

        {/* Popular combinations hint */}
        {!hasSelected && (
          <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-gray-600" />
              <h3 className="font-medium text-gray-900">Popular Combinations</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                Construction + Plumbing + Electrical
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Delivery + Driver + Food Service
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Cleaning + Housekeeping + Security
              </div>
            </div>
          </div>
        )}
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
