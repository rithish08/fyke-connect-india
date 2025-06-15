
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StickyHeader from '@/components/layout/StickyHeader';
import BottomNavigation from '@/components/BottomNavigation';
import JobSearchFilters from '@/components/search/JobSearchFilters';
import JobSearchResults from '@/components/search/JobSearchResults';
import CategorySelection from '@/components/search/CategorySelection';
import SubcategorySelection from '@/components/search/SubcategorySelection';
import { useJobSearchState } from '@/hooks/useJobSearchState';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const JobSearch = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showFilters, setShowFilters] = useState(false);
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
    filters,
    setFilters,
    urgentOnly,
    setUrgentOnly,
    loadResults
  } = useJobSearchState();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleBack = () => {
    if (currentView === 'results') {
      setCurrentView('subcategory');
    } else if (currentView === 'subcategory') {
      setCurrentView('category');
    }
  };

  const handleCategorySelect = (category: {id: string, name: string}) => {
    setSelectedCategory(category);
    setCurrentView('subcategory');
  };

  const handleSubcategorySelect = (subcategories: string[]) => {
    setSelectedSubcategories(subcategories);
    setCurrentView('results');
  };

  const handleWorkerClick = (worker: any) => {
    console.log('Worker clicked:', worker);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'category':
        return <CategorySelection onSelectCategory={handleCategorySelect} />;
      case 'subcategory':
        return (
          <SubcategorySelection
            selectedCategory={selectedCategory}
            onSelectSubcategories={handleSubcategorySelect}
            onBack={handleBack}
          />
        );
      case 'results':
        return (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="px-4 space-y-3">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder={user?.role === 'employer' ? 'Search workers...' : 'Search jobs...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className="h-12 w-12 rounded-xl"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                <Button
                  variant={urgentOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUrgentOnly(!urgentOnly)}
                  className="whitespace-nowrap rounded-full"
                >
                  {user?.role === 'employer' ? 'Available Now' : 'Urgent Jobs'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap rounded-full"
                >
                  Nearby
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="whitespace-nowrap rounded-full"
                >
                  Verified
                </Button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="px-4">
                <JobSearchFilters
                  filters={filters}
                  onFiltersChange={setFilters}
                  userRole={user?.role}
                />
              </div>
            )}

            {/* Results */}
            <JobSearchResults
              results={results || []}
              userRole={user?.role}
              onWorkerClick={handleWorkerClick}
              isLoading={!results}
              category={selectedCategory?.name}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <StickyHeader currentTime={currentTime} />
      
      <div className="pt-24 pb-20">
        {/* Header */}
        {currentView !== 'category' && (
          <div className="sticky top-24 z-40 bg-white border-b border-gray-100 px-4 py-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {currentView === 'subcategory' ? selectedCategory?.name : 'Search Results'}
                </h2>
                {currentView === 'results' && (
                  <p className="text-xs text-gray-500">
                    {selectedSubcategories.length} categories selected
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="min-h-[calc(100vh-8rem)]">
          {renderCurrentView()}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default JobSearch;
