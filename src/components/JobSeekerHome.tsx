
import { useAuth } from '@/contexts/AuthContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import JobSeekerHomeHeader from '@/components/jobseeker/JobSeekerHomeHeader';
import JobSeekerJobCard from '@/components/jobseeker/JobSeekerJobCard';
import JobSeekerEmptyState from '@/components/jobseeker/JobSeekerEmptyState';
import JobSeekerLoadingState from '@/components/jobseeker/JobSeekerLoadingState';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase } from 'lucide-react';

const JobSeekerHome = () => {
  const { user } = useAuth();
  const { jobs, isLoading } = useJobSeekerJobs();
  const navigate = useNavigate();

  if (isLoading) {
    return <JobSeekerLoadingState />;
  }

  // Show message if user hasn't completed profile
  if (!user?.primaryCategory && !user?.profileComplete) {
    return (
      <div className="space-y-4 px-4">
        <JobSeekerHomeHeader userPrimaryCategory={undefined} />
        <FloatingCard variant="glow" size="md" className="text-center py-8">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-semibold mb-2">Complete your profile</h3>
          <p className="text-sm text-gray-600 mb-4">Set up your specializations to see relevant jobs</p>
          <Button onClick={() => navigate('/profile-setup')}>
            Complete Profile
          </Button>
        </FloatingCard>
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      <JobSeekerHomeHeader userPrimaryCategory={user?.primaryCategory} />
      
      {/* Quick Actions */}
      <FloatingCard variant="elevated" size="sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Find Your Next Job</h3>
            <p className="text-sm text-gray-600">Browse jobs matching your skills</p>
          </div>
          <Button onClick={() => navigate('/search')} size="sm">
            <Search className="w-4 h-4 mr-1" />
            Search Jobs
          </Button>
        </div>
      </FloatingCard>

      {/* Recommended Jobs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Recommended for You
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>
        
        {jobs && jobs.length === 0 && <JobSeekerEmptyState />}
        
        {jobs && jobs.slice(0, 3).map(job => (
          <JobSeekerJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobSeekerHome;
