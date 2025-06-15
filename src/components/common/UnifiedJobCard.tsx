
import React from 'react';
import { Clock, MapPin, DollarSign, Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import { Badge } from '@/components/ui/badge';

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
}

const UnifiedJobCard: React.FC<UnifiedJobCardProps> = ({ 
  job, 
  onApply, 
  onViewDetails,
  compact = false 
}) => {
  return (
    <AestheticCard 
      variant="elevated" 
      className={`transition-all duration-200 ${compact ? 'p-4' : 'p-6'}`}
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

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={onApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-medium"
          >
            Apply Now
          </Button>
          <Button
            onClick={onViewDetails}
            variant="outline"
            className="px-6 h-11 rounded-xl border-gray-200"
          >
            Details
          </Button>
        </div>
      </div>
    </AestheticCard>
  );
};

export default UnifiedJobCard;
