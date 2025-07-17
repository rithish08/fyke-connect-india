import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockWorkers, mockJobs, Job as MockJob, Worker as MockWorker } from '@/data/mockData';
import { useLocalization } from './useLocalization';
import { Job } from '@/types/job';
export interface Location {
  lat: number;
  lng: number;
  area?: string;
  address?: string;
}

export interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
  location: string;
  urgent: boolean;
  category: string;
}

export type ViewState = 'category' | 'subcategory' | 'results';

export const useJobSearchState = () => {
  const { user } = useAuth();
  const { translateCategory } = useLocalization();
  const [currentView, setCurrentView] = useState<ViewState>('category');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [results, setResults] = useState<(MockJob | MockWorker)[] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    distance: 10,
    minRating: 0,
    priceRange: [0, 1000],
    availability: 'all',
    responseTime: 'all',
    location: '',
    urgent: false,
    category: ''
  });
  const [urgentOnly, setUrgentOnly] = useState(false);

  const loadResults = useCallback(() => {
    setTimeout(() => {
      if (user?.role === 'employer') {
        // Enhanced worker data loading with better filtering
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        let categoryWorkers: MockWorker[] = [];
        
        if (categoryKey && categoryKey in mockWorkers) {
          categoryWorkers = (mockWorkers as any)[categoryKey] || [];
        } else {
          // Show workers from all categories with better variety
          categoryWorkers = Object.values(mockWorkers).flat() as any;
        }
        
        // Apply comprehensive filters
        const filteredWorkers = categoryWorkers.filter(worker => {
          const ratingMatch = (worker as any).rating >= filters.minRating;
          const urgentMatch = urgentOnly ? (worker as any).isOnline : true;
          const priceMatch = (worker as any).hourlyRate >= filters.priceRange[0] && (worker as any).hourlyRate <= filters.priceRange[1];
          const availabilityMatch = filters.availability === 'all' || 
            (filters.availability === 'online' && (worker as any).isOnline) ||
            (filters.availability === 'verified' && (worker as any).verificationLevel !== 'basic');
          // Subcategory filter
          const subcategoryMatch = selectedSubcategories.length === 0 || (worker.skills && selectedSubcategories.some(sub => worker.skills.includes(sub)));
          return ratingMatch && urgentMatch && priceMatch && availabilityMatch && subcategoryMatch;
        });
        
        setResults(filteredWorkers.length > 0 ? filteredWorkers as any : Object.values(mockWorkers).flat().slice(0, 8) as any);
      } else {
        // Enhanced job data loading with better filtering
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        let categoryJobs: MockJob[] = [];
        
        if (categoryKey && categoryKey in mockJobs) {
          categoryJobs = (mockJobs as any)[categoryKey] || [];
        } else {
          // Show jobs from all categories with better variety
          categoryJobs = Object.values(mockJobs).flat() as any;
        }
        
        // Apply comprehensive filters
        const filteredJobs = categoryJobs.filter(job => {
          const urgentMatch = urgentOnly ? job.urgent : true;
          const queryMatch = searchQuery ? 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          // Subcategory filter
          const subcategoryMatch = selectedSubcategories.length === 0 || (job.subcategories && selectedSubcategories.some(sub => job.subcategories.includes(sub)));
          return urgentMatch && queryMatch && subcategoryMatch;
        });
        
        setResults(filteredJobs.length > 0 ? filteredJobs as any : Object.values(mockJobs).flat().slice(0, 8) as any);
      }
    }, 500);
  }, [user?.role, selectedCategory, filters, urgentOnly, searchQuery, selectedSubcategories]);

  useEffect(() => {
    if (currentView === 'results') {
      loadResults();
    }
  }, [currentView, loadResults]);

  // For job seekers, auto-navigate to their category
  useEffect(() => {
    if (user?.role === 'jobseeker' && user?.primaryCategory && currentView === 'category') {
      const categoryId = user.primaryCategory.toLowerCase();
      setSelectedCategory({ id: categoryId, name: user.primaryCategory });
      setCurrentView('subcategory');
    }
  }, [user, currentView]);

  return {
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategories,
    setSelectedSubcategories,
    results,
    setResults,
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    filters,
    setFilters,
    urgentOnly,
    setUrgentOnly,
    loadResults
  };
};
