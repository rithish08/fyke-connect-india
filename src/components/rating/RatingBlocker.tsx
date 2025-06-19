
import React, { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { useJobs } from '@/contexts/JobContext';
import { useAuth } from '@/contexts/AuthContext';
import RatingModal from './RatingModal';

const RatingBlocker: React.FC = () => {
  const { pendingRatings } = useJobs();
  const { user } = useAuth();
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);

  // Block app usage if there are pending ratings
  const shouldBlock = pendingRatings.length > 0;
  const currentJob = pendingRatings[currentRatingIndex];

  const handleRatingComplete = () => {
    if (currentRatingIndex < pendingRatings.length - 1) {
      setCurrentRatingIndex(currentRatingIndex + 1);
    } else {
      setCurrentRatingIndex(0);
    }
  };

  useEffect(() => {
    // Reset index when ratings list changes
    if (pendingRatings.length === 0) {
      setCurrentRatingIndex(0);
    }
  }, [pendingRatings.length]);

  if (!shouldBlock || !currentJob || !user) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Rating Required
            </h2>
            <p className="text-gray-600 text-sm">
              You must rate your recent work experience to continue using the app. 
              This maintains trust and quality for all users.
            </p>
            {pendingRatings.length > 1 && (
              <p className="text-xs text-gray-500 mt-2">
                {currentRatingIndex + 1} of {pendingRatings.length} ratings pending
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
