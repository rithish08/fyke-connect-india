
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const [isSharing, setIsSharing] = useState(false);

  const handleConfirm = async () => {
    setIsSharing(true);
    
    try {
      await onConfirm();
      
      toast({
        title: "Number Shared Successfully",
        description: `${recipientName} can now see your phone number`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to Share Number",
        description: "Please try again later",
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
            <span>Share Phone Number</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="text-center">
            <p className="text-gray-700">
              You are about to share your personal phone number with
            </p>
            <p className="font-semibold text-lg text-gray-900 mt-1">
              {recipientName}
            </p>
            {jobTitle && (
              <p className="text-sm text-gray-500 mt-1">
                For job: {jobTitle}
              </p>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-yellow-800">
                  Professional Responsibility Notice
                </p>
                <ul className="text-xs text-yellow-700 space-y-1">
                  <li>• Only share if necessary for work coordination</li>
                  <li>• Keep all communication professional</li>
                  <li>• You can report inappropriate behavior</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-800">
                Your number: {user?.phone || 'Not available'}
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
              {isSharing ? 'Sharing...' : 'Share Number'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareNumberModal;
