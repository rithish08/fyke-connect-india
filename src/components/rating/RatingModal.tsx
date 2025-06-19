
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Job } from '@/types/job';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RatingModalProps {
  job: Job;
  open: boolean;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ job, open, onClose }) => {
  const { user } = useAuth();
  const { submitRating } = useJobs();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEmployer = user?.role === 'employer';
  const otherUserName = isEmployer ? job.applicant_name : job.employer_name;
  const otherUserId = isEmployer ? job.applicant_id : job.employer_id;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a star rating before submitting.",
        variant: "destructive"
      });
      return;
    }

    if (review.trim().length < 10) {
      toast({
        title: "Review Required",
        description: "Please provide a detailed review (minimum 10 characters).",
        variant: "destructive"
      });
      return;
    }

    if (!otherUserId) {
      toast({
        title: "Error",
        description: "Unable to identify the other user.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const { success, error } = await submitRating(job.id, otherUserId, rating, review);
      
      if (success) {
        toast({
          title: "Rating Submitted",
          description: "Thank you for your feedback!"
        });
        onClose();
      } else {
        toast({
          title: "Submission Failed",
          description: error || "Failed to submit rating. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Rate Your Experience</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-gray-600 mb-2">How was your experience with</p>
            <p className="font-semibold text-lg">{otherUserName || 'this user'}?</p>
            <p className="text-sm text-gray-500 mt-1">Job: {job.title}</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          {rating > 0 && (
            <div className="text-center text-sm text-gray-600">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </div>
          )}

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Share your experience (required)
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Describe your experience working together. This helps other users make informed decisions."
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {review.length}/500 characters
            </div>
          </div>

          {/* Professional Warning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Professional Responsibility:</strong> Your rating and review will be visible to other users. 
              Please be honest, constructive, and professional in your feedback.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.trim().length < 10 || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
