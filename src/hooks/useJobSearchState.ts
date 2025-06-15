import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { mockWorkers, mockJobs } from '@/data/mockData';
import { useLocalization } from './useLocalization';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
  location: string;
  urgent: boolean;
  category: string;
}

type ViewState = 'category' | 'subcategory' | 'results';

export const useJobSearchState = () => {
  const { userProfile } = useAuth();
  const { translateCategory } = useLocalization();
  const [currentView, setCurrentView] = useState<ViewState>('category');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [results, setResults] = useState<null | any[]>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<any>(null);
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

  const loadResults = () => {
    setTimeout(() => {
      if (userProfile?.role === 'employer') {
        // Enhanced worker data loading with better filtering
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        let categoryWorkers: any[] = [];
        
        if (categoryKey && categoryKey in mockWorkers) {
          categoryWorkers = mockWorkers[categoryKey as keyof typeof mockWorkers] || [];
        } else {
          // Show workers from all categories with better variety
          categoryWorkers = Object.values(mockWorkers).flat();
        }
        
        // Apply comprehensive filters
        const filteredWorkers = categoryWorkers.filter(worker => {
          const ratingMatch = worker.rating >= filters.minRating;
          const urgentMatch = urgentOnly ? worker.isOnline : true;
          const priceMatch = worker.hourlyRate >= filters.priceRange[0] && worker.hourlyRate <= filters.priceRange[1];
          const availabilityMatch = filters.availability === 'all' || 
            (filters.availability === 'online' && worker.isOnline) ||
            (filters.availability === 'verified' && worker.verificationLevel !== 'basic');
          
          return ratingMatch && urgentMatch && priceMatch && availabilityMatch;
        });
        
        setResults(filteredWorkers.length > 0 ? filteredWorkers : Object.values(mockWorkers).flat().slice(0, 8));
      } else {
        // Enhanced job data loading with better filtering
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        let categoryJobs: any[] = [];
        
        if (categoryKey && categoryKey in mockJobs) {
          categoryJobs = mockJobs[categoryKey as keyof typeof mockJobs] || [];
        } else {
          // Show jobs from all categories with better variety
          categoryJobs = Object.values(mockJobs).flat();
        }
        
        // Apply comprehensive filters
        const filteredJobs = categoryJobs.filter(job => {
          const urgentMatch = urgentOnly ? job.urgent : true;
          const queryMatch = searchQuery ? 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.description?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          
          return urgentMatch && queryMatch;
        });
        
        setResults(filteredJobs.length > 0 ? filteredJobs : Object.values(mockJobs).flat().slice(0, 8));
      }
    }, 500);
  };

  useEffect(() => {
    if (currentView === 'results') {
      loadResults();
    }
  }, [currentView, filters, urgentOnly, selectedCategory, searchQuery, location]);

  // For job seekers, auto-navigate to their category
  useEffect(() => {
    if (userProfile?.role === 'jobseeker' && userProfile?.primary_category && currentView === 'category') {
      const categoryId = userProfile.primary_category.toLowerCase();
      setSelectedCategory({ id: categoryId, name: userProfile.primary_category });
      setCurrentView('subcategory');
    }
  }, [userProfile, currentView]);

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
