
import JobCard from '@/components/search/JobCard';
import WorkerCard from '@/components/search/WorkerCard';
import JobSearchEmptyState from './JobSearchEmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';

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
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4">
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
        <div role="list" className="space-y-3" aria-label="Search results">
          {results.map(res =>
            userRole === 'employer' ? (
              <WorkerCard
                key={res.id}
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
            ) : (
              <JobCard
                key={res.id}
                id={res.id}
                title={res.title}
                category={res.category}
                skills={res.skills || []}
                salary={res.salary}
                urgent={res.urgent}
                distance={res.distance}
              />
            )
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default JobSearchResults;
