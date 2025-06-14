
import { useAuth } from '@/contexts/AuthContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import JobSeekerHomeHeader from '@/components/jobseeker/JobSeekerHomeHeader';
import EnhancedJobSeekerJobCard from '@/components/jobseeker/EnhancedJobSeekerJobCard';
import JobSeekerEmptyState from '@/components/jobseeker/JobSeekerEmptyState';
import JobSeekerLoadingState from '@/components/jobseeker/JobSeekerLoadingState';
import LoginGuard from '@/components/auth/LoginGuard';

const JobSeekerHome = () => {
  const { user } = useAuth();
  const { jobs, isLoading } = useJobSeekerJobs();

  if (isLoading) {
    return <JobSeekerLoadingState />;
  }

  // Show message if user hasn't completed profile
  if (!user?.primaryCategory) {
    return (
      <div className="space-y-4 px-4">
        <JobSeekerHomeHeader userPrimaryCategory={undefined} />
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-semibold mb-2">Complete your profile</h3>
          <p className="text-sm">Set up your category to see relevant jobs</p>
        </div>
      </div>
    );
  }

  return (
    <LoginGuard 
      fallbackTitle="Login to Find Jobs"
      fallbackDescription="Please log in to view and apply for available jobs."
    >
      <div className="space-y-4 px-4">
        <JobSeekerHomeHeader userPrimaryCategory={user?.primaryCategory} />
        
        {jobs && jobs.length === 0 && <JobSeekerEmptyState />}
        
        {jobs && jobs.map(job => (
          <EnhancedJobSeekerJobCard key={job.id} job={job} />
        ))}
      </div>
    </LoginGuard>
  );
};

export default JobSeekerHome;
