
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/hooks/useTranslation';

interface HireWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  worker: {
    id: string | number;
    name: string;
    category: string;
    rating: number;
    distance?: string;
    hourlyRate?: number;
    profileImage?: string;
    verificationLevel?: string;
  };
}

const HireWorkerModal: React.FC<HireWorkerModalProps> = ({
  isOpen,
  onClose,
  worker
}) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { translateText, translateCategory } = useTranslation();

  const handleHire = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: translateText('hire.request_sent', 'Hire Request Sent! 🎉'),
        description: translateText('hire.request_description', `Your request has been sent to ${worker.name}. They'll respond shortly.`),
      });
      setIsSubmitting(false);
      onClose();
      setMessage('');
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white rounded-3xl border-0 shadow-2xl">
        <DialogHeader className="p-6 pb-4 relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
            aria-label={translateText('common.close', 'Close modal')}
          >
            <X className="w-4 h-4" />
          </Button>
          <DialogTitle className="sr-only">{translateText('hire.title', `Hire ${worker.name}`)}</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Worker Info */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="relative">
              <Avatar className="h-16 w-16 rounded-xl border-2 border-white shadow-sm">
                <AvatarImage 
                  src={worker.profileImage || "/placeholder.svg"} 
                  alt={worker.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl">
                  {worker.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {worker.verificationLevel !== "basic" && (
                <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-white rounded-full" fill="currentColor" />
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 truncate">{worker.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{translateCategory(worker.category)}</p>
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="font-medium">{worker.rating}</span>
                </div>
                {worker.distance && (
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{worker.distance}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">₹{worker.hourlyRate || 350}</div>
              <div className="text-xs text-gray-500">{translateText('hire.per_hour', 'per hour')}</div>
            </div>
          </div>

          {/* Message Input */}
          <div className="space-y-3 mb-6">
            <label className="block text-sm font-medium text-gray-700">
              {translateText('hire.message_optional', 'Message (Optional)')}
            </label>
            <Textarea
              placeholder={translateText('hire.message_placeholder', 'Tell them about your project requirements...')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleHire}
              disabled={isSubmitting}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
            >
              {isSubmitting ? translateText('hire.sending', 'Sending Request...') : translateText('hire.hire_worker', `Hire ${worker.name}`)}
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 rounded-xl border-2 border-gray-200 font-medium hover:bg-gray-50"
            >
              {translateText('common.cancel', 'Cancel')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HireWorkerModal;
