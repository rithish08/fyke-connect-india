
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, DollarSign, MessageCircle, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    salaryPeriod?: string;
    postedTime: string;
    urgent?: boolean;
    category?: string;
    description?: string;
  };
  showActions?: boolean;
  onApply?: (jobId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, showActions = true, onApply }) => {
  const [applied, setApplied] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleApply = () => {
    if (applied) return;
    
    setApplied(true);
    onApply?.(job.id);
    
    toast({
      title: "Application Submitted!",
      description: `Your application for ${job.title} has been sent.`,
    });
  };

  const handleChat = () => {
    toast({
      title: "Starting Conversation",
      description: `Opening chat with ${job.company}...`,
    });
    // Navigate to messages with job context
    navigate(`/messages?jobId=${job.id}&company=${job.company}`);
  };

  const handleCall = () => {
    toast({
      title: "Calling Employer",
      description: `Initiating call to ${job.company}...`,
    });
  };

  const handleViewDetails = () => {
    navigate(`/job/${job.id}`);
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 cursor-pointer" onClick={handleViewDetails}>
          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center space-x-1">
              <span>🏢</span>
              <span>{job.company}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={job.urgent ? "destructive" : "secondary"} className="text-xs">
              {job.urgent ? 'Urgent' : 'Regular'}
            </Badge>
            {job.category && (
              <Badge variant="outline" className="text-xs">{job.category}</Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-600">₹{job.salary}</div>
          <div className="text-xs text-gray-500">per {job.salaryPeriod || 'day'}</div>
        </div>
      </div>
      
      {showActions && (
        <>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 mb-3">
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Posted {job.postedTime}</span>
            </span>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={handleApply}
              disabled={applied}
              className={`w-full ${applied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {applied ? '✓ Applied' : 'Apply Now'}
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleChat}
                className="flex-1"
              >
                <MessageCircle className="w-4 h-4 mr-1" />
                Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-1" />
                Call
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default JobCard;
