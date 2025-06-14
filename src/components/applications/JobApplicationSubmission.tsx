
import React, { useState } from 'react';
import { useJobApplication } from '@/hooks/useJobApplication';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ConfirmationDialog from '@/components/dialogs/ConfirmationDialog';
import { Loader2, Send } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  company: string;
}

interface JobApplicationSubmissionProps {
  job: Job;
  onSuccess?: () => void;
  buttonText?: string;
  buttonClassName?: string;
}

const JobApplicationSubmission: React.FC<JobApplicationSubmissionProps> = ({
  job,
  onSuccess,
  buttonText = "Apply Now",
  buttonClassName = "flex-1 bg-blue-600 hover:bg-blue-700"
}) => {
  const { applyToJob, isApplying, canApply } = useJobApplication();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const handleApplyClick = () => {
    if (!canApply) return;
    setShowApplicationForm(true);
  };

  const handleSubmitApplication = async () => {
    const success = await applyToJob(job);
    if (success) {
      setShowApplicationForm(false);
      setCoverLetter('');
      onSuccess?.();
    }
  };

  return (
    <>
      <Button 
        onClick={handleApplyClick}
        className={buttonClassName}
        disabled={isApplying || !canApply}
      >
        {isApplying ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Applying...
          </>
        ) : (
          buttonText
        )}
      </Button>

      <ConfirmationDialog
        open={showApplicationForm}
        onOpenChange={setShowApplicationForm}
        title="Submit Application"
        description=""
        confirmText="Submit Application"
        onConfirm={handleSubmitApplication}
      >
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Apply for {job.title}</h3>
            <p className="text-gray-600">at {job.company}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell the employer why you're the right fit for this job..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              Your profile information will be shared with the employer along with this application.
            </p>
          </div>
        </div>
      </ConfirmationDialog>
    </>
  );
};

export default JobApplicationSubmission;
