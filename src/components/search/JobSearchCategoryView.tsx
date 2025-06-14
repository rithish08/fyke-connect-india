
import { useAuth } from '@/contexts/AuthContext';
import CategorySelection from '@/components/search/CategorySelection';
import BottomNavigation from '@/components/BottomNavigation';

interface JobSearchCategoryViewProps {
  onCategorySelect: (categoryId: string, categoryName: string) => void;
}

const JobSearchCategoryView = ({ onCategorySelect }: JobSearchCategoryViewProps) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-xl font-bold text-gray-900">
            Find Workers by Category
          </h1>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-6">
        <CategorySelection 
          onCategorySelect={onCategorySelect}
          title="Select Worker Category"
        />
      </div>
      <BottomNavigation />
    </div>
  );
};

export default JobSearchCategoryView;
