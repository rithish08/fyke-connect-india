import { useAuth } from '@/contexts/AuthContext';
import { useJobSearchState, ViewState } from '@/hooks/useJobSearchState';
import JobSearchCategoryView from '@/components/search/JobSearchCategoryView';
import JobSearchResultsView from '@/components/search/JobSearchResultsView';
import { useCategories } from '@/hooks/useCategories';

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
  const { categories } = useCategories();

  // When a category is selected, go directly to results
  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setSelectedSubcategories([]); // Reset subcategories
    setCurrentView('results' as ViewState);
  };

  // Subcategory filter is now handled in the results screen
  const handleSubcategorySelect = (subcategories: string[]) => {
    setSelectedSubcategories(subcategories);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedSubcategories([]);
    setCurrentView('category' as ViewState);
  };

  if (currentView === 'category') {
    return (
      <JobSearchCategoryView 
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        selectedCategory={selectedCategory}
        onBack={handleBackToCategories}
        currentView="categories"
      />
    );
  }

  // Pass subcategories for the selected category to the results view
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <JobSearchResultsView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      location={location}
      setLocation={setLocation}
      results={results as any}
      selectedCategory={selectedCategory}
      selectedSubcategories={selectedSubcategories}
      filters={filters}
      setFilters={setFilters}
      urgentOnly={urgentOnly}
      setUrgentOnly={setUrgentOnly}
      onBackToSubcategory={handleBackToCategories}
      subcategories={subcategories}
    />
  );
};

export default JobSearch;
