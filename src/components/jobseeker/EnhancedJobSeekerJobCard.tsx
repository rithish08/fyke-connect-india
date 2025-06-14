
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLoginProtection } from '@/hooks/useLoginProtection';
import { useToast } from '@/hooks/use-toast';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog';
import { MapPin, Clock, DollarSign, Users } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  urgent?: boolean;
  description: string;
  requirements?: string[];
  postedAt: string;
}

interface EnhancedJobSeekerJobCardProps {
  job: Job;
}

const EnhancedJobSeekerJobCard: React.FC<EnhancedJobSeekerJobCardProps> = ({ job }) => {
  const { requireLogin } = useLoginProtection();
  const { toast } = useToast();
  const { goTo } = useScreenNavigation();
  const [showApplyConfirm, setShowApplyConfirm] = useState(false);

  const handleApply = () => {
    requireLogin(() => {
      setShowApplyConfirm(true);
    }, "Please log in to apply for jobs");
  };

  const confirmApply = () => {
    // TODO: Implement actual application logic
    toast({
      title: "Application Submitted",
      description: `Your application for ${job.title} has been submitted successfully.`
    });
    setShowApplyConfirm(false);
  };

  const handleViewDetails = () => {
    goTo(`/job/${job.id}`);
  };

  const handleMessage = () => {
    requireLogin(() => {
      goTo('/messages');
    }, "Please log in to contact employers");
  };

  return (
    <>
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

        <div className="flex gap-2">
          <Button 
            onClick={handleApply}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Apply Now
          </Button>
          <Button 
            variant="outline" 
            onClick={handleViewDetails}
            className="px-3"
          >
            View
          </Button>
          <Button 
            variant="outline" 
            onClick={handleMessage}
            className="px-3"
          >
            <Users className="w-4 h-4" />
          </Button>
        </div>
      </ModernCard>

      <ConfirmationDialog
        open={showApplyConfirm}
        onOpenChange={setShowApplyConfirm}
        title="Confirm Application"
        description={`Are you sure you want to apply for ${job.title} at ${job.company}?`}
        confirmText="Apply"
        onConfirm={confirmApply}
      />
    </>
  );
};

export default EnhancedJobSeekerJobCard;
