
import UnifiedJobCard from '@/components/common/UnifiedJobCard';
import UnifiedWorkerCard from '@/components/common/UnifiedWorkerCard';
import JobSearchEmptyState from './JobSearchEmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLocalization } from '@/hooks/useLocalization';
import { mockWorkers, mockJobs } from '@/data/mockData';

interface JobSearchResultsProps {
  results: any[];
  userRole: string | undefined;
  onWorkerClick: (worker: any) => void;
  isLoading?: boolean;
  category?: string;
}

const JobSearchResults = ({ 
  results, 
  userRole, 
  onWorkerClick,
  isLoading = false,
  category 
}: JobSearchResultsProps) => {
  const { getLocalizedText } = useLocalization();

  // Always use comprehensive mock data for demonstration
  let displayResults = results;
  
  if (userRole === 'employer') {
    // Show workers - use category-specific or mixed results
    if (category) {
      const categoryKey = category.toLowerCase();
      displayResults = categoryKey in mockWorkers 
        ? mockWorkers[categoryKey as keyof typeof mockWorkers] 
        : Object.values(mockWorkers).flat().slice(0, 5);
    } else {
      // Show mixed results from all categories for better demonstration
      displayResults = Object.values(mockWorkers).flat().slice(0, 8);
    }
  } else {
    // Show jobs - use category-specific or mixed results
    if (category) {
      const categoryKey = category.toLowerCase();
      displayResults = categoryKey in mockJobs 
        ? mockJobs[categoryKey as keyof typeof mockJobs] 
        : Object.values(mockJobs).flat().slice(0, 5);
    } else {
      // Show mixed results from all categories for better demonstration
      displayResults = Object.values(mockJobs).flat().slice(0, 8);
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4" role="status" aria-label={getLocalizedText('common.loading', 'Loading')}>
        <LoadingSkeleton type={userRole === 'employer' ? 'worker' : 'job'} count={5} />
      </div>
    );
  }

  if (displayResults.length === 0) {
    return <JobSearchEmptyState />;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-4">
        <div 
          role="list" 
          className="space-y-4" 
          aria-label={`${displayResults.length} ${getLocalizedText('search.results_found', 'search results found')}`}
        >
          {displayResults.map(res =>
            userRole === 'employer' ? (
              <div key={res.id} role="listitem">
                <UnifiedWorkerCard
                  worker={res}
                  onHire={() => console.log('Hire worker:', res)}
                  onMessage={() => console.log('Message worker:', res)}
                  onViewProfile={() => onWorkerClick(res)}
                />
              </div>
            ) : (
              <div key={res.id} role="listitem">
                <UnifiedJobCard 
                  job={res} 
                  onApply={() => console.log('Apply to job:', res)}
                  onViewDetails={() => console.log('View job details:', res)}
                  showCommunication={true}
                />
              </div>
            )
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default JobSearchResults;
