
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Zap, Eye, Send } from 'lucide-react';
import { useLocalization } from '@/hooks/useLocalization';

interface Job {
  id: number;
  title: string;
  company: string;
  category: string;
  salary: string;
  location: string;
  urgent: boolean;
  distance: string;
  postedTime: string;
  skills: string[];
}

interface JobSeekerJobCardProps {
  job: Job;
  onViewDetails?: (jobId: number) => void;
  onApply?: (jobId: number) => void;
}

const JobSeekerJobCard = ({ job, onViewDetails, onApply }: JobSeekerJobCardProps) => {
  const { getLocalizedText, formatDistance, translateCategory } = useLocalization();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(job.id);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(job.id);
    }
  };

  return (
    <ModernCard 
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
      role="article"
      aria-labelledby={`job-title-${job.id}`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 
                id={`job-title-${job.id}`}
                className="font-bold text-gray-900 truncate"
                title={job.title}
              >
                {job.title}
              </h3>
              {job.urgent && (
                <Badge 
                  variant="destructive" 
                  className="text-xs flex items-center shrink-0"
                  aria-label={getLocalizedText('job.urgent', 'Urgent job posting')}
                >
                  <Zap className="w-3 h-3 mr-1" aria-hidden="true" />
                  {getLocalizedText('job.urgent_label', 'URGENT')}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 truncate" title={job.company}>
              {job.company}
            </p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <MapPin className="w-3 h-3 mr-1 shrink-0" aria-hidden="true" />
              <span className="truncate" title={job.location}>{job.location}</span>
            </div>
          </div>
          <div className="text-right ml-4 shrink-0">
            <div className="font-semibold text-green-600" aria-label={`${getLocalizedText('job.salary', 'Salary')}: ${job.salary}`}>
              {job.salary}
            </div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
              <span title={`${getLocalizedText('job.posted', 'Posted')} ${job.postedTime}`}>
                {job.postedTime}
              </span>
            </div>
          </div>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div 
            className="flex flex-wrap gap-1"
            role="list"
            aria-label={getLocalizedText('job.required_skills', 'Required skills')}
          >
            {job.skills.slice(0, 3).map((skill, idx) => (
              <Badge 
                key={idx} 
                variant="outline" 
                className="text-xs"
                role="listitem"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 3} {getLocalizedText('common.more', 'more')}
              </Badge>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500" aria-label={`${getLocalizedText('job.distance', 'Distance')}: ${formatDistance(job.distance)}`}>
            {formatDistance(job.distance)}
          </span>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewDetails}
              aria-label={`${getLocalizedText('job.view_details', 'View details')} ${getLocalizedText('common.for', 'for')} ${job.title}`}
              className="flex items-center space-x-1"
            >
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span>{getLocalizedText('job.view_details', 'View Details')}</span>
            </Button>
            <Button 
              size="sm"
              onClick={handleApply}
              aria-label={`${getLocalizedText('job.apply_now', 'Apply now')} ${getLocalizedText('common.for', 'for')} ${job.title}`}
              className="flex items-center space-x-1"
            >
              <Send className="w-3 h-3" aria-hidden="true" />
              <span>{getLocalizedText('job.apply_now', 'Apply Now')}</span>
            </Button>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

export default JobSeekerJobCard;
