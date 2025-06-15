
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
        // Get workers for selected category
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        const categoryWorkers = mockWorkers[categoryKey as keyof typeof mockWorkers] || [];
        
        // Apply filters
        const filteredWorkers = categoryWorkers.filter(worker => {
          const ratingMatch = worker.rating >= filters.minRating;
          const urgentMatch = urgentOnly ? worker.isOnline : true;
          return ratingMatch && urgentMatch;
        });
        
        setResults(filteredWorkers);
      } else {
        // Get jobs for selected category
        const categoryKey = selectedCategory?.name.toLowerCase() || '';
        const categoryJobs = mockJobs[categoryKey as keyof typeof mockJobs] || [];
        
        // Apply filters
        const filteredJobs = categoryJobs.filter(job => {
          const urgentMatch = urgentOnly ? job.urgent : true;
          const queryMatch = searchQuery ? 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) : true;
          return urgentMatch && queryMatch;
        });
        
        setResults(filteredJobs);
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
