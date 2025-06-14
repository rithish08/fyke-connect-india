
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { workersDb } from '@/data/workersDb';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
}

type ViewState = 'category' | 'subcategory' | 'results';

const jobsDb = [
  { id: 1, title: "Construction Worker Needed Urgently", category: "Construction", skills: ["Manual Labor"], salary: "400", urgent: true },
  { id: 2, title: "Tempo Driver for Moving", category: "Driver", skills: ["Driving", "Tempo"], salary: "500", urgent: false },
  { id: 3, title: "Garden Maintenance Required", category: "Gardening", skills: ["Gardening"], salary: "300", urgent: false },
  { id: 4, title: "House Cleaning Service", category: "Cleaning", skills: ["Deep Cleaning"], salary: "350", urgent: true },
  { id: 5, title: "Security Guard Needed", category: "Security", skills: ["Night Shift"], salary: "400", urgent: false },
  { id: 6, title: "Home Cook Required", category: "Cooking", skills: ["Indian Cuisine"], salary: "450", urgent: false },
  { id: 7, title: "Hair Stylist for Salon", category: "Beauty", skills: ["Hair Cutting"], salary: "500", urgent: true },
  { id: 8, title: "Delivery Partner Needed", category: "Delivery", skills: ["Two Wheeler"], salary: "400", urgent: true },
];

export const useJobSearchState = () => {
  const { user } = useAuth();
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
      const filterFn = (item: any) => {
        const categoryMatch = selectedCategory 
          ? item.category.toLowerCase() === selectedCategory.name.toLowerCase()
          : true;
        
        const ratingMatch = item.rating ? item.rating >= filters.minRating : true;
        const urgentMatch = urgentOnly ? item.urgent || item.isOnline : true;
        
        return categoryMatch && ratingMatch && urgentMatch;
      };

      if (user?.role === 'employer') {
        setResults(workersDb.filter(filterFn));
      } else {
        setResults(jobsDb.filter(filterFn));
      }
    }, 1000);
  };

  useEffect(() => {
    if (currentView === 'results') {
      loadResults();
    }
  }, [currentView, filters, urgentOnly, selectedCategory]);

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
