
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import { useLoginProtection } from '@/hooks/useLoginProtection';
import JobApplicationSubmission from '@/components/applications/JobApplicationSubmission';
import CommunicationButtons from '@/components/communication/CommunicationButtons';
import { MapPin, Clock, DollarSign } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  urgent?: boolean;
  description: string;
  postedAt: string;
  skills?: string[];
}

interface JobSeekerJobCardProps {
  job: Job;
}

const JobSeekerJobCard: React.FC<JobSeekerJobCardProps> = ({ job }) => {
  const { goTo } = useScreenNavigation();
  const { requireLogin } = useLoginProtection();

  const handleViewDetails = () => {
    goTo(`/job/${job.id}`);
  };

  const handleMessage = () => {
    requireLogin(() => {
      // Communication buttons will handle the actual navigation
    }, "Please log in to contact employers");
  };

  return (
    <ModernCard className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900">{job.title}</h3>
            {job.urgent && (
              <Badge variant="destructive" className="text-xs">Urgent</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600">{job.company}</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{job.salary}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{job.postedAt}</span>
        </div>
      </div>

      <p className="text-sm text-gray-700 mb-4 line-clamp-2">{job.description}</p>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {job.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 3} more
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-2">
        <JobApplicationSubmission job={job} />
        <Button 
          variant="outline" 
          onClick={handleViewDetails}
          className="px-3"
        >
          View
        </Button>
        <div className="px-3">
          <CommunicationButtons
            targetId={job.company}
            targetName={job.company}
            targetType="employer"
            size="sm"
            showCall={false}
            context={`Interested in ${job.title}`}
          />
        </div>
      </div>
    </ModernCard>
  );
};

export default JobSeekerJobCard;
