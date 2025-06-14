
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Building2 } from 'lucide-react';
import JobDetailsModal from '@/components/modals/JobDetailsModal';

interface JobSeekerJobCardProps {
  job: any;
}

const JobSeekerJobCard = ({ job }: JobSeekerJobCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <ModernCard 
        className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 bg-white rounded-2xl"
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{job.title}</h3>
                {job.urgent && (
                  <Badge variant="destructive" className="bg-red-500 text-xs px-2 py-0.5">
                    Urgent
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 font-medium">{job.company}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">₹{job.salary}</div>
              <div className="text-sm text-gray-500">{job.type}</div>
            </div>
          </div>

          {/* Location and Distance */}
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

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{job.postedTime}</span>
              </span>
              {job.employer?.rating && (
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                  <span>{job.employer.rating}</span>
                </span>
              )}
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {job.applications} applied
            </div>
          </div>
        </div>
      </ModernCard>

      <JobDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        job={job}
      />
    </>
  );
};

export default JobSeekerJobCard;
