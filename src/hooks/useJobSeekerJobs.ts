
import { useState, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockJobs } from '@/data/mockJobs';
import { useGlobalToast } from './useGlobalToast';
import { supabaseService } from '@/services/supabaseService';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  urgent: boolean;
  postedDate: string;
  salary: string;
  salaryType: 'hourly' | 'fixed';
  availability: 'full-time' | 'part-time' | 'contract';
  status: 'active' | 'inactive';
  verified: boolean;
  category: string;
}

interface FilterOptions {
  urgentOnly: boolean;
  availabilityFilter: 'all' | 'full-time' | 'part-time' | 'contract';
  onlyShowVerified: boolean;
  sortBy: 'relevance' | 'date' | 'salary';
}

export const useJobSeekerJobs = () => {
  const { userProfile } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useGlobalToast();
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    urgentOnly: false,
    availabilityFilter: 'all',
    onlyShowVerified: false,
    sortBy: 'relevance',
  });

  const { urgentOnly, availabilityFilter, onlyShowVerified, sortBy } = filterOptions;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate fetching jobs from a service
      // In a real application, replace this with an actual API call
      const fetchedJobs = mockJobs['construction'] || [];
      setJobs(fetchedJobs);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch jobs');
      showError(e.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const postJobApplication = useCallback(async (jobId: string) => {
    setLoading(true);
    setError(null);
    try {
      // Simulate posting a job application
      // In a real application, replace this with an actual API call
      showSuccess('Job application submitted successfully!');
    } catch (e: any) {
      setError(e.message || 'Failed to submit job application');
      showError(e.message || 'Failed to submit job application');
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const setUrgentOnlyFilter = (value: boolean) => {
    setFilterOptions(prev => ({ ...prev, urgentOnly: value }));
  };

  const setAvailabilityFilter = (value: 'all' | 'full-time' | 'part-time' | 'contract') => {
    setFilterOptions(prev => ({ ...prev, availabilityFilter: value }));
  };

  const setOnlyShowVerifiedFilter = (value: boolean) => {
    setFilterOptions(prev => ({ ...prev, onlyShowVerified: value }));
  };

  const setSortBy = (value: 'relevance' | 'date' | 'salary') => {
    setFilterOptions(prev => ({ ...prev, sortBy: value }));
  };

  const filteredJobs = useMemo(() => {
    if (!userProfile?.primary_category || !userProfile?.profile_complete) {
      return [];
    }

    const categoryKey = userProfile.primary_category.toLowerCase();
    const categoryJobs = mockJobs[categoryKey] || [];

    // Ensure categoryJobs is always an array
    const jobsArray = Array.isArray(categoryJobs) ? categoryJobs : [];
    let result = [...jobsArray];

    if (urgentOnly) {
      result = result.filter(job => job.urgent);
    }

    if (availabilityFilter !== 'all') {
      result = result.filter(job => job.availability === availabilityFilter);
    }

    if (onlyShowVerified) {
      result = result.filter(job => job.verified);
    }

    switch (sortBy) {
      case 'date':
        result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
        break;
      case 'salary':
        result.sort((a, b) => {
          const salaryA = parseInt(a.salary.replace(/[^0-9]/g, ''));
          const salaryB = parseInt(b.salary.replace(/[^0-9]/g, ''));
          return salaryB - salaryA;
        });
        break;
      default:
        // Already sorted by relevance in mock data
        break;
    }

    return result;
  }, [userProfile, urgentOnly, availabilityFilter, onlyShowVerified, sortBy]);

  return {
    jobs: filteredJobs,
    loading,
    error,
    fetchJobs,
    postJobApplication,
    setUrgentOnlyFilter,
    setAvailabilityFilter,
    setOnlyShowVerifiedFilter,
    setSortBy,
    urgentOnly,
    availabilityFilter,
    onlyShowVerified,
    sortBy
  };
};
