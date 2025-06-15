
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { categories } from '@/data/categories';
import { FloatingCard } from '@/components/ui/floating-card';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowRight, Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';

interface JobSearchCategoryViewProps {
  onSelectionComplete: (selected: { [catId: string]: string[] }) => void;
}

const JobSearchCategoryView = ({ onSelectionComplete }: JobSearchCategoryViewProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<{ [catId: string]: string[] }>({});

  const isEmployer = user?.role === 'employer';
  const pageTitle = isEmployer ? 'Find Workers by Category' : 'Find Jobs by Category';
  const searchButtonText = isEmployer ? 'Find Workers' : 'Search Jobs';
  const iconComponent = isEmployer ? Users : Briefcase;

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(cat => cat.name.toLowerCase() === categoryId);
    if (category) {
      const allSubcategories = category.subcategories.map(sub => sub.name);
      setSelectedCategories(prev => ({
        ...prev,
        [categoryId]: allSubcategories
      }));
    }
  };

  const handleSearch = () => {
    if (Object.keys(selectedCategories).length > 0) {
      onSelectionComplete(selectedCategories);
    }
  };

  const getTotalSelections = () => {
    return Object.values(selectedCategories).reduce((total, subs) => total + subs.length, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            {React.createElement(iconComponent, { className: "w-6 h-6 text-white" })}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{pageTitle}</h1>
        </div>
        <p className="text-gray-600 text-sm">
          {isEmployer 
            ? 'Select categories to find skilled workers in your area'
            : 'Select categories to find jobs that match your skills'
          }
        </p>
      </div>

      {/* Categories Grid */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => {
            const categoryId = category.name.toLowerCase();
            const isSelected = categoryId in selectedCategories;
            const subcategoryCount = category.subcategories.length;
            
            return (
              <FloatingCard
                key={categoryId}
                variant={isSelected ? "glow" : "elevated"}
                size="sm"
                className={`cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  isSelected 
                    ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 shadow-lg' 
                    : 'bg-white hover:shadow-md'
                }`}
                onClick={() => handleCategorySelect(categoryId)}
              >
                <div className="text-center space-y-3">
                  <div className="text-3xl">{category.icon}</div>
                  <div>
                    <h3 className={`font-semibold text-sm ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {category.name}
                    </h3>
                    <p className={`text-xs ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                      {subcategoryCount} specializations
                    </p>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </FloatingCard>
            );
          })}
        </div>

        {/* Selection Summary */}
        {getTotalSelections() > 0 && (
          <FloatingCard variant="minimal" size="sm" className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200/50">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-green-900 text-sm">
                  {getTotalSelections()} specializations selected
                </div>
                <div className="text-green-700 text-xs">
                  Ready to {isEmployer ? 'find workers' : 'search jobs'}
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-green-600" />
            </div>
          </FloatingCard>
        )}
      </div>

      {/* Search Button */}
      {getTotalSelections() > 0 && (
        <div className="fixed bottom-20 left-0 right-0 z-50 p-4">
          <div className="w-full max-w-lg mx-auto">
            <Button
              onClick={handleSearch}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              {searchButtonText}
            </Button>
          </div>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default JobSearchCategoryView;
