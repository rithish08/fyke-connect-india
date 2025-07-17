import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';

interface ShareNumberModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientName: string;
  jobTitle?: string;
}

const ShareNumberModal: React.FC<ShareNumberModalProps> = ({
  open,
  onClose,
  onConfirm,
  recipientName,
  jobTitle
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLocalization();
  const [isSharing, setIsSharing] = useState(false);

  const handleConfirm = async () => {
    setIsSharing(true);
    
    try {
      await onConfirm();
      
      toast({
        title: t('share.successTitle', 'Number Shared Successfully'),
        description: t('share.successDesc', '{0} can now see your phone number', [recipientName]),
      });
      
      onClose();
    } catch (error) {
      toast({
        title: t('share.failedTitle', 'Failed to Share Number'),
        description: t('share.failedDesc', 'Please try again later'),
        variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-blue-600" />
            <span>{t('share.title', 'Share Phone Number')}</span>
          </DialogTitle>
          <DialogDescription>{t('share.description', 'You are about to share your phone number for work coordination. Please proceed only if necessary.')}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-gray-700">
              {t('share.aboutToShare', 'You are about to share your personal phone number with')}
            </p>
            <p className="font-semibold text-lg text-gray-900 mt-1">
              {recipientName}
            </p>
            {jobTitle && (
              <p className="text-sm text-gray-500 mt-1">
                {t('share.forJob', 'For job: {0}', [jobTitle])}
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-yellow-800">
                  {t('share.responsibilityTitle', 'Professional Responsibility Notice')}
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• {t('share.onlyIfNecessary', 'Only share if necessary for work coordination')}</li>
                  <li>• {t('share.keepProfessional', 'Keep all communication professional')}</li>
                  <li>• {t('share.canReport', 'You can report inappropriate behavior')}</li>
                  <li>• {t('share.cannotBeUndone', 'This action cannot be undone')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                {t('share.yourNumber', 'Your number: {0}', [user?.phone || t('share.notAvailable', 'Not available')])}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSharing}
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSharing}
            >
              {isSharing ? t('share.sharing', 'Sharing...') : t('share.shareNumber', 'Share Number')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareNumberModal;
