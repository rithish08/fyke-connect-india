
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
