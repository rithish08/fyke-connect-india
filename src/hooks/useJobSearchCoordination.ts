
import { useState } from 'react';
import { searchJobs, Job } from '@/data/mockJobs';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
}

interface SearchState {
  query: string;
  location: any;
  selectedCategory: {id: string, name: string} | null;
  selectedSubcategories: string[];
  filters: FilterState;
  urgentOnly: boolean;
  results: Job[] | null;
  currentStep: 'category' | 'subcategory' | 'results';
}

const defaultFilters: FilterState = {
  distance: 10,
  minRating: 0,
  priceRange: [0, 1000],
  availability: 'all',
  responseTime: 'all'
};

export const useJobSearchCoordination = () => {
  const [searchState, setSearchState] = useState<SearchState>({
    query: '',
    location: null,
    selectedCategory: null,
    selectedSubcategories: [],
    filters: defaultFilters,
    urgentOnly: false,
    results: null,
    currentStep: 'category'
  });

  const updateSearchQuery = (query: string) => {
    setSearchState(prev => ({ ...prev, query }));
  };

  const updateLocation = (location: any) => {
    setSearchState(prev => ({ ...prev, location }));
  };

  const selectCategory = (category: {id: string, name: string}) => {
    setSearchState(prev => ({
      ...prev,
      selectedCategory: category,
      currentStep: 'subcategory',
      results: null
    }));
  };

  const selectSubcategories = (subcategories: string[]) => {
    setSearchState(prev => ({
      ...prev,
      selectedSubcategories: subcategories
    }));
  };

  const updateFilters = (filters: FilterState) => {
    setSearchState(prev => ({ ...prev, filters }));
  };

  const setUrgentOnly = (urgentOnly: boolean) => {
    setSearchState(prev => ({ ...prev, urgentOnly }));
  };

  const performSearch = () => {
    const results = searchJobs(
      searchState.query,
      searchState.selectedCategory?.name,
      searchState.location?.name,
      searchState.urgentOnly
    );
    
    setSearchState(prev => ({
      ...prev,
      results,
      currentStep: 'results'
    }));
  };

  const goBackToSubcategory = () => {
    setSearchState(prev => ({
      ...prev,
      currentStep: 'subcategory',
      results: null
    }));
  };

  const goBackToCategory = () => {
    setSearchState(prev => ({
      ...prev,
      currentStep: 'category',
      selectedCategory: null,
      selectedSubcategories: [],
      results: null
    }));
  };

  const resetSearch = () => {
    setSearchState({
      query: '',
      location: null,
      selectedCategory: null,
      selectedSubcategories: [],
      filters: defaultFilters,
      urgentOnly: false,
      results: null,
      currentStep: 'category'
    });
  };

  return {
    searchState,
    updateSearchQuery,
    updateLocation,
    selectCategory,
    selectSubcategories,
    updateFilters,
    setUrgentOnly,
    performSearch,
    goBackToSubcategory,
    goBackToCategory,
    resetSearch
  };
};
