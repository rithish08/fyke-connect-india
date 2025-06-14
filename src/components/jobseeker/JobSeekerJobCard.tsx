
import React, { useState } from 'react';
import { Clock, MapPin, DollarSign, Star, User, Bookmark, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModernCard } from '@/components/ui/modern-card';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  distance: string;
  timePosted: string;
  rating?: number;
  urgent?: boolean;
  description?: string;
  applicants?: number;
  verified?: boolean;
}

interface JobSeekerJobCardProps {
  job: Job;
}

const JobSeekerJobCard: React.FC<JobSeekerJobCardProps> = ({ job }) => {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError } = useGlobalToast();
  const { goTo } = useScreenNavigation();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!isAuthenticated) {
      localStorage.setItem('fyke_return_intent', `/job/${job.id}`);
      showError('Please login to apply for jobs');
      goTo('/login');
      return;
    }

    if (!user?.profileComplete) {
      showError('Please complete your profile to apply for jobs');
      goTo('/profile-setup');
      return;
    }

    setIsApplying(true);
    // Simulate application process
    setTimeout(() => {
      showSuccess(`Applied to ${job.title} successfully!`);
      setIsApplying(false);
    }, 1500);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    showSuccess(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.title,
        text: `Check out this job: ${job.title} at ${job.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSuccess('Job link copied to clipboard');
    }
  };

  const handleViewDetails = () => {
    goTo(`/job/${job.id}`);
  };

  return (
    <ModernCard className="p-4 mb-3 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <div className="space-y-3">
        {/* Header with actions */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
              {job.urgent && (
                <Badge className="bg-red-100 text-red-600 px-2 py-1 text-xs font-medium">
                  Urgent
                </Badge>
              )}
              {job.verified && (
                <Badge className="bg-blue-100 text-blue-600 px-2 py-1 text-xs font-medium">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-gray-600 flex items-center gap-1">
              <User className="w-4 h-4" />
              {job.company}
            </p>
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full transition-colors ${
                isBookmarked ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400 hover:text-gray-600'
              }`}
            >
              <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Job details with better visual hierarchy */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-3 text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
              <span className="text-gray-400">• {job.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-700">{job.salary}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{job.timePosted}</span>
            </div>
            {job.applicants && (
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{job.applicants} applicants</span>
              </div>
            )}
            {job.rating && (
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-green-500 text-green-500" />
                <span className="text-green-700 font-medium text-xs">{job.rating}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {job.description && (
          <p className="text-gray-600 text-sm line-clamp-2 bg-gray-50 p-3 rounded-lg">
            {job.description}
          </p>
        )}

        {/* Enhanced action buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleApply}
            disabled={isApplying}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-11 rounded-xl font-medium transition-all duration-200"
          >
            {isApplying ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Applying...
              </>
            ) : (
              'Apply Now'
            )}
          </Button>
          <Button
            onClick={handleViewDetails}
            variant="outline"
            className="px-6 h-11 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            Details
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span>Posted by verified employer</span>
          <span>Response rate: 95%</span>
        </div>
      </div>
    </ModernCard>
  );
};

export default JobSeekerJobCard;
