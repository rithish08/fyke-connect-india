import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Star, User, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useApplications } from '@/hooks/useApplications';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  distance: string;
  timePosted: string;
  rating?: number;
  urgent?: boolean;
  description?: string;
  phone?: string;
}

interface JobSeekerJobCardProps {
  job: Job;
}

const JobSeekerJobCard: React.FC<JobSeekerJobCardProps> = ({ job }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useGlobalToast();
  const { goTo } = useScreenNavigation();
  const { t } = useLocalization();
  const { applyToJob, hasApplied, withdrawApplication, refreshApplications } = useApplications();
  const [loading, setLoading] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const handleApply = async () => {
    if (!isAuthenticated) {
      localStorage.setItem('fyke_return_intent', `/job/${job.id}`);
      showError(t('job.loginRequired', 'Please login to apply for jobs'));
      goTo('/login');
      return;
    }
    if (!user?.profileComplete) {
      showError(t('job.profileIncomplete', 'Please complete your profile to apply for jobs'));
      goTo('/profile-setup');
      return;
    }
    setLoading(true);
    try {
      await applyToJob(job.id, user.id);
      showSuccess(t('job.applySuccess', 'Applied to {0} successfully!', [job.title]));
      await refreshApplications();
    } catch (err) {
      showError(t('job.applyError', 'Failed to apply. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    try {
      const result = await withdrawApplication(job.id);
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
    }
  };

  const handleViewDetails = () => {
    goTo(`/job/${job.id}`);
  };

  const handleCommunication = (type: 'chat' | 'call') => {
    if (type === 'chat') {
      goTo('/messages');
    } else if (type === 'call') {
      if (job.phone) {
        window.location.href = `tel:${job.phone}`;
      } else {
        showError('Phone number not available. Please contact through chat first.');
      }
    }
  };

  return (
    <ModernCard className="p-4 mb-3 hover:shadow-lg transition-all duration-200">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
              {job.urgent && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                  Urgent
                </span>
              )}
            </div>
            <p className="text-gray-600 flex items-center gap-1">
              <User className="w-4 h-4" />
              {job.company}
            </p>
          </div>
          {job.rating && (
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <Star className="w-4 h-4 fill-green-500 text-green-500" />
              <span className="text-green-700 font-medium text-sm">{job.rating}</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
            <span className="text-gray-400">• {job.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium text-gray-900">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.timePosted}</span>
          </div>
        </div>

        {job.description && (
          <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            onClick={hasApplied(job.id) ? () => setWithdrawDialogOpen(true) : handleApply}
            disabled={loading}
            className={`flex-1 h-11 rounded-xl font-medium transition-all ${
              hasApplied(job.id)
                ? 'bg-gray-400 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? (
              <span>{t('job.applying', 'Applying...')}</span>
            ) : hasApplied(job.id) ? (
              <>{t('job.applied', 'Applied')}</>
            ) : (
              t('job.applyNow', 'Apply Now')
            )}
          </Button>
          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="px-6 h-11 rounded-xl border-gray-200"
          >
            View in Details
          </Button>
        </div>

        <div className="flex gap-2 pt-2 border-t border-gray-100">
          <Button
            onClick={() => handleCommunication('chat')}
            variant="outline"
            size="sm"
            className="flex-1 h-9 rounded-lg"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </Button>
          <Button
            onClick={() => handleCommunication('call')}
            variant="outline"
            size="sm"
            className="flex-1 h-9 rounded-lg"
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
        </div>
      </div>

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
    </ModernCard>
  );
};

export default JobSeekerJobCard;
