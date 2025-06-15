
import { useAuth } from '@/contexts/AuthContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import JobSeekerHomeHeader from '@/components/jobseeker/JobSeekerHomeHeader';
import UnifiedJobCard from '@/components/common/UnifiedJobCard';
import JobSeekerEmptyState from '@/components/jobseeker/JobSeekerEmptyState';
import JobSeekerLoadingState from '@/components/jobseeker/JobSeekerLoadingState';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, FileText, Star } from 'lucide-react';

const JobSeekerHome = () => {
  const { user, getCurrentUserRole } = useAuth();
  const { jobs, isLoading } = useJobSeekerJobs();
  const navigate = useNavigate();

  const currentRole = getCurrentUserRole();

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
        <div className="grid grid-cols-3 gap-3">
          <Button 
            onClick={() => navigate('/search')} 
            variant="outline"
            className="flex-col h-16 space-y-1"
          >
            <Search className="w-5 h-5" />
            <span className="text-xs">Find Jobs</span>
          </Button>
          <Button 
            onClick={() => navigate('/applications')} 
            variant="outline"
            className="flex-col h-16 space-y-1"
          >
            <FileText className="w-4 h-4" />
            <span className="text-xs">Applications</span>
          </Button>
          <Button 
            onClick={() => navigate('/profile')} 
            variant="outline"
            className="flex-col h-16 space-y-1"
          >
            <Star className="w-4 h-4" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </FloatingCard>

      {/* Application Status Card */}
      <FloatingCard variant="minimal" size="sm" className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Your Applications</h3>
            <p className="text-xs text-gray-600">2 active • 1 interview scheduled</p>
          </div>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate('/applications')}
          >
            View All
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
          <UnifiedJobCard 
            key={job.id} 
            job={job} 
            showCommunication={true}
            showAvailabilitySwitch={true}
          />
        ))}
      </div>
    </div>
  );
};

export default JobSeekerHome;
