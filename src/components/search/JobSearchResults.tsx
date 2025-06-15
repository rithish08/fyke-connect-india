
import UnifiedJobCard from '@/components/common/UnifiedJobCard';
import UnifiedWorkerCard from '@/components/common/UnifiedWorkerCard';
import JobSearchEmptyState from './JobSearchEmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLocalization } from '@/hooks/useLocalization';
import { mockWorkers, mockJobs } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { handleJobApplication, handleHireRequest } from '@/utils/communicationHandlers';
import { useGlobalToast } from '@/hooks/useGlobalToast';

interface JobSearchResultsProps {
  results: any[];
  userRole: string | undefined;
  onWorkerClick: (worker: any) => void;
  isLoading?: boolean;
  category?: string;
  selectedCategories?: { [catId: string]: string[] };
}

const JobSearchResults = ({ 
  results, 
  userRole, 
  onWorkerClick,
  isLoading = false,
  category,
  selectedCategories = {}
}: JobSearchResultsProps) => {
  const { getLocalizedText } = useLocalization();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useGlobalToast();

  // Enhanced mock data integration with user-specific filtering
  let displayResults = results;
  
  if (userRole === 'employer') {
    // Show workers - prioritize category-specific results
    if (category) {
      const categoryKey = category.toLowerCase();
      displayResults = categoryKey in mockWorkers 
        ? mockWorkers[categoryKey as keyof typeof mockWorkers] 
        : Object.values(mockWorkers).flat().slice(0, 6);
    } else if (Object.keys(selectedCategories).length > 0) {
      // Show workers from selected categories
      displayResults = [];
      Object.keys(selectedCategories).forEach(catKey => {
        if (catKey in mockWorkers) {
          displayResults = [...displayResults, ...mockWorkers[catKey as keyof typeof mockWorkers]];
        }
      });
      displayResults = displayResults.slice(0, 10);
    } else {
      displayResults = Object.values(mockWorkers).flat().slice(0, 10);
    }
  } else {
    // For job seekers, only show jobs from their selected categories or primary category
    const userCategories = user?.categories || (user?.primaryCategory ? [user.primaryCategory] : []);
    
    if (category) {
      const categoryKey = category.toLowerCase();
      displayResults = categoryKey in mockJobs 
        ? mockJobs[categoryKey as keyof typeof mockJobs] 
        : [];
    } else if (Object.keys(selectedCategories).length > 0) {
      // Show jobs from selected categories
      displayResults = [];
      Object.keys(selectedCategories).forEach(catKey => {
        if (catKey in mockJobs) {
          displayResults = [...displayResults, ...mockJobs[catKey as keyof typeof mockJobs]];
        }
      });
    } else if (userCategories.length > 0) {
      // Show jobs only from user's categories
      displayResults = [];
      userCategories.forEach(userCat => {
        const categoryKey = userCat.toLowerCase();
        if (categoryKey in mockJobs) {
          displayResults = [...displayResults, ...mockJobs[categoryKey as keyof typeof mockJobs]];
        }
      });
      displayResults = displayResults.slice(0, 10);
    } else {
      // If user has no categories, show empty results
      displayResults = [];
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

  const handleJobApply = (job: any) => {
    handleJobApplication(job.id, job.title, navigate);
    showSuccess('Applied successfully!');
  };

  const handleJobViewDetails = (job: any) => {
    navigate(`/job/${job.id}`);
  };

  const handleWorkerHire = (worker: any) => {
    handleHireRequest(worker.id, worker.name);
    showSuccess(`Hire request sent to ${worker.name}!`);
  };

  const handleWorkerMessage = (worker: any) => {
    navigate(`/messages?chatWith=${worker.id}&name=${worker.name}&type=worker`);
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
            userRole === 'employer' ? (
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
                  showCommunication={true}
                  showAvailabilitySwitch={true}
                  showRateSettings={true}
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
