
import JobCard from '@/components/search/JobCard';
import WorkerCard from '@/components/search/WorkerCard';
import JobSearchEmptyState from './JobSearchEmptyState';

interface JobSearchResultsProps {
  results: any[];
  userRole: string | undefined;
  onWorkerClick: (worker: any) => void;
}

const JobSearchResults = ({ results, userRole, onWorkerClick }: JobSearchResultsProps) => {
  if (results.length === 0) {
    return <JobSearchEmptyState />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div role="list" className="space-y-3">
        {results.map(res =>
          userRole === 'employer' ? (
            <WorkerCard
              key={res.id}
              name={res.name}
              category={res.category}
              skills={res.skills}
              rating={res.rating}
              completedJobs={res.completedJobs}
              verificationLevel={res.verificationLevel}
              responseTime={res.responseTime}
              distance={res.distance}
              hourlyRate={res.hourlyRate}
              isOnline={res.isOnline}
              onClick={() => onWorkerClick(res)}
            />
          ) : (
            <JobCard
              key={res.id}
              title={res.title}
              category={res.category}
              skills={res.skills || []}
              salary={res.salary}
              urgent={res.urgent}
            />
          )
        )}
      </div>
    </div>
  );
};

export default JobSearchResults;
