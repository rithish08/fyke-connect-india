import UnifiedJobCard from '@/components/common/UnifiedJobCard';
import UnifiedWorkerCard from '@/components/common/UnifiedWorkerCard';
import JobSearchEmptyState from './JobSearchEmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLocalization } from '@/hooks/useLocalization';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import { useApplications } from '@/hooks/useApplications';
import { useWorkers, Profile } from '@/hooks/useWorkers';
import { Job } from '@/types/job';

interface JobSearchResultsProps {
  results?: any[]; // Added for compatibility
  userRole?: string | undefined;
  onWorkerClick?: (worker: Profile) => void;
  onJobClick?: (jobId: string) => Promise<void>;
  onApply?: (jobId: string, employerId: string) => Promise<void>;
  appliedJobIds?: Set<string>;
  category?: string;
  selectedCategories?: { [catId: string]: string[] };
}

const JobSearchResults = ({ 
  userRole, 
  onWorkerClick,
  category,
  selectedCategories = {}
}: JobSearchResultsProps) => {
  const { getLocalizedText } = useLocalization();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useGlobalToast();

  const { jobs, loading: jobsLoading, error: jobsError } = useJobSeekerJobs();
  const { workers, loading: workersLoading, error: workersError } = useWorkers();
  const { applyToJob, hasApplied } = useApplications();

  const isWorker = (res: Job | Profile): res is Profile => userRole === 'employer';

  let displayResults: (Job | Profile)[] = [];
  let isLoading = false;

  if (userRole === 'employer') {
    displayResults = workers || [];
    isLoading = workersLoading;
  } else {
    displayResults = jobs || [];
    isLoading = jobsLoading;
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

  const handleJobApply = (job: Job) => {
    if (!job.employer_id) {
      console.error('Employer ID is missing for this job.');
      return;
    }
    applyToJob(job.id, job.employer_id);
    showSuccess('Applied successfully!');
  };

  const handleJobViewDetails = (job: Job) => {
    navigate(`/job/${job.id}`);
  };

  const handleWorkerHire = (worker: Profile) => {
    // Replace with actual hire logic
    showSuccess(`Hire request sent to ${worker.name}!`);
  };

  const handleWorkerMessage = (worker: Profile) => {
    navigate(`/messages?conversationId=new&participantId=${worker.id}`);
  };

  return (
    <ErrorBoundary>
      <div className="max-w-2xl mx-auto px-4">
        <div 
          role="list" 
          className="space-y-4" 
          aria-label={`${displayResults.length} ${getLocalizedText('search.results_found', 'search results found')}`}
        >
          {displayResults.map(res =>
            isWorker(res) ? (
              <div key={res.id} role="listitem">
                <UnifiedWorkerCard
                  worker={res}
                  onHire={() => handleWorkerHire(res)}
                  onMessage={() => handleWorkerMessage(res)}
                  onViewProfile={() => onWorkerClick(res)}
                />
              </div>
            ) : (
              <div key={res.id} role="listitem">
                <UnifiedJobCard 
                  job={res} 
                  onApply={() => handleJobApply(res)}
                  onViewDetails={() => handleJobViewDetails(res)}
                  hasApplied={hasApplied(res.id)}
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
