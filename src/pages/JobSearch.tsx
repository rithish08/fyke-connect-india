
import { useAuth } from '@/contexts/AuthContext';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import JobSearchCategoryView from '@/components/search/JobSearchCategoryView';
import JobSearchSubcategoryView from '@/components/search/JobSearchSubcategoryView';
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
    setResults,
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    filters,
    setFilters,
    urgentOnly,
    setUrgentOnly
  } = useJobSearchState();

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    if (user?.role === 'jobseeker' && user?.primaryCategory && user.primaryCategory !== categoryName) {
      return;
    }
    
    setSelectedCategory({ id: categoryId, name: categoryName });
    setCurrentView('subcategory');
  };

  const handleSubcategorySelect = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(prev => prev.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories(prev => [...prev, subcategory]);
    }
  };

  const handleSearchWithSubcategories = () => {
    setCurrentView('results');
  };

  const handleBackToCategory = () => {
    if (user?.role === 'jobseeker') {
      return;
    }
    setCurrentView('category');
    setSelectedCategory(null);
    setSelectedSubcategories([]);
  };

  const handleBackToSubcategory = () => {
    setCurrentView('subcategory');
    setResults(null);
  };

  // For job seekers, skip category selection if they have a primary category
  if (currentView === 'category' && user?.role === 'employer') {
    return (
      <JobSearchCategoryView onCategorySelect={handleCategorySelect} />
    );
  }

  if (currentView === 'subcategory' && selectedCategory) {
    return (
      <JobSearchSubcategoryView
        selectedCategory={selectedCategory}
        selectedSubcategories={selectedSubcategories}
        onSubcategorySelect={handleSubcategorySelect}
        onBack={handleBackToCategory}
        onSearchWithSubcategories={handleSearchWithSubcategories}
      />
    );
  }

  return (
    <JobSearchResultsView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      location={location}
      setLocation={setLocation}
      selectedCategory={selectedCategory}
      results={results}
      filters={filters}
      setFilters={setFilters}
      urgentOnly={urgentOnly}
      setUrgentOnly={setUrgentOnly}
      onBackToSubcategory={handleBackToSubcategory}
    />
  );
};

export default JobSearch;
