
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

  const handleJobViewDetails = (jobId: number) => {
    console.log('Viewing job details for:', jobId);
    // Navigate to job details page
  };

  const handleJobApply = (jobId: number) => {
    console.log('Applying to job:', jobId);
    // Handle job application
  };

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
                  id={res.id}
                  name={res.name}
                  category={res.category}
                  skills={res.skills}
                  rating={res.rating}
                  completedJobs={res.completedJobs}
                  hourlyRate={res.hourlyRate}
                  isOnline={res.isOnline}
                  profileImage={res.profileImage}
                  distance={res.distance}
                />
              </div>
            ) : (
              <div key={res.id} role="listitem">
                <JobSeekerJobCard
                  job={res}
                  onViewDetails={handleJobViewDetails}
                  onApply={handleJobApply}
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
