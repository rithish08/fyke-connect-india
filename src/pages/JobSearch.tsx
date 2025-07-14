import { useAuth } from '@/contexts/AuthContext';
import { useJobSearchState, ViewState } from '@/hooks/useJobSearchState';
import JobSearchCategoryView from '@/components/search/JobSearchCategoryView';
import JobSearchResultsView from '@/components/search/JobSearchResultsView';

const JobSearch = () => {
  const { user } = useAuth();
  const {
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategories,
    setSelectedSubcategories,
    results,
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    filters,
    setFilters,
    urgentOnly,
    setUrgentOnly,
  } = useJobSearchState();

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setCurrentView('subcategory' as ViewState);
  };

  const handleSubcategorySelect = (subcategories: string[]) => {
    setSelectedSubcategories(subcategories);
    setCurrentView('results');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setCurrentView('category' as ViewState);
  };

  const handleBackToSubcategories = () => {
    setCurrentView('subcategory' as ViewState);
  };

  if (currentView === 'category' || currentView === 'subcategory') {
    return (
      <JobSearchCategoryView 
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedCategory={selectedCategory ? { 
          ...selectedCategory, 
          icon: '🔧', 
          color: 'blue', 
          subcategories: [] 
        } : null}
        onBack={handleBackToCategories}
        currentView={currentView === 'category' ? 'categories' : 'subcategories'}
      />
    );
  }

  return (
    <JobSearchResultsView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      location={location}
      setLocation={setLocation}
      results={results as any}
      selectedSubcategories={selectedSubcategories}
      filters={filters}
      setFilters={setFilters}
      urgentOnly={urgentOnly}
      setUrgentOnly={setUrgentOnly}
      onBackToSubcategory={handleBackToSubcategories}
      selectedCategory={selectedCategory}
    />
  );
};

export default JobSearch;
