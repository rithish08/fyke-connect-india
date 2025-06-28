import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Clock, User, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import { useMyApplications, ApplicationWithJob } from '@/hooks/useMyApplications';
import { useEmployerJobs } from '@/hooks/useEmployerJobs';
import { Job } from '@/hooks/useJobSeekerJobs';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';

const MyJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(user?.role === 'employer' ? 'active' : 'applied');
  
  const isEmployer = user?.role === 'employer';

  const { applications, loading: applicationsLoading, error: applicationsError, withdrawApplication, refreshApplications } = useMyApplications();
  const { postedJobs, loading: jobsLoading, error: jobsError, refreshJobs } = useEmployerJobs();
  const { showSuccess, showError } = useGlobalToast();
  const { t } = useTranslation();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [applicationToWithdraw, setApplicationToWithdraw] = useState<ApplicationWithJob | null>(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const JobSeekerJobCard = ({ job }: { job: ApplicationWithJob }) => (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/job/${job.id}`)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{job.company}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs capitalize">{job.application_status}</Badge>
            <Badge variant="outline" className="text-xs">{job.category}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-600">₹{job.salary_max || job.salary_min}</div>
          <div className="text-xs text-gray-500">per {job.salary_period}</div>
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Applied {formatDistanceToNow(new Date(job.applied_at), { addSuffix: true })}</span>
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); navigate(`/job/${job.id}`)}}>
            <Eye className="w-3 h-3 mr-1" />
            View Job
          </Button>
          {job.application_status === 'pending' && (
            <Button variant="destructive" size="sm" onClick={(e) => { e.stopPropagation(); setApplicationToWithdraw(job); setWithdrawDialogOpen(true); }}>
              {t('job.withdraw', 'Withdraw')}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  const EmployerJobCard = ({ job }: { job: Job }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
            </span>
             <Badge variant="outline" className="text-xs capitalize">{job.status}</Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-600">₹{job.salary_max || job.salary_min}</div>
          <div className="text-xs text-gray-500">per {job.salary_period}</div>
        </div>
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500 flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}</span>
        </span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/job/${job.id}`)}>
            <Eye className="w-3 h-3 mr-1" /> View
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/edit-job/${job.id}`)}>
            <Edit className="w-3 h-3 mr-1" /> Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 hover:text-red-600" onClick={() => handleDeleteClick(job.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );

  const handleDeleteClick = (jobId: string) => {
    setJobToDelete(jobId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', jobToDelete);
      if (error) throw error;
      showSuccess(t('job.deleteSuccess', 'Job deleted successfully!'));
      refreshJobs();
    } catch (err) {
      showError(t('job.deleteError', 'Failed to delete job. Please try again.'));
    } finally {
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleWithdraw = async () => {
    if (!applicationToWithdraw) return;
    setWithdrawLoading(true);
    try {
      const result = await withdrawApplication(applicationToWithdraw.id);
      if (result.success) {
        showSuccess(t('job.withdrawSuccess', 'Application withdrawn.'));
        await refreshApplications();
      } else {
        showError(t('job.withdrawError', 'Failed to withdraw application.'));
      }
    } catch (err) {
      showError(t('job.withdrawError', 'Failed to withdraw application.'));
    } finally {
      setWithdrawLoading(false);
      setWithdrawDialogOpen(false);
      setApplicationToWithdraw(null);
    }
  };

  const renderJobSeekerContent = () => {
    if (applicationsLoading) {
      return (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      )
    }

    if (applicationsError) {
      return <div className="text-center py-12 text-red-500">{applicationsError}</div>;
    }

    const jobsData = {
      applied: applications.filter(app => app.application_status === 'pending'),
      active: applications.filter(app => app.application_status === 'accepted'),
      completed: applications.filter(app => app.application_status === 'rejected'),
    };

    return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="applied">Applied ({jobsData.applied.length})</TabsTrigger>
          <TabsTrigger value="active">In-Progress ({jobsData.active.length})</TabsTrigger>
          <TabsTrigger value="completed">Archive ({jobsData.completed.length})</TabsTrigger>
        </TabsList>
        
        {Object.entries(jobsData).map(([key, jobs]) => (
          <TabsContent key={key} value={key} className="space-y-4 mt-6">
            {jobs.length > 0 ? (
              jobs.map((job) => <JobSeekerJobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center py-12 rounded-lg bg-gray-50">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs here</h3>
                <p className="text-gray-600 mb-4 text-sm">You don't have any {key} applications yet.</p>
                 <Button onClick={() => navigate('/search')} size="sm">
                    Browse Jobs
                  </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    );
  };
  
  const renderEmployerContent = () => {
    if (jobsLoading) {
       return (
        <div className="space-y-4 mt-6">
          <Skeleton className="h-28 w-full rounded-lg" />
          <Skeleton className="h-28 w-full rounded-lg" />
        </div>
      )
    }

    if (jobsError) {
      return <div className="text-center py-12 text-red-500">{jobsError}</div>;
    }

    const jobsData = {
      active: postedJobs.filter(job => job.status === 'active'),
      completed: postedJobs.filter(job => ['filled', 'expired', 'draft'].includes(job.status)),
    };

     return (
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active ({jobsData.active.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({jobsData.completed.length})</TabsTrigger>
        </TabsList>
        
        {Object.entries(jobsData).map(([key, jobs]) => (
          <TabsContent key={key} value={key} className="space-y-4 mt-6">
            {jobs.length > 0 ? (
              jobs.map((job) => <EmployerJobCard key={job.id} job={job} />)
            ) : (
              <div className="text-center py-12 rounded-lg bg-gray-50">
                <div className="text-4xl mb-4">🏗️</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No {key} jobs</h3>
                <p className="text-gray-600 mb-4 text-sm">You don't have any {key} job posts yet.</p>
                 <Button onClick={() => navigate('/post-job')} size="sm">
                    Post a New Job
                  </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    );
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="bg-white shadow-sm p-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEmployer ? 'My Job Posts' : 'My Applications'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEmployer ? 'Manage your active and completed job posts' : 'Track your job applications'}
            </p>
          </div>
          {isEmployer && (
            <Button onClick={() => navigate('/post-job')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        {isEmployer ? renderEmployerContent() : renderJobSeekerContent()}
      </div>

      <BottomNavigation />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('job.deleteConfirmTitle', 'Delete Job?')}</DialogTitle>
            <DialogDescription>{t('job.deleteConfirmDesc', 'Are you sure you want to delete this job? This action cannot be undone.')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>{t('job.delete', 'Delete')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('job.withdrawConfirmTitle', 'Withdraw Application?')}</DialogTitle>
            <DialogDescription>{t('job.withdrawConfirmDesc', 'Are you sure you want to withdraw your application?')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
            <Button variant="destructive" onClick={handleWithdraw} disabled={withdrawLoading}>
              {withdrawLoading ? t('job.withdrawing', 'Withdrawing...') : t('job.withdraw', 'Withdraw')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyJobs;
