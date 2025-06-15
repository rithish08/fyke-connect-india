
import { useAuth } from '@/contexts/AuthContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import JobSeekerHomeHeader from '@/components/jobseeker/JobSeekerHomeHeader';
import JobSeekerEmptyState from '@/components/jobseeker/JobSeekerEmptyState';
import JobSeekerLoadingState from '@/components/jobseeker/JobSeekerLoadingState';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, MessageCircle, Phone, Plus } from 'lucide-react';
import { useState } from 'react';
import QuickPostModal from '@/components/job/QuickPostModal';

const JobSeekerHome = () => {
  const { user, updateProfile } = useAuth();
  const { jobs, isLoading } = useJobSeekerJobs();
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<"available" | "busy" | "offline">(user?.availability || 'available');
  const [editingRates, setEditingRates] = useState<{ [sub: string]: boolean }>({});
  const [showQuickPost, setShowQuickPost] = useState(false);

  const statusList: Array<"available" | "busy" | "offline"> = ["available", "busy", "offline"];
  
  const handleAvailabilityToggle = async () => {
    const currentIdx = statusList.indexOf(availability);
    const newStatus = statusList[(currentIdx + 1) % statusList.length];
    setAvailability(newStatus);
    await updateProfile({ availability: newStatus });
  };

  const handleRateEdit = async (subcategory: string) => {
    setEditingRates(prev => ({ ...prev, [subcategory]: true }));
    const currentAmount = user?.salaryBySubcategory?.[subcategory]?.amount ?? "";
    const newRate = window.prompt(`Enter your rate for ${subcategory} (₹):`, currentAmount);
    if (newRate && newRate !== currentAmount) {
      await updateProfile({ 
        salaryBySubcategory: {
          ...user?.salaryBySubcategory,
          [subcategory]: {
            amount: newRate,
            period: user?.salaryBySubcategory?.[subcategory]?.period || "daily"
          }
        }
      });
    }
    setEditingRates(prev => ({ ...prev, [subcategory]: false }));
  };

  if (isLoading) {
    return <JobSeekerLoadingState />;
  }

  if (!user?.primaryCategory && !user?.profileComplete) {
    return (
      <div className="space-y-6 px-4 py-6">
        <JobSeekerHomeHeader userPrimaryCategory={undefined} />
        <FloatingCard variant="glow" size="md" className="text-center py-8">
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-semibold mb-2">Complete your profile</h3>
          <p className="text-sm text-gray-600 mb-4">Set up your specializations to see relevant jobs</p>
          <Button onClick={() => navigate('/profile-setup')}>
            Complete Profile
          </Button>
        </FloatingCard>
      </div>
    );
  }

  const subcategories = user?.subcategories || Object.keys(user?.salaryBySubcategory || {});

  return (
    <div className="space-y-6 px-4 py-6">
      <JobSeekerHomeHeader userPrimaryCategory={user?.primaryCategory} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <FloatingCard variant="elevated" size="sm">
          <div className="text-center py-4">
            <Search className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium text-gray-900 mb-1">Find Jobs</p>
            <p className="text-xs text-gray-600 mb-3">Browse available work</p>
            <Button onClick={() => navigate('/search')} size="sm" className="w-full">
              Search
            </Button>
          </div>
        </FloatingCard>

        <FloatingCard variant="elevated" size="sm">
          <div className="text-center py-4">
            <Plus className="w-6 h-6 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium text-gray-900 mb-1">Quick Post</p>
            <p className="text-xs text-gray-600 mb-3">Post a job quickly</p>
            <Button onClick={() => setShowQuickPost(true)} size="sm" className="w-full" variant="outline">
              Post Job
            </Button>
          </div>
        </FloatingCard>
      </div>

      {/* Availability Management */}
      <FloatingCard variant="elevated" size="sm">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <span className={`inline-block w-3 h-3 rounded-full ${
              availability === "available" ? "bg-green-500" : availability === "busy" ? "bg-yellow-500" : "bg-gray-400"
            }`} />
            <span className="font-semibold text-gray-800">Availability:</span>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAvailabilityToggle}
          >
            {availability.charAt(0).toUpperCase() + availability.slice(1)}
          </Button>
        </div>
      </FloatingCard>

      {/* Rate Management */}
      {subcategories?.length > 0 && (
        <FloatingCard variant="elevated" size="sm">
          <div>
            <span className="font-semibold text-gray-800 mb-3 block">Your Rates</span>
            <div className="space-y-2">
              {subcategories.map((sub: string) => (
                <div key={sub} className="flex items-center justify-between text-sm py-2 border-b border-gray-100 last:border-b-0">
                  <span className="font-medium text-gray-700">{sub}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700 font-medium">
                      ₹{user?.salaryBySubcategory?.[sub]?.amount || "--"}/
                      {user?.salaryBySubcategory?.[sub]?.period ?? "daily"}
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleRateEdit(sub)}
                    >
                      ✏️
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FloatingCard>
      )}

      {/* Recommended Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Recommended for You
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>

        {jobs && jobs.length === 0 && <JobSeekerEmptyState />}

        {jobs && jobs.slice(0, 3).map(job => (
          <FloatingCard key={job.id} variant="elevated" size="sm">
            <div className="space-y-3">
              {/* Job Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{job.title}</h4>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                    <span>{job.location} • {job.distance}</span>
                    <span>₹{job.salary}</span>
                    <span>{job.timePosted}</span>
                  </div>
                </div>
                {job.urgent && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                    Urgent
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1 h-9" size="sm">
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 h-9"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3 h-9"
                >
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </FloatingCard>
        ))}
      </div>

      <QuickPostModal 
        isOpen={showQuickPost} 
        onClose={() => setShowQuickPost(false)} 
      />
    </div>
  );
};

export default JobSeekerHome;
