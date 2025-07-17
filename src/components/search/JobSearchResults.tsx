import { useNavigate } from 'react-router-dom';
import UnifiedJobCard from '@/components/common/UnifiedJobCard';
import UnifiedWorkerCard from '@/components/common/UnifiedWorkerCard';
import JobSearchEmptyState from './JobSearchEmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { useLocalization } from '@/hooks/useLocalization';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import { useApplications } from '@/hooks/useApplications';
import { useWorkers, Profile } from '@/hooks/useWorkers';
import { Job } from '@/types/job';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface JobSearchResultsProps {
  results?: Job[]; // Added for compatibility
  userRole?: string | undefined;
  onWorkerClick?: (worker: Profile) => void;
  onJobClick?: (jobId: string) => Promise<void>;
  onApply?: (jobId: string, employerId: string) => Promise<void>;
  appliedJobIds?: Set<string>;
  category?: string;
  selectedCategories?: { [catId: string]: string[] };
  selectedCategory?: { id: string, name: string } | null;
  selectedSubcategories?: string[];
}

const JobSearchResults = ({ 
  userRole, 
  onWorkerClick,
  category,
  selectedCategories = {},
  selectedCategory,
  selectedSubcategories = [],
  ...props
}: JobSearchResultsProps) => {
  const { getLocalizedText } = useLocalization();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess } = useGlobalToast();
  const { toast } = useToast();

  const { jobs, loading: jobsLoading, error: jobsError } = useJobSeekerJobs();
  const { workers, loading: workersLoading, error: workersError } = useWorkers(
    userRole === 'employer' && selectedCategory ? selectedCategory.id : undefined,
    userRole === 'employer' && selectedSubcategories && selectedSubcategories.length > 0 ? selectedSubcategories[0] : undefined
  );
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

  const handleWorkerHire = async (worker: Profile) => {
    try {
      // Create a new job application or hire request
      const { error } = await supabase
        .from('applications')
        .insert({
          applicant_id: worker.id,
          employer_id: user?.id,
          status: 'pending',
          applied_at: new Date().toISOString(),
        });
      if (error) throw error;
      toast({ title: `Hire request sent to ${worker.name}!` });
    } catch (err: unknown) {
      toast({ title: 'Failed to send hire request', variant: 'destructive' });
    }
  };

  const handleWorkerMessage = async (worker: Profile) => {
    try {
      // Check if conversation exists
      const { data: existing, error: fetchError } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user?.id},user2_id.eq.${worker.id}`)
        .or(`user1_id.eq.${worker.id},user2_id.eq.${user?.id}`)
        .limit(1);
      if (fetchError) throw fetchError;
      let conversationId = existing && existing.length > 0 ? existing[0].id : null;
      if (!conversationId) {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({ user1_id: user?.id, user2_id: worker.id })
          .select('id')
          .single();
        if (createError) throw createError;
        conversationId = newConv.id;
      }
      navigate(`/messaging?conversation=${conversationId}`);
    } catch (err: unknown) {
      toast({ title: 'Failed to start conversation', variant: 'destructive' });
    }
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
                  worker={{
                    ...res,
                    category: 'General Worker',
                    skills: ['Available', 'Reliable'],
                    rating: 4.5,
                    distance: '2 km away',
                    responseTime: 'Quick',
                    hourlyRate: 50,
                    isOnline: res.availability === 'available',
                    completedJobs: 10,
                    verificationLevel: res.verified ? 'verified' : 'basic'
                  } as Profile}
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
