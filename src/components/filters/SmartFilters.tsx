
import React, { useState } from 'react';
import { Filter, Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
}

interface SmartFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

const SmartFilters: React.FC<SmartFiltersProps> = ({ filters, onFiltersChange, resultCount }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickFilters = [
    { label: 'Nearby (2km)', key: 'nearby' },
    { label: 'Top Rated (4.5+)', key: 'topRated' },
    { label: 'Online Now', key: 'online' },
    { label: 'Fast Response', key: 'fastResponse' }
  ];

  const applyQuickFilter = (filterKey: string) => {
    let newFilters = { ...filters };
    
    switch (filterKey) {
      case 'nearby':
        newFilters.distance = 2;
        break;
      case 'topRated':
        newFilters.minRating = 4.5;
        break;
      case 'online':
        newFilters.availability = 'online';
        break;
      case 'fastResponse':
        newFilters.responseTime = 'fast';
        break;
    }
    
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    onFiltersChange({
      distance: 10,
      minRating: 0,
      priceRange: [0, 1000],
      availability: 'all',
      responseTime: 'all'
    });
  };

  return (
    <ModernCard className="p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Smart Filters</span>
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
            {resultCount} results
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Less' : 'More'}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {quickFilters.map((filter) => (
          <Button
            key={filter.key}
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(filter.key)}
            className="text-xs"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Distance: {filters.distance}km
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={filters.distance}
              onChange={(e) => onFiltersChange({ ...filters, distance: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" />
              Minimum Rating: {filters.minRating}+
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => onFiltersChange({ ...filters, minRating: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.priceRange[0]}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  priceRange: [Number(e.target.value), filters.priceRange[1]] 
                })}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.priceRange[1]}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  priceRange: [filters.priceRange[0], Number(e.target.value)] 
                })}
                className="flex-1 px-2 py-1 border rounded text-sm"
              />
            </div>
          </div>

          <Button onClick={clearFilters} variant="outline" size="sm" className="w-full">
            Clear All Filters
          </Button>
        </div>
      )}
    </ModernCard>
  );
};

export default SmartFilters;
