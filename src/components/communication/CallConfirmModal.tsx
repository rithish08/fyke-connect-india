import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Shield, Info } from 'lucide-react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface CallConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientName: string;
  phoneNumber: string;
  jobTitle?: string;
}

const CallConfirmModal: React.FC<CallConfirmModalProps> = ({
  open,
  onClose,
  onConfirm,
  recipientName,
  phoneNumber,
  jobTitle
}) => {
  const { t } = useLocalization();
  const handleCall = () => {
    window.open(`tel:${phoneNumber}`, '_self');
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-green-600" />
            <span>{t('call.confirmTitle', 'Confirm Phone Call')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-gray-700">
              {t('call.aboutToCall', 'You are about to call')}
            </p>
            <p className="font-semibold text-lg text-gray-900 mt-1">
              {recipientName}
            </p>
            <p className="text-blue-600 font-mono text-sm mt-1">
              {phoneNumber}
            </p>
            {jobTitle && (
              <p className="text-sm text-gray-500 mt-1">
                {t('call.regardingJob', 'Regarding: {0}', [jobTitle])}
              </p>
            )}
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-green-800">
                  {t('call.guidelinesTitle', 'Professional Call Guidelines')}
                </p>
                <ul className="text-xs text-green-700 space-y-1">
                  <li>• {t('call.guidelineIdentify', 'Identify yourself and mention the job')}</li>
                  <li>• {t('call.guidelineRespect', 'Keep conversation work-related and respectful')}</li>
                  <li>• {t('call.guidelineConfirm', 'Confirm meeting details and requirements')}</li>
                  <li>• {t('call.guidelineEnd', 'End call professionally')}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                {t('call.dialerNotice', "This will open your phone's dialer to make the call")}
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              onClick={handleCall}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Phone className="w-4 h-4 mr-2" />
              {t('call.callNow', 'Call Now')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallConfirmModal;
