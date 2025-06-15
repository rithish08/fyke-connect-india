import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';
import JobSearchHeader from '@/components/search/JobSearchHeader';
import JobSearchFilters from '@/components/search/JobSearchFilters';
import JobSearchResults from '@/components/search/JobSearchResults';
import WorkerDetailModal from '@/components/worker/WorkerDetailModal';
import QuickPostModal from '@/components/job/QuickPostModal';
import BottomNavigation from '@/components/BottomNavigation';
import { SkeletonGrid } from '@/components/ui/skeleton-cards';
import JobSearchBreadcrumbs from './JobSearchBreadcrumbs';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
  location: string;
  urgent: boolean;
  category: string;
}

interface JobSearchResultsViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: any;
  setLocation: (location: any) => void;
  selectedCategory: {id: string, name: string} | null;
  results: any[] | null;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  urgentOnly: boolean;
  setUrgentOnly: (urgent: boolean) => void;
  onBackToSubcategory: () => void;
}

const JobSearchResultsView = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  selectedCategory,
  results,
  filters,
  setFilters,
  urgentOnly,
  setUrgentOnly,
  onBackToSubcategory
}: JobSearchResultsViewProps) => {
  const { user } = useAuth();
  const { getLocalizedText } = useLocalization();
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showQuickPost, setShowQuickPost] = useState(false);

  const handleQuickHire = (workerId: string) => {
    console.log('Quick hiring worker:', workerId);
  };

  const handleWorkerClick = (worker: any) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20" role="main" aria-label={getLocalizedText('search.loading', 'Loading search results')}>
        <div className="max-w-2xl mx-auto">
          <JobSearchBreadcrumbs
            currentStep="results"
            selectedCategory={selectedCategory}
            selectedSubcategories={undefined}
            onStepChange={(step) => {
              if (step === "subcategory") onBackToSubcategory();
              if (step === "category") onBackToSubcategory(); // Could add new prop for multi-jump if needed
            }}
          />
        </div>
        <JobSearchHeader
          searchQuery=""
          setSearchQuery={() => {}}
          location={location}
          setLocation={setLocation}
          selectedCategory={selectedCategory}
          resultsCount={0}
          userRole={user?.role}
          onBackToSubcategory={onBackToSubcategory}
        />
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <SkeletonGrid count={5} type={user?.role === 'employer' ? 'worker' : 'job'} />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20" role="main">
      <div className="max-w-2xl mx-auto">
        <JobSearchBreadcrumbs
          currentStep="results"
          selectedCategory={selectedCategory}
          selectedSubcategories={results ? results.map(r => r.subcategory || '').filter(Boolean) : undefined}
          onStepChange={(step) => {
            if (step === "subcategory") onBackToSubcategory();
            if (step === "category") onBackToSubcategory(); // Could add new prop for multi-jump if needed
          }}
        />
      </div>
      <JobSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
        selectedCategory={selectedCategory}
        resultsCount={results.length}
        userRole={user?.role}
        onBackToSubcategory={onBackToSubcategory}
      />

      <main aria-live="polite" aria-label={getLocalizedText('search.results', 'Search Results')}>
        <JobSearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          urgentOnly={urgentOnly}
          setUrgentOnly={setUrgentOnly}
          resultsCount={results.length}
          userRole={user?.role}
          onShowQuickPost={() => setShowQuickPost(true)}
        />

        <JobSearchResults
          results={results}
          userRole={user?.role}
          onWorkerClick={handleWorkerClick}
        />
      </main>
      
      {selectedWorker && (
        <WorkerDetailModal
          isOpen={showWorkerModal}
          onClose={() => setShowWorkerModal(false)}
          worker={selectedWorker}
          onHire={handleQuickHire}
        />
      )}
      
      <QuickPostModal
        isOpen={showQuickPost}
        onClose={() => setShowQuickPost(false)}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default JobSearchResultsView;
