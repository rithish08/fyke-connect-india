
import { useAuth } from '@/contexts/AuthContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import JobSeekerHomeHeader from '@/components/jobseeker/JobSeekerHomeHeader';
import JobSeekerJobCard from '@/components/jobseeker/JobSeekerJobCard';
import JobSeekerEmptyState from '@/components/jobseeker/JobSeekerEmptyState';
import JobSeekerLoadingState from '@/components/jobseeker/JobSeekerLoadingState';

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
    <div className="space-y-4 px-4">
      <JobSeekerHomeHeader userPrimaryCategory={user?.primaryCategory} />
      
      {jobs && jobs.length === 0 && <JobSeekerEmptyState />}
      
      {jobs && jobs.map(job => (
        <JobSeekerJobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobSeekerHome;
