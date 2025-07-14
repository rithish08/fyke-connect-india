import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/hooks/useLocalization';
import { useNavigate } from 'react-router-dom';
import { geolocationService } from '@/services/geolocationService';
import { notificationService } from '@/services/notificationService';
import JobSearchHeader from '@/components/search/JobSearchHeader';
import JobSearchFilters from '@/components/search/JobSearchFilters';
import JobSearchResults from '@/components/search/JobSearchResults';
import WorkerDetailModal from '@/components/worker/WorkerDetailModal';
import QuickPostModal from '@/components/job/QuickPostModal';
import BottomNavigation from '@/components/BottomNavigation';
import { SkeletonGrid } from '@/components/ui/skeleton-cards';
import JobSearchBreadcrumbs from './JobSearchBreadcrumbs';
import { Job } from '@/types/job';
import { Profile } from '@/hooks/useWorkers';
import { Location, FilterState } from '@/hooks/useJobSearchState';
import { useApplications } from '@/hooks/useApplications';

interface JobSearchResultsViewProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: Location | null;
  setLocation: (location: Location | null) => void;
  selectedCategory: { id: string, name: string } | null;
  selectedSubcategories: string[];
  results: (Job | Profile)[] | null;
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
  selectedSubcategories,
  results,
  filters,
  setFilters,
  urgentOnly,
  setUrgentOnly,
  onBackToSubcategory
}: JobSearchResultsViewProps) => {
  const { user } = useAuth();
  const { getLocalizedText } = useLocalization();
  const navigate = useNavigate();
  const { applications, applyToJob, withdrawApplication } = useApplications();
  const [selectedWorker, setSelectedWorker] = useState<Profile | null>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showQuickPost, setShowQuickPost] = useState(false);

  const appliedJobIds = new Set(applications.map(app => app.job_id));

  const handleQuickHire = async (workerId: string) => {
    console.log('Quick hiring worker:', workerId);
    
    // Send notification for quick hire
    try {
      await notificationService.sendJobNotification('Quick Hire Request', 'Employer');
    } catch (notificationError) {
      console.warn('Could not send quick hire notification:', notificationError);
    }
    
    // Future implementation:
    // navigate(`/hire/${workerId}`);
  };

  const handleWorkerClick = (worker: Profile) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };
  
  const handleJobClick = async (jobId: string) => {
    // Get current location for distance calculation
    try {
      const currentLocation = await geolocationService.getCurrentLocation();
      console.log('Current location for job distance:', currentLocation);
    } catch (error) {
      console.warn('Could not get current location for distance calculation:', error);
    }
    
    navigate(`/jobs/${jobId}`);
  };

  const breadcrumbStepChange = (step: 'category' | 'subcategory') => {
    if (step === "subcategory" || step === "category") {
      onBackToSubcategory();
    }
  }

  const isLoading = !results;

  return (
    <div className="min-h-screen bg-gray-50 pb-20" role="main">
      <div className="max-w-2xl mx-auto">
        <JobSearchBreadcrumbs
          currentStep="results"
          selectedCategory={selectedCategory}
          selectedSubcategories={selectedSubcategories}
          onStepChange={breadcrumbStepChange}
        />
      </div>
      <JobSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
        resultsCount={results?.length ?? 0}
        userRole={user?.role}
        onBack={onBackToSubcategory}
      />

      <main aria-live="polite">
        <JobSearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          urgentOnly={urgentOnly}
          setUrgentOnly={setUrgentOnly}
          resultsCount={results?.length ?? 0}
          userRole={user?.role}
          onShowQuickPost={() => setShowQuickPost(true)}
        />
        
        {isLoading ? (
          <div className="max-w-2xl mx-auto px-4 pt-4">
            <SkeletonGrid count={5} type={user?.role === 'employer' ? 'worker' : 'job'} />
          </div>
        ) : (
          <JobSearchResults
            results={results}
            userRole={user?.role}
            onWorkerClick={handleWorkerClick}
            onJobClick={handleJobClick}
            onApply={applyToJob}
            appliedJobIds={appliedJobIds}
          />
        )}
      </main>
      
      {selectedWorker && (
        <WorkerDetailModal
          isOpen={showWorkerModal}
          onClose={() => setShowWorkerModal(false)}
          worker={{
            ...selectedWorker,
            category: 'General Worker',
            skills: ['Available', 'Reliable'],
            rating: 4.5,
            distance: '2 km away',
            responseTime: 'Quick',
            hourlyRate: 50,
            isOnline: selectedWorker.availability === 'available',
            completedJobs: 10,
            verificationLevel: selectedWorker.verified ? 'verified' : 'basic'
          } as any}
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
