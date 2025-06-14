
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft } from 'lucide-react';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';

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

  const handleSubcategoryUpdate = (subcategories: string[]) => {
    // Clear existing selections first
    selectedSubcategories.forEach(sub => onSubcategorySelect(sub));
    // Add new selections
    subcategories.forEach(sub => onSubcategorySelect(sub));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
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
          selectedCategory={selectedCategory}
          selectedSubcategories={selectedSubcategories}
          onCategorySelect={() => {}} // Category already selected
          onSubcategorySelect={handleSubcategoryUpdate}
        />

        {selectedSubcategories.length > 0 && (
          <div className="mt-6">
            <Button 
              className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={onSearchWithSubcategories}
            >
              Search {user?.role === 'employer' ? 'Workers' : 'Jobs'} ({selectedSubcategories.length} selected)
            </Button>
          </div>
        )}
        
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
    </div>
  );
};

export default JobSearchSubcategoryView;
