import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Job } from '@/types/job';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useLocalization } from '@/contexts/LocalizationContext';

interface RatingModalProps {
  job: Job;
  open: boolean;
  onClose: () => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ job, open, onClose }) => {
  const { user } = useAuth();
  const { submitRating } = useJobs();
  const { toast } = useToast();
  const { t } = useLocalization();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEmployer = user?.role === 'employer';
  const otherUserName = isEmployer ? job.applicant_name : job.employer_name;
  const otherUserId = isEmployer ? job.applicant_id : job.employer_id;

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: t('rating.requiredTitle', 'Rating Required'),
        description: t('rating.requiredDesc', 'Please select a star rating before submitting.'),
        variant: 'destructive'
      });
      return;
    }

    if (review.trim().length < 10) {
      toast({
        title: t('rating.reviewRequiredTitle', 'Review Required'),
        description: t('rating.reviewRequiredDesc', 'Please provide a detailed review (minimum 10 characters).'),
        variant: 'destructive'
      });
      return;
    }

    if (!otherUserId) {
      toast({
        title: t('common.error', 'Error'),
        description: t('rating.noOtherUser', 'Unable to identify the other user.'),
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const { success, error } = await submitRating(job.id, otherUserId, rating, review);
      
      if (success) {
        toast({
          title: t('rating.submittedTitle', 'Rating Submitted'),
          description: t('rating.submittedDesc', 'Thank you for your feedback!')
        });
        onClose();
      } else {
        toast({
          title: t('rating.failedTitle', 'Submission Failed'),
          description: error || t('rating.failedDesc', 'Failed to submit rating. Please try again.'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: t('rating.failedTitle', 'Submission Failed'),
        description: t('rating.unexpectedError', 'An unexpected error occurred. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{t('rating.title', 'Rate Your Experience')}</DialogTitle>
          <DialogDescription>{t('rating.description', 'Please rate your experience and leave a review. Your feedback helps improve the community.')}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{t('rating.experiencePrompt', 'How was your experience with')}</p>
            <p className="font-semibold text-lg">{otherUserName || t('rating.thisUser', 'this user')}?</p>
            <p className="text-sm text-gray-500 mt-1">{t('rating.jobLabel', 'Job')}: {job.title}</p>
          </div>

          {/* Star Rating */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-1 transition-colors"
                aria-label={t('rating.star', 'Rate {0} star', [star.toString()])}
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
              {rating === 1 && t('rating.poor', 'Poor')}
              {rating === 2 && t('rating.fair', 'Fair')}
              {rating === 3 && t('rating.good', 'Good')}
              {rating === 4 && t('rating.veryGood', 'Very Good')}
              {rating === 5 && t('rating.excellent', 'Excellent')}
            </div>
          )}

          {/* Review Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('rating.reviewLabel', 'Share your experience (required')}
            </label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={t('rating.reviewPlaceholder', 'Describe your experience working together. This helps other users make informed decisions.')}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 mt-1 text-right">
              {t('rating.charCount', '{0}/500 characters', [review.length.toString()])}
            </div>
          </div>

          {/* Professional Warning */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>{t('rating.professionalResponsibility', 'Professional Responsibility:')}</strong> {t('rating.professionalWarning', 'Your rating and review will be visible to other users. Please be honest, constructive, and professional in your feedback.')}
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || review.trim().length < 10 || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
            aria-label={submitting ? t('rating.submitting', 'Submitting...') : t('rating.submit', 'Submit Rating')}
          >
            {submitting ? t('rating.submitting', 'Submitting...') : t('rating.submit', 'Submit Rating')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
