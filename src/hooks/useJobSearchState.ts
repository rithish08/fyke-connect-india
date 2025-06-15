
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
}

type ViewState = 'category' | 'subcategory' | 'results';

export const useJobSearchState = () => {
  const { user } = useAuth();
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
    responseTime: 'all'
  });
  const [urgentOnly, setUrgentOnly] = useState(false);

  const loadResults = () => {
    setTimeout(() => {
      if (user?.role === 'employer') {
        // Get workers for selected category or all workers
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        let categoryWorkers: any[] = [];
        
        if (categoryKey && categoryKey in mockWorkers) {
          categoryWorkers = mockWorkers[categoryKey as keyof typeof mockWorkers] || [];
        } else {
          // If no specific category or category not found, show workers from all categories
          categoryWorkers = Object.values(mockWorkers).flat();
        }
        
        // Apply filters
        const filteredWorkers = categoryWorkers.filter(worker => {
          const ratingMatch = worker.rating >= filters.minRating;
          const urgentMatch = urgentOnly ? worker.isOnline : true;
          return ratingMatch && urgentMatch;
        });
        
        setResults(filteredWorkers.length > 0 ? filteredWorkers : Object.values(mockWorkers).flat().slice(0, 5));
      } else {
        // Get jobs for selected category or all jobs
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        let categoryJobs: any[] = [];
        
        if (categoryKey && categoryKey in mockJobs) {
          categoryJobs = mockJobs[categoryKey as keyof typeof mockJobs] || [];
        } else {
          // If no specific category or category not found, show jobs from all categories
          categoryJobs = Object.values(mockJobs).flat();
        }
        
        // Apply filters
        const filteredJobs = categoryJobs.filter(job => {
          const urgentMatch = urgentOnly ? job.urgent : true;
          const queryMatch = searchQuery ? 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          return urgentMatch && queryMatch;
        });
        
        setResults(filteredJobs.length > 0 ? filteredJobs : Object.values(mockJobs).flat().slice(0, 5));
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
