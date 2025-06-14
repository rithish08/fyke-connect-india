
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Zap } from 'lucide-react';

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
}

const JobSeekerJobCard = ({ job }: JobSeekerJobCardProps) => {
  return (
    <ModernCard className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-gray-900">{job.title}</h3>
              {job.urgent && (
                <Badge variant="destructive" className="text-xs flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  URGENT
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{job.company}</p>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {job.location}
            </p>
          </div>
          <div className="text-right">
            <div className="font-semibold text-green-600">{job.salary}</div>
            <div className="text-xs text-gray-500 flex items-center mt-1">
              <Clock className="w-3 h-3 mr-1" />
              {job.postedTime}
            </div>
          </div>
        </div>

        {job.skills && (
          <div className="flex flex-wrap gap-1">
            {job.skills.map((skill, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-gray-500">{job.distance} away</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              View Details
            </Button>
            <Button size="sm">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

export default JobSeekerJobCard;
