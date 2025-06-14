
import React from 'react';
import JobSearchResults from '@/components/search/JobSearchResults';
import JobSearchFilters from '@/components/search/JobSearchFilters';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import { SkeletonGrid } from '@/components/ui/skeleton-cards';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
}

interface EnhancedJobSearchResultsProps {
  results: any[] | null;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  urgentOnly: boolean;
  setUrgentOnly: (urgent: boolean) => void;
  onWorkerClick: (worker: any) => void;
  onShowQuickPost: () => void;
  isLoading?: boolean;
  error?: string;
}

const EnhancedJobSearchResults: React.FC<EnhancedJobSearchResultsProps> = ({
  results,
  filters,
  onFiltersChange,
  urgentOnly,
  setUrgentOnly,
  onWorkerClick,
  onShowQuickPost,
  isLoading = false,
  error
}) => {
  const { user } = useAuth();
  const { getLocalizedText } = useLocalization();

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4">
        <ErrorState
          title="Search Failed"
          description={error}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  if (isLoading || results === null) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="px-4 mb-4">
          <div className="h-16 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        <div className="px-4">
          <SkeletonGrid count={5} type={user?.role === 'employer' ? 'worker' : 'job'} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <JobSearchFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        urgentOnly={urgentOnly}
        setUrgentOnly={setUrgentOnly}
        resultsCount={results.length}
        userRole={user?.role}
        onShowQuickPost={onShowQuickPost}
      />

      {results.length === 0 ? (
        <div className="max-w-2xl mx-auto px-4">
          <EmptyState
            title={user?.role === 'employer' ? "No Workers Found" : "No Jobs Found"}
            description={`We couldn't find any ${user?.role === 'employer' ? 'workers' : 'jobs'} matching your criteria. Try adjusting your filters or search terms.`}
            actionText="Clear Filters"
            onAction={() => {
              onFiltersChange({
                distance: 10,
                minRating: 0,
                priceRange: [0, 1000],
                availability: 'all',
                responseTime: 'all'
              });
              setUrgentOnly(false);
            }}
          />
        </div>
      ) : (
        <JobSearchResults
          results={results}
          userRole={user?.role}
          onWorkerClick={onWorkerClick}
        />
      )}
    </div>
  );
};

export default EnhancedJobSearchResults;
