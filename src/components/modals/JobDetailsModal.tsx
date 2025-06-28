import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Star, Building2, Users, X } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Job } from '@/types/job';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
}

const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ isOpen, onClose, job }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();

  const handleApply = () => {
    toast({
      title: t('job.applySuccessTitle', 'Application Submitted!'),
      description: t('job.applySuccessDesc', "Your application has been sent to the employer. You'll be notified of updates."),
    });
    onClose();
  };

  const handleSave = () => {
    toast({
      title: t('job.saveSuccessTitle', 'Job Saved'),
      description: t('job.saveSuccessDesc', 'This job has been saved to your favorites.'),
    });
  };

  const handleContact = () => {
    toast({
      title: t('job.contactTitle', 'Contact Employer'),
      description: t('job.contactDesc', 'Opening message thread with employer.'),
    });
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 p-6 pb-4 border-b border-gray-100 rounded-t-3xl">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-2">
                  <DialogTitle className="text-xl font-bold text-gray-900">{job.title}</DialogTitle>
                  {job.urgent && (
                    <Badge variant="destructive" className="bg-red-500 text-xs">{t('job.urgent', 'Urgent')}</Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-lg text-gray-700 font-medium">{job.company}</h3>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🚶</span>
                    <span>{job.distance}</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-600">₹{job.salary}</div>
                <div className="text-sm text-gray-600">{job.type}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-3">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{t('job.posted', 'Posted {0}', [job.postedTime])}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>{t('job.applications', '{0} applications', [job.applications])}</span>
              </span>
            </div>
          </DialogHeader>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('job.description', 'Job Description')}</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <Separator />

          {/* Requirements */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('job.requirements', 'Requirements')}</h3>
            <ul className="space-y-2">
              {job.requirements?.map((req: string, index: number) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700">
                  <span className="text-green-500 mt-1">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('job.benefits', 'Benefits')}</h3>
            <ul className="space-y-2">
              {job.benefits?.map((benefit: string, index: number) => (
                <li key={index} className="flex items-start space-x-2 text-gray-700">
                  <span className="text-blue-500 mt-1">💎</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* About Employer */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{t('job.aboutEmployer', 'About Employer')}</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{job.employer?.name}</span>
                  {job.employer?.verified && (
                    <Badge variant="secondary" className="text-xs">
                      ✓ {t('job.verified', 'Verified')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span className="font-medium">{job.employer?.rating}</span>
                  <span className="text-sm text-gray-500">({job.employer?.totalReviews})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 rounded-b-3xl">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="flex items-center space-x-2 h-12 rounded-xl flex-1"
            >
              <span>💾</span>
              <span>{t('job.save', 'Save')}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleContact}
              className="flex items-center space-x-2 h-12 rounded-xl flex-1"
            >
              <span>💬</span>
              <span>{t('job.message', 'Message')}</span>
            </Button>
            
            <Button
              onClick={handleApply}
              className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex-1"
            >
              {user?.role === 'employer' ? t('job.contact', 'Contact') : t('job.apply', 'Apply')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
