
import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Star, User, MessageCircle, Phone, ToggleLeft, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

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
}

interface UnifiedJobCardProps {
  job: Job;
  onApply?: () => void;
  onViewDetails?: () => void;
  compact?: boolean;
  showCommunication?: boolean;
  showAvailabilitySwitch?: boolean;
  showRateSettings?: boolean;
}

const UnifiedJobCard: React.FC<UnifiedJobCardProps> = ({ 
  job, 
  onApply, 
  onViewDetails,
  compact = false,
  showCommunication = true,
  showAvailabilitySwitch = false,
  showRateSettings = false
}) => {
  const { toast } = useToast();
  const [applicationState, setApplicationState] = useState<'idle' | 'requested'>('idle');
  const [isAvailable, setIsAvailable] = useState(true);

  const handleApply = () => {
    setApplicationState('requested');
    toast({
      title: 'Application Submitted!',
      description: `Your application for ${job.title} has been submitted.`,
    });
    onApply?.();
  };

  const handleCommunication = (type: 'chat' | 'call') => {
    toast({
      title: `${type === 'chat' ? 'Chat' : 'Call'} feature coming soon!`,
      description: `${type === 'chat' ? 'Messaging' : 'Calling'} ${job.company} will be available soon.`
    });
  };

  const handleRateSettings = () => {
    toast({
      title: 'Rate Settings',
      description: 'Rate configuration feature coming soon!'
    });
  };

  return (
    <AestheticCard 
      variant="elevated" 
      className={`transition-all duration-200 hover:shadow-lg ${compact ? 'p-4' : 'p-6'}`}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className={`font-bold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
                {job.title}
              </h3>
              {job.urgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
            </div>
            <p className="text-gray-600 flex items-center gap-1 text-sm">
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
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
            <span className="text-gray-400">• {job.distance}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium text-gray-900">₹{job.salary}/day</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{job.timePosted}</span>
          </div>
        </div>

        {/* Description */}
        {job.description && !compact && (
          <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
        )}

        {/* Availability Switch */}
        {showAvailabilitySwitch && (
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <ToggleLeft className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Available for work</span>
            </div>
            <Switch
              checked={isAvailable}
              onCheckedChange={setIsAvailable}
            />
          </div>
        )}

        {/* Rate Settings */}
        {showRateSettings && (
          <div className="flex items-center justify-between py-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Rate Settings</span>
            </div>
            <Button
              onClick={handleRateSettings}
              variant="outline"
              size="sm"
              className="h-8 px-3"
            >
              Configure
            </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleApply}
            disabled={applicationState === 'requested'}
            className={`flex-1 h-11 rounded-xl font-medium transition-all ${
              applicationState === 'requested'
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {applicationState === 'requested' ? 'Requested' : 'Apply Now'}
          </Button>
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="px-6 h-11 rounded-xl border-gray-200"
          >
            Details
          </Button>
        </div>

        {/* Communication Buttons */}
        {showCommunication && (
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
        )}
      </div>
    </AestheticCard>
  );
};

export default UnifiedJobCard;
