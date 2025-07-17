import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, MessageCircle, Phone, Briefcase, MapPin, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useWorkerProfile } from '@/hooks/useWorkerProfile';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';

interface WorkerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string | null;
}

const WorkerProfileModal: React.FC<WorkerProfileModalProps> = ({ isOpen, onClose, workerId }) => {
  const { worker, loading, error } = useWorkerProfile(isOpen ? workerId : null);
  const { toast } = useToast();
  const { t } = useLocalization();

  const handleHire = () => {
    toast({
      title: t('worker.hireRequestTitle', 'Hire Request Sent!'),
      description: t('worker.hireRequestDesc', 'Your hire request has been sent to {0}.', [worker?.name]),
    });
    onClose();
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="p-6 space-y-4">
          <Skeleton className="w-20 h-20 rounded-full mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-1/3 mx-auto" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }
  
    if (error || !worker) {
      return (
        <div className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h3 className="font-bold text-lg text-gray-900 mb-2">{t('errors.failedToLoadProfile', 'Could not load profile')}</h3>
          <p className="text-gray-600">{error || t('errors.genericProfileError', 'An unexpected error occurred.')}</p>
        </div>
      );
    }

    return (
      <>
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <DialogHeader>
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                  <AvatarImage src={worker.profile_photo || undefined} alt={worker.name || 'Worker'} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                    {worker.name?.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {worker.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <Shield className="w-3 h-3 text-white" fill="currentColor" />
                  </div>
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-gray-900 mb-1">{worker.name}</DialogTitle>
              <div className="text-gray-600 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-gray-500"/>
                {t('worker.generalWorker', 'General Worker')}
              </div>
            </div>
          </DialogHeader>
        </div>
  
        {/* Content */}
        <div className="p-6 space-y-5">
          {worker.bio && (
            <div>
              <h3 className="font-bold text-gray-900 mb-2">{t('worker.aboutTitle', 'About')}</h3>
              <p className="text-gray-700 leading-relaxed">{worker.bio}</p>
            </div>
          )}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">{t('worker.skillsTitle', 'Skills')}</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{t('skill.general', 'General Skills')}</Badge>
              <Badge variant="secondary">{t('skill.available', 'Available')}</Badge>
            </div>
          </div>
          {worker.location &&
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-700">{worker.location}</span>
            </div>
          }
        </div>
  
        {/* Bottom Actions */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12 rounded-xl" onClick={() => { /* Chat logic */ }}>
              <MessageCircle className="w-5 h-5 mr-2" />
              {t('worker.chat', 'Chat')}
            </Button>
            <Button className="w-full h-12 rounded-xl" onClick={handleHire}>
              {t('worker.hireNow', 'Hire')}
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl">
        <DialogHeader>
          <DialogTitle>{t('worker.profileTitle', 'Worker Profile')}</DialogTitle>
          <DialogDescription>{t('worker.profileDescription', 'View worker profile and take actions.')}</DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default WorkerProfileModal;
