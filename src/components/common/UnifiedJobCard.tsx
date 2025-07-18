import React, { useEffect, useState } from 'react';
import { Clock, MapPin, DollarSign, User, Eye, CheckCircle, Briefcase, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Job } from '@/types/job';
import { formatDistanceToNow } from 'date-fns';
import { getAreaFromCoordinates, parsePointString, calculateDistance } from '@/utils/locationUtils';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface UnifiedJobCardProps {
  job: Job;
  onApply?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  onEdit?: (jobId: string) => void;
  onWithdraw?: (jobId: string) => void;
  hasApplied?: boolean;
  compact?: boolean;
}

// Helper function to format salary
const formatSalary = (job: Job, t: (key: string, defaultVal: string) => string) => {
  if (job.salary_min && job.salary_max) {
    return `₹${job.salary_min} - ₹${job.salary_max} / ${job.salary_period || 'day'}`;
  }
  if (job.salary_max) {
    return `Up to ₹${job.salary_max} / ${job.salary_period || 'day'}`;
  }
  if (job.salary_min) {
    return `From ₹${job.salary_min} / ${job.salary_period || 'day'}`;
  }
  return t('job.salaryNotDisclosed', 'Salary not disclosed');
};

// Helper function to format time
const formatTimePosted = (postedAt: string) => {
  try {
    return `${formatDistanceToNow(new Date(postedAt))} ago`;
  } catch (error) {
    console.error("Invalid time format for job posting:", postedAt);
    return "Recently";
  }
};

const UnifiedJobCard: React.FC<UnifiedJobCardProps> = ({ 
  job, 
  onApply, 
  onViewDetails,
  onEdit,
  onWithdraw,
  hasApplied = false,
  compact = false
}) => {
  const { toast } = useToast();
  const { t } = useLocalization();
  const { user } = useAuth();
  const [locationDisplay, setLocationDisplay] = useState(job.location);
  const [distanceDisplay, setDistanceDisplay] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    const processLocation = async () => {
      const coords = parsePointString(job.location);
      if (coords) {
        try {
          const areaName = await getAreaFromCoordinates(coords.lat, coords.lng);
          setLocationDisplay(areaName);
          // Calculate distance if user has coordinates
          if (user?.latitude && user?.longitude) {
            const { meters, kilometers } = calculateDistance(
              user.latitude,
              user.longitude,
              coords.lat,
              coords.lng
            );
            const distanceText = kilometers < 1
              ? `${Math.round(meters)} meters away`
              : `${kilometers.toFixed(1)} km away`;
            setDistanceDisplay(distanceText);
          } else {
            setDistanceDisplay(null);
          }
        } catch (error) {
          console.error("Failed to convert coordinates to area name", error);
          setLocationDisplay(`${coords.lat.toFixed(3)}, ${coords.lng.toFixed(3)}`);
          setDistanceDisplay(null);
        }
      }
    };
    if (job.location) {
        processLocation();
    }
  }, [job.location, user?.location_lat, user?.location_lng]);

  const handleApply = async () => {
    if (hasApplied || !onApply) return;
    setLoading(true);
    try {
      await onApply(job.id);
      toast({
        title: t('toast.applicationSubmittedTitle', 'Application Submitted!'),
        description: t('toast.applicationSubmittedDesc', `Your application for ${job.title} has been submitted.`),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!onWithdraw) return;
    setWithdrawLoading(true);
    try {
      await onWithdraw(job.id);
      toast({
        title: t('job.withdrawSuccess', 'Application withdrawn.'),
      });
    } catch {
      toast({
        title: t('job.withdrawError', 'Failed to withdraw application.'),
        variant: 'destructive',
      });
    } finally {
      setWithdrawLoading(false);
      setWithdrawDialogOpen(false);
    }
  };

  const isOwner = user?.id === job.employer_id;

  return (
    <div className={`rounded-lg shadow-sm border border-gray-100 bg-white p-4 mb-4 flex flex-col items-start gap-4 w-full max-w-full ${compact ? 'py-2 px-3' : ''}`}>
      <div className="w-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>{job.title}</h3>
              {job.urgent && <Badge variant="destructive" className="text-xs animate-pulse">{t('job.urgent', 'Urgent')}</Badge>}
            </div>
            <p className="text-gray-600 flex items-center gap-1.5 text-sm">
              <User className="w-4 h-4 text-gray-500" />
              {job.employer?.name || job.company || 'A Reputed Company'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-gray-500" />
            <span>{typeof job.category === 'object' && job.category?.name ? job.category.name : t('job.uncategorized', 'Uncategorized')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span>{locationDisplay}</span>
            {distanceDisplay && (
              <span className="ml-2 text-xs text-blue-500 font-medium">{distanceDisplay}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-800">{formatSalary(job, t)}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{formatTimePosted(job.posted_at || job.created_at)}</span>
          </div>
        </div>

        {job.description && !compact && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">{job.description}</p>
        )}

        <div className="flex gap-3 pt-3 border-t border-gray-100 w-full">
          {isOwner ? (
            <Button onClick={() => onEdit?.(job.id)} className="flex-1">
              <Edit className="w-5 h-5 mr-2" />
              {t('job.editJob', 'Edit Job')}
            </Button>
          ) : hasApplied ? (
            <>
              <Button onClick={() => setWithdrawDialogOpen(true)} disabled={withdrawLoading} className="flex-1 bg-gray-400 text-white">
                {withdrawLoading ? t('job.withdrawing', 'Withdrawing...') : <><CheckCircle className="w-5 h-5 mr-2" />{t('job.applied', 'Applied')}</>}
              </Button>
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
            </>
          ) : (
            <Button onClick={handleApply} disabled={loading} className="flex-1">
              {loading ? t('job.applying', 'Applying...') : t('job.applyNow', 'Apply Now')}
            </Button>
          )}
          <Button variant="outline" size="icon" className="w-11 h-11" onClick={() => onViewDetails?.(job.id)}>
            <Eye className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnifiedJobCard;
