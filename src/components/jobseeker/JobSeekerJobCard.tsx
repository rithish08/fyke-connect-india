
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Star, MessageSquare, Phone, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface JobCardProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    distance: string;
    salary: string;
    rating: number;
    timePosted: string;
    urgent?: boolean;
    description?: string;
    requirements?: string[];
    benefits?: string[];
  };
  onApply?: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  applied?: boolean;
  saved?: boolean;
}

const JobSeekerJobCard: React.FC<JobCardProps> = ({ 
  job, 
  onApply, 
  onSave, 
  applied = false, 
  saved = false 
}) => {
  const { userProfile, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [localApplied, setLocalApplied] = useState(applied);
  const [localSaved, setLocalSaved] = useState(saved);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply for jobs');
      navigate('/auth');
      return;
    }

    if (!userProfile?.profile_complete) {
      toast.error('Please complete your profile to apply for jobs');
      navigate('/profile-setup');
      return;
    }

    setLocalApplied(true);
    onApply?.(job.id);
    toast.success(`Applied to ${job.title} successfully!`);
  };

  const handleSave = () => {
    if (!isAuthenticated) {
      toast.error('Please login to save jobs');
      navigate('/auth');
      return;
    }

    setLocalSaved(!localSaved);
    onSave?.(job.id);
    toast.success(`Job ${localSaved ? 'removed from' : 'added to'} saved jobs`);
  };

  const handleCommunicate = (type: 'chat' | 'call') => {
    if (!localApplied) {
      toast.error('Please apply to this job first to start communication');
      return;
    }

    if (type === 'chat') {
      navigate(`/messages?jobId=${job.id}&jobTitle=${job.title}`);
    } else {
      toast.success('Calling feature will be available soon!');
    }
  };

  return (
    <Card className="mb-4 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
              {job.urgent && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600 font-medium">{job.company}</p>
            
            {/* Job Info */}
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{job.location} • {job.distance}</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                <span>₹{job.salary}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{job.timePosted}</span>
              </div>
              {job.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{job.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            className="ml-2 p-1"
          >
            <Bookmark className={`w-4 h-4 ${localSaved ? 'fill-blue-500 text-blue-500' : 'text-gray-400'}`} />
          </Button>
        </div>

        {/* Expandable Content */}
        {isExpanded && (
          <div className="mb-4 space-y-3">
            {job.description && (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">Description</h4>
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>
            )}
            
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">Requirements</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {job.benefits && job.benefits.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-1">Benefits</h4>
                <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                  {job.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            onClick={handleApply}
            disabled={localApplied}
            className={`flex-1 h-9 ${localApplied ? 'bg-green-600 hover:bg-green-700' : ''}`}
            size="sm"
          >
            {localApplied ? '✓ Applied' : 'Apply Now'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 h-9"
          >
            {isExpanded ? 'Less' : 'More'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCommunicate('chat')}
            disabled={!localApplied}
            className="px-3 h-9"
            title="Chat with employer"
          >
            <MessageSquare className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCommunicate('call')}
            disabled={!localApplied}
            className="px-3 h-9"
            title="Call employer"
          >
            <Phone className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobSeekerJobCard;
