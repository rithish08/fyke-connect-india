
import JobCard from '@/components/search/JobCard';
import WorkerCard from '@/components/search/WorkerCard';
import JobSeekerJobCard from '@/components/jobseeker/JobSeekerJobCard';
import JobSearchEmptyState from './JobSearchEmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLocalization } from '@/hooks/useLocalization';

interface JobSearchResultsProps {
  results: any[];
  userRole: string | undefined;
  onWorkerClick: (worker: any) => void;
  isLoading?: boolean;
}

const JobSearchResults = ({ 
  results, 
  userRole, 
  onWorkerClick,
  isLoading = false 
}: JobSearchResultsProps) => {
  const { getLocalizedText } = useLocalization();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4" role="status" aria-label={getLocalizedText('common.loading', 'Loading')}>
        <LoadingSkeleton type={userRole === 'employer' ? 'worker' : 'job'} count={5} />
      </div>
    );
  }

  if (results.length === 0) {
    return <JobSearchEmptyState />;
  }

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-4">
        <div 
          role="list" 
          className="space-y-3" 
          aria-label={`${results.length} ${getLocalizedText('search.results_found', 'search results found')}`}
        >
          {results.map(res =>
            userRole === 'employer' ? (
              <div key={res.id} role="listitem">
                <WorkerCard
                  worker={res}
                  onHire={(worker) => console.log('Hire worker:', worker)}
                  onMessage={(worker) => console.log('Message worker:', worker)}
                />
              </div>
            ) : (
              <div key={res.id} role="listitem">
                <JobSeekerJobCard job={res} />
              </div>
            )
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default JobSearchResults;
