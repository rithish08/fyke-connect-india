import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, TrendingUp, AlertCircle, CheckCircle, ChevronDown } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import { useApplications } from '@/hooks/useApplications';
import { Skeleton } from './ui/skeleton';
import UnifiedJobCard from './common/UnifiedJobCard';
import { HomeGreeting } from './home/HomeGreeting';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type AvailabilityStatus = 'available' | 'busy' | 'offline';

const JobSeekerHome = () => {
  const { user, updateProfile } = useAuth();
  const { applications, applyToJob, withdrawApplication, refreshApplications } = useApplications();
  const { t } = useLocalization();
  const { jobs, loading: jobsLoading, error: jobsError } = useJobSeekerJobs();
  const navigate = useNavigate();

  const appliedJobIds = applications.map(app => app.job_id);

  const handleAvailabilityChange = async (value: AvailabilityStatus) => {
    await updateProfile({ availability: value });
  };

  const statusConfig: Record<AvailabilityStatus, { label: string; icon: React.ReactNode; color: string; description: string; }> = {
    available: { label: "Available", icon: <CheckCircle className="mr-2 h-4 w-4" />, color: "text-green-600", description: "Your profile is actively shown to employers." },
    busy: { label: "Busy", icon: <AlertCircle className="mr-2 h-4 w-4" />, color: "text-yellow-600", description: "You won't appear in new searches." },
    offline: { label: "Offline", icon: <AlertCircle className="mr-2 h-4 w-4" />, color: "text-gray-600", description: "You are offline and not visible." },
  };
  
  const currentStatus = user?.availability as AvailabilityStatus || 'offline';

  return (
    <div className="space-y-6">
      <HomeGreeting />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-blue-600">{applications.length}</div>
          <div className="text-sm text-gray-500 mt-1">{t('home.applicationsSent', 'Applications Sent')}</div>
        </Card>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Card className="p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className={`flex items-center text-lg font-bold ${statusConfig[currentStatus]?.color ?? 'text-gray-600'}`}>
                    {statusConfig[currentStatus]?.icon}
                    <span>{statusConfig[currentStatus]?.label ?? 'Offline'}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                </div>
                <div className="text-sm text-gray-500 mt-1">{t('home.currentStatus', 'Current Status')}</div>
            </Card>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {Object.keys(statusConfig).map((key) => {
                const statusKey = key as AvailabilityStatus;
                return (
                    <DropdownMenuItem key={statusKey} onSelect={() => handleAvailabilityChange(statusKey)}>
                        <div className="flex flex-col">
                            <div className={`flex items-center font-semibold ${statusConfig[statusKey].color}`}>
                                {statusConfig[statusKey].icon}
                                <span>{statusConfig[statusKey].label}</span>
                            </div>
                            <p className="text-xs text-gray-500 pl-6">{statusConfig[statusKey].description}</p>
                        </div>
                    </DropdownMenuItem>
                );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" onClick={() => navigate('/search')}>
          <Search className="w-6 h-6 text-blue-600" />
          <span className="text-sm font-semibold">{t('home.findJobs', 'Find Jobs')}</span>
        </Button>
        <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" onClick={() => navigate('/my-jobs')}>
          <TrendingUp className="w-6 h-6 text-green-600" />
          <span className="text-sm font-semibold">{t('home.myApplications', 'My Applications')}</span>
        </Button>
      </div>

      {/* Recommended Jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t('home.recommendedForYou', 'Recommended for You')}</h2>
          <Button variant="link" onClick={() => navigate('/search')}>{t('home.viewAll', 'View All')}</Button>
        </div>
        <div className="space-y-4">
          {jobsLoading && (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          )}
          {jobsError && <p className="text-sm text-red-600">{jobsError}</p>}
          {jobs && jobs.length > 0 && jobs.slice(0, 5).map((job) => (
            <UnifiedJobCard
              key={job.id}
              job={job}
              hasApplied={appliedJobIds.includes(job.id)}
              onApply={() => applyToJob(job.id, job.employer_id)}
              onViewDetails={(jobId) => navigate(`/jobs/${jobId}`)}
              onWithdraw={async (jobId) => {
                await withdrawApplication(jobId);
                await refreshApplications();
              }}
            />
          ))}
          {!jobsLoading && !jobsError && jobs && jobs.length === 0 && (
            <Card className="p-8 text-center rounded-xl bg-gray-50">
              <h3 className="font-semibold text-gray-800">{t('home.noJobsFound', 'No Jobs Found')}</h3>
              <p className="text-sm text-gray-500 mt-2">{t('home.noJobsHint', 'Try broadening your search criteria or check back later.')}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerHome;