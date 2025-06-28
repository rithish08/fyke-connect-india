import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Briefcase, MessageCircle, TrendingUp, AlertCircle } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { NearbyWorkersSection } from './employer/NearbyWorkersSection';
import { useEmployerJobs } from '@/hooks/useEmployerJobs';
import { useEmployerApplications } from '@/hooks/useEmployerApplications';
import { Skeleton } from './ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { AdCarousel } from './home/AdCarousel';
import { HomeGreeting } from './home/HomeGreeting';
import UnifiedJobCard from './common/UnifiedJobCard';

const EmployerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLocalization();
  const { postedJobs, loading: jobsLoading, error: jobsError } = useEmployerJobs();
  const { applications, loading: appsLoading, error: appsError } = useEmployerApplications();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('home.greetingMorning', 'Good Morning');
    if (hour < 17) return t('home.greetingAfternoon', 'Good Afternoon');
    return t('home.greetingEvening', 'Good Evening');
  };

  const getActiveJobsCount = () => {
    if (jobsLoading) return <Skeleton className="h-6 w-8 inline-block" />;
    return postedJobs.filter(job => job.status === 'open').length;
  };

  const getTotalApplicationsCount = () => {
    if (appsLoading) return <Skeleton className="h-6 w-8 inline-block" />;
    return applications.length;
  };
  
  const getInterviewCount = () => {
    if (appsLoading) return <Skeleton className="h-6 w-8 inline-block" />;
    return applications.filter(app => app.status === 'interview').length;
  }

  return (
    <div className="space-y-8 px-2 sm:px-0">
      <HomeGreeting />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/post-job')}
          className="h-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 rounded-xl shadow-sm"
          aria-label={t('home.postNewJob', 'Post New Job')}
        >
          <div className="text-center">
            <Plus className="w-7 h-7 mx-auto mb-1" />
            <span className="text-base font-medium">{t('home.postNewJob', 'Post New Job')}</span>
          </div>
        </Button>
        <Button 
          onClick={() => navigate('/search')}
          className="h-24 bg-white border-2 border-green-100 text-gray-900 hover:bg-green-50 rounded-xl shadow-sm"
          aria-label={t('home.findWorkers', 'Find Workers')}
        >
          <div className="text-center">
            <Users className="w-7 h-7 mx-auto mb-1 text-green-600" />
            <span className="text-base font-medium">{t('home.findWorkers', 'Find Workers')}</span>
          </div>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-5 text-center rounded-xl">
          <div className="text-2xl font-bold text-blue-600">{getActiveJobsCount()}</div>
          <div className="text-sm text-gray-500">{t('home.activeJobs', 'Active Jobs')}</div>
        </Card>
        <Card className="p-5 text-center rounded-xl">
          <div className="text-2xl font-bold text-green-600">{getTotalApplicationsCount()}</div>
          <div className="text-sm text-gray-500">{t('home.applications', 'Applications')}</div>
        </Card>
        <Card className="p-5 text-center rounded-xl">
          <div className="text-2xl font-bold text-orange-600">{getInterviewCount()}</div>
          <div className="text-sm text-gray-500">{t('home.interviews', 'Interviews')}</div>
        </Card>
      </div>

      <NearbyWorkersSection />

      {/* Recent Applications */}
      <Card className="p-5 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">{t('home.recentApplications', 'Recent Applications')}</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-jobs')} aria-label={t('home.manageAll', 'Manage All')}>
            {t('home.manageAll', 'Manage All')}
          </Button>
        </div>
        {appsLoading && <div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div>}
        {appsError && <p className="text-red-600 text-sm">{appsError}</p>}
        {!appsLoading && !appsError && applications.length > 0 && (
          <div className="space-y-3">
            {applications.slice(0, 3).map((app) => (
              <div 
                key={app.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                onClick={() => app.job_id && navigate(`/jobs/${app.job_id}`)}
              >
                <div>
                  <div className="font-medium text-gray-900">{app.profiles?.name}</div>
                  <div className="text-sm text-gray-500">{t('home.appliedTo', 'Applied to')} <span className="font-medium">{app.jobs?.title}</span></div>
                </div>
                <Badge variant={app.status === 'pending' ? 'outline' : 'default'}>{t(`application.status.${app.status}`, app.status || 'pending')}</Badge>
              </div>
            ))}
          </div>
        )}
        {!appsLoading && !appsError && applications.length === 0 && <p className="text-gray-500 text-sm">{t('home.noApplications', 'No new applications yet.')}</p>}
      </Card>

      {/* Posted Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">{t('home.yourJobPosts', 'Your Job Posts')}</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-jobs')} aria-label={t('home.manageAll', 'Manage All')}>
            {t('home.manageAll', 'Manage All')}
          </Button>
        </div>
        {jobsLoading && <div className="space-y-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>}
        {jobsError && <p className="text-red-600 text-sm">{jobsError}</p>}
        {!jobsLoading && !jobsError && postedJobs.length > 0 && (
          <div className="space-y-4">
            {postedJobs.slice(0, 3).map((job) => (
              <UnifiedJobCard 
                key={job.id} 
                job={job}
                onViewDetails={() => navigate(`/jobs/${job.id}`)}
                onEdit={() => navigate(`/edit-job/${job.id}`)}
              />
            ))}
          </div>
        )}
        {!jobsLoading && !jobsError && postedJobs.length === 0 && <p className="text-gray-500 text-sm">{t('home.noPostedJobs', 'You have not posted any jobs yet.')}</p>}
      </div>
    </div>
  );
};

export default EmployerHome;
