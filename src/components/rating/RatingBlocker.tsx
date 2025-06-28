import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import RatingModal from './RatingModal';
import { useLocalization } from '@/contexts/LocalizationContext';

function loadPendingRatings() {
  return JSON.parse(localStorage.getItem('fyke_pending_ratings') || '[]');
}

function savePendingRatings(ratings) {
  localStorage.setItem('fyke_pending_ratings', JSON.stringify(ratings));
}

const RatingBlocker: React.FC = () => {
  const { pendingRatings } = useJobs();
  const { user } = useAuth();
  const { t } = useLocalization();
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
  const [localPendingRatings, setLocalPendingRatings] = useState(loadPendingRatings());

  // Block app usage if there are pending ratings
  const shouldBlock = localPendingRatings.length > 0;
  const currentJob = localPendingRatings[currentRatingIndex];

  const handleRatingComplete = () => {
    if (currentRatingIndex < localPendingRatings.length - 1) {
      setCurrentRatingIndex(currentRatingIndex + 1);
    } else {
      setCurrentRatingIndex(0);
      // Remove completed job from local storage
      const updated = loadPendingRatings().filter((_, i) => i !== currentRatingIndex);
      savePendingRatings(updated);
      setLocalPendingRatings(updated);
    }
  };

  useEffect(() => {
    // Sync with context and localStorage
    if (pendingRatings.length > 0) {
      setLocalPendingRatings(pendingRatings);
      savePendingRatings(pendingRatings);
    } else {
      setLocalPendingRatings([]);
      savePendingRatings([]);
    }
  }, [pendingRatings]);

  if (!shouldBlock || !currentJob || !user) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => {}} aria-modal="true" role="dialog" aria-labelledby="rating-required-title">
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" aria-hidden="false">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4" tabIndex={0} aria-labelledby="rating-required-title">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl" aria-label="Star">⭐</span>
            </div>
            <h2 id="rating-required-title" className="text-xl font-bold text-gray-900 mb-2">
              {t('rating.requiredTitle', 'Rating Required')}
            </h2>
            <p className="text-gray-600 text-sm">
              {t('rating.requiredDesc', 'You must rate your recent work experience to continue using the app. This maintains trust and quality for all users.')}
            </p>
            {localPendingRatings.length > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                {t('rating.pendingCount', '{0} of {1} ratings pending', [(currentRatingIndex + 1).toString(), localPendingRatings.length.toString()])}
              </p>
            )}
          </div>
          
          <RatingModal
            job={currentJob}
            open={true}
            onClose={handleRatingComplete}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default RatingBlocker;
