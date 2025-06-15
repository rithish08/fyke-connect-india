
import { useAuth } from '@/contexts/AuthContext';
import { useJobSeekerJobs } from '@/hooks/useJobSeekerJobs';
import JobSeekerHomeHeader from '@/components/jobseeker/JobSeekerHomeHeader';
import JobSeekerJobCard from '@/components/jobseeker/JobSeekerJobCard';
import JobSeekerEmptyState from '@/components/jobseeker/JobSeekerEmptyState';
import JobSeekerLoadingState from '@/components/jobseeker/JobSeekerLoadingState';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Search, Briefcase, Settings, ToggleLeft, Pencil } from 'lucide-react';
import { useState } from 'react';

const JobSeekerHome = () => {
  const { user, updateProfile } = useAuth();
  const { jobs, isLoading } = useJobSeekerJobs();
  const navigate = useNavigate();
  // Availability: only "available" | "busy" | "offline"
  const [availability, setAvailability] = useState<"available" | "busy" | "offline">(user?.availability || 'available');
  // Remove use of hourlyRate, use salaryBySubcategory if present
  const [editingRates, setEditingRates] = useState<{ [sub: string]: boolean }>({});

  // Handler for availability toggle (cycle through statuses)
  const statusList: Array<"available" | "busy" | "offline"> = ["available", "busy", "offline"];
  const handleAvailabilityToggle = async () => {
    const currentIdx = statusList.indexOf(availability);
    const newStatus = statusList[(currentIdx + 1) % statusList.length];
    setAvailability(newStatus);
    await updateProfile({ availability: newStatus });
  };

  // Handler for editing rate for a subcategory
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

  // Complete profile CTA if necessary
  if (!user?.primaryCategory && !user?.profileComplete) {
    return (
      <div className="space-y-4 px-4">
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

  // Subcategories list (for rate UI)
  const subcategories = user?.subcategories || Object.keys(user?.salaryBySubcategory || {});

  return (
    <div className="space-y-4 px-4">
      <JobSeekerHomeHeader userPrimaryCategory={user?.primaryCategory} />

      {/* Availability Management */}
      <FloatingCard variant="elevated" size="sm" className="mb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className={`inline-block w-3 h-3 rounded-full ${
              availability === "available" ? "bg-green-500" : availability === "busy" ? "bg-yellow-500" : "bg-gray-400"
            }`} />
            <span className="font-semibold text-gray-800 select-none">Availability:</span>
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={handleAvailabilityToggle}
            >
              {availability.charAt(0).toUpperCase() + availability.slice(1)}
            </Button>
          </div>
        </div>
      </FloatingCard>

      {/* Rate Management */}
      {subcategories?.length > 0 && (
        <FloatingCard variant="elevated" size="sm" className="mb-2">
          <div>
            <span className="font-semibold text-gray-800">Your Rates</span>
            <div className="mt-2 space-y-1">
              {subcategories.map((sub: string) => (
                <div key={sub} className="flex items-center gap-4 text-sm">
                  <span className="min-w-[120px] font-medium">{sub}</span>
                  <span className="ml-1 text-blue-700">
                    ₹{user?.salaryBySubcategory?.[sub]?.amount || "--"}/
                    {user?.salaryBySubcategory?.[sub]?.period ?? "daily"}
                  </span>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => handleRateEdit(sub)}
                    className="ml-2"
                  >✏️</Button>
                </div>
              ))}
            </div>
          </div>
        </FloatingCard>
      )}

      {/* Quick Actions */}
      <FloatingCard variant="elevated" size="sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Find Your Next Job</h3>
            <p className="text-sm text-gray-600">Browse jobs matching your skills</p>
          </div>
          <Button onClick={() => navigate('/search')} size="sm">
            <Search className="w-4 h-4 mr-1" />
            Search Jobs
          </Button>
        </div>
      </FloatingCard>

      {/* Recommended Jobs */}
      <div className="space-y-3">
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
          <JobSeekerJobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobSeekerHome;
