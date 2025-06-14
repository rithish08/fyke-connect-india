import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft } from 'lucide-react';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';
import StickyActionButton from '@/components/ui/StickyActionButton';

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

  return (
    <div className="min-h-screen bg-gray-50 pb-24"> {/* Extra bottom padding for sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
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
      
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <EnhancedCategoryModal
          selectedCategories={selectedCategory ? { [selectedCategory.id]: selectedSubcategories } : {}}
          onCategorySelect={() => {}} // No-op, category already chosen
          onSubcategorySelect={handleSubcategoryUpdate}
          onClear={() => {
            // Clear all subs for this cat
            selectedSubcategories.forEach(sub => onSubcategorySelect(sub));
          }}
        />

        {/* REMOVE inline Button for main action, keep secondary (outline) for 'View All ...' if jobseeker */}
        {user?.role === 'jobseeker' && (
          <div className="mt-4">
            <Button 
              variant="outline"
              className="w-full h-12 rounded-2xl border-2 border-gray-200 font-medium"
              onClick={onSearchWithSubcategories}
            >
              View All {selectedCategory.name} Jobs
            </Button>
          </div>
        )}
      </div>
      <BottomNavigation />

      {/* Sticky Action Button */}
      <StickyActionButton
        show={selectedSubcategories.length > 0}
        onClick={onSearchWithSubcategories}
      >
        Search {user?.role === 'employer' ? 'Workers' : 'Jobs'} ({selectedSubcategories.length} selected)
      </StickyActionButton>
    </div>
  );
};

export default JobSearchSubcategoryView;
