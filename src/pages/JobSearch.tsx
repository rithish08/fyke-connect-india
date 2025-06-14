import { useAuth } from '@/contexts/AuthContext';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import JobSearchCategoryView from '@/components/search/JobSearchCategoryView';
import JobSearchResultsView from '@/components/search/JobSearchResultsView';
import { useState } from 'react';

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
    setUrgentOnly,
    loadResults
  } = useJobSearchState();

  const [selectedCategories, setSelectedCategories] = useState<{ [catId: string]: string[] }>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelectionComplete = (selected: { [catId: string]: string[] }) => {
    setSelectedCategories(selected);
    setShowResults(true);
    // Could trigger search, for now just switch view
  };

  if (!showResults) {
    return (
      <JobSearchCategoryView onSelectionComplete={handleSelectionComplete} />
    );
  }

  // For demo, treat selectedCategories as results filter; adapt as needed.
  return (
    <JobSearchResultsView
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      location={location}
      setLocation={setLocation}
      selectedCategory={null}
      results={results}
      filters={filters}
      setFilters={setFilters}
      urgentOnly={urgentOnly}
      setUrgentOnly={setUrgentOnly}
      onBackToSubcategory={() => setShowResults(false)}
    />
  );
};

export default JobSearch;
