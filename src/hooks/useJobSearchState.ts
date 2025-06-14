
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { workersDb } from '@/data/workersDb';
import { mockJobs, searchJobs } from '@/data/mockJobs';
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
        // Filter workers based on criteria
        const filteredWorkers = workersDb.filter(worker => {
          const categoryMatch = selectedCategory 
            ? worker.category.toLowerCase() === selectedCategory.name.toLowerCase()
            : true;
          
          const ratingMatch = worker.rating ? worker.rating >= filters.minRating : true;
          const urgentMatch = urgentOnly ? worker.isOnline : true;
          
          return categoryMatch && ratingMatch && urgentMatch;
        });
        
        setResults(filteredWorkers);
      } else {
        // Search jobs for job seekers
        const categoryName = selectedCategory?.name || '';
        const locationQuery = location?.name || '';
        
        const jobResults = searchJobs(searchQuery, categoryName, locationQuery, urgentOnly);
        setResults(jobResults);
      }
    }, 1000);
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
