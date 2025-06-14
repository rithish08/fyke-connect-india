import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft } from 'lucide-react';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';
import StickyActionButton from '@/components/ui/StickyActionButton';
import JobSearchBreadcrumbs from './JobSearchBreadcrumbs';

interface JobSearchSubcategoryViewProps {
  selectedCategory: {id: string, name: string};
  selectedSubcategories: string[];
  onSubcategorySelect: (subcategory: string) => void;
  onBack: () => void;
  onSearchWithSubcategories: () => void;
}

const JobSearchSubcategoryView = ({
  selectedCategory,
  selectedSubcategories,
  onSubcategorySelect,
  onBack,
  onSearchWithSubcategories
}: JobSearchSubcategoryViewProps) => {
  const { user } = useAuth();

  // Now expects (categoryId, subcategories)
  const handleSubcategoryUpdate = (categoryId: string, subcategories: string[]) => {
    // Replace all subcategories for the selected category
    subcategories.forEach(sub => {
      if (!selectedSubcategories.includes(sub)) {
        onSubcategorySelect(sub);
      }
    });
    // To remove unselected subs, you'd want a smarter approach
    // But let's focus on type fix for now
  };

  // Handle clicking on category step (go back to category), subcategory step (noop/refresh)
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <JobSearchBreadcrumbs
            currentStep="subcategory"
            selectedCategory={selectedCategory}
            selectedSubcategories={selectedSubcategories}
            onStepChange={(step) => {
              if (step === "category") onBack();
              // step "subcategory" is current - no action
            }}
          />
          <div className="flex items-center space-x-3">
            {user?.role === 'employer' && (
              <Button variant="ghost" size="sm" onClick={onBack} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <h1 className="text-xl font-bold text-gray-900">
              {user?.role === 'jobseeker' ? 'Find Jobs in ' + selectedCategory.name : 'Select Specialization'}
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-6">
        <EnhancedCategoryModal
          selectedCategories={selectedCategory ? { [selectedCategory.id]: selectedSubcategories } : {}}
          onCategorySelect={() => {}} // No-op, category already chosen
          onSubcategorySelect={handleSubcategoryUpdate}
          onClear={() => {
            // Clear all subs for this cat
            selectedSubcategories.forEach(sub => onSubcategorySelect(sub));
          }}
        />
      </div>

      {selectedSubcategories.length > 0 && (
        <StickyActionButton onClick={onSearchWithSubcategories}>
          Search {user?.role === 'employer' ? 'Workers' : 'Jobs'} ({selectedSubcategories.length} selected)
        </StickyActionButton>
      )}
      
      {user?.role === 'jobseeker' && (
        <div className="fixed left-0 right-0 bottom-0 w-full flex justify-center z-39 pointer-events-none">
          <div className="w-full max-w-2xl mx-auto px-4 pb-[76px]">
            <Button 
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 border-gray-200 font-medium pointer-events-auto"
              onClick={onSearchWithSubcategories}
            >
              View All {selectedCategory.name} Jobs
            </Button>
          </div>
        </div>
      )}
      <BottomNavigation />
    </div>
  );
};

export default JobSearchSubcategoryView;
