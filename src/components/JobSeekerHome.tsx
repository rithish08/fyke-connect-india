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

const AVAILABILITY_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'busy', label: 'Busy' },
  { value: 'offline', label: 'Do Not Disturb' } // Changed from "dnd" to "offline"
];

const JobSeekerHome = () => {
  const { user, updateProfile } = useAuth();
  const { jobs, isLoading } = useJobSeekerJobs();
  const navigate = useNavigate();
  // Use only allowed availability values
  const [availability, setAvailability] = useState<'available' | 'busy' | 'offline'>(
    (user?.availability as 'available' | 'busy' | 'offline') || 'available'
  );
  // We'll show rate only if categories are non-vehicle, non-special, and have a salary entry
  const isShowRate = Boolean(user?.salaryBySubcategory && Object.keys(user.salaryBySubcategory).length);

  const [rateEdits, setRateEdits] = useState<{ [key: string]: string }>(() => {
    if (user?.salaryBySubcategory) {
      const result: { [key: string]: string } = {};
      for (const sub in user.salaryBySubcategory) {
        result[sub] = user.salaryBySubcategory[sub]?.amount || '';
      }
      return result;
    }
    return {};
  });

  // Handler for availability toggle
  const handleAvailabilitySelect = async (status: 'available' | 'busy' | 'offline') => {
    setAvailability(status);
    await updateProfile({ availability: status });
  };

  // Handler for editing individual rate
  const handleRateEdit = async (sub: string) => {
    const current = rateEdits[sub] || '';
    const newRate = window.prompt(`Enter rate (₹) for ${sub}:`, current);
    if (newRate !== null && newRate !== current) {
      const updated = { ...rateEdits, [sub]: newRate };
      setRateEdits(updated);
      await updateProfile({
        salaryBySubcategory: {
          ...user?.salaryBySubcategory,
          [sub]: {
            ...user?.salaryBySubcategory?.[sub],
            amount: newRate
          }
        }
      });
    }
  };

  if (isLoading) {
    return <JobSeekerLoadingState />;
  }

  // Show message if user hasn't completed profile
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

  return (
    <div className="space-y-4 px-4">
      <JobSeekerHomeHeader userPrimaryCategory={user?.primaryCategory} />

      {/* Availability & Rate Management */}
      <FloatingCard variant="elevated" size="sm" className="mb-2">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-between">
            <div className="flex items-center gap-3">
              <ToggleLeft className="w-6 h-6 text-gray-500" />
              <span className="font-semibold text-gray-800">Availability</span>
              <div className="flex gap-2 ml-2">
                {AVAILABILITY_OPTIONS.map(opt => (
                  <Button
                    key={opt.value}
                    size="sm" // changed from "xs" to "sm"
                    className={`rounded-full border font-semibold ${
                      availability === opt.value
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                    onClick={() => handleAvailabilitySelect(opt.value as any)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {isShowRate && (
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span className="font-semibold text-gray-800">Your Rates:</span>
                <div className="flex gap-2">
                  {Object.entries(user.salaryBySubcategory || {}).map(([sub, val]) => (
                    <span key={sub} className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-full text-xs">
                      {sub}: ₹{val.amount || '--'}/{val.period}
                      <Button size="icon" variant="ghost" onClick={() => handleRateEdit(sub)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </FloatingCard>

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
      <div className="space-y-3 pb-6">
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
