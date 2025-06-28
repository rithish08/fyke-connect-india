import { useAuth } from '@/contexts/AuthContext';
import { useJobSearchState } from '@/hooks/useJobSearchState';
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
    setCurrentView('subcategories');
  };

  const handleSubcategorySelect = (subcategories: string[]) => {
    setSelectedSubcategories(subcategories);
    setCurrentView('results');
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setCurrentView('categories');
  };

  const handleBackToSubcategories = () => {
    setCurrentView('subcategories');
  };

  if (currentView === 'categories' || currentView === 'subcategories') {
    return (
      <JobSearchCategoryView 
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedCategory={selectedCategory}
        onBack={handleBackToCategories}
        currentView={currentView}
      />
    );
  }

  return (
    <JobSearchResultsView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      location={location}
      setLocation={setLocation}
      results={results}
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
