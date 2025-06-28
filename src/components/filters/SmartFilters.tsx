import React, { useState } from 'react';
import { Filter, Star, MapPin, Clock, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { useLocalization } from '@/hooks/useLocalization';

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
  const { getLocalizedText, formatCurrency } = useLocalization();
  const [isExpanded, setIsExpanded] = useState(false);

  const quickFilters = [
    { 
      label: getLocalizedText('filters.nearby', 'Nearby (2km)'), 
      key: 'nearby',
      ariaLabel: getLocalizedText('filters.nearby_description', 'Filter to show results within 2 kilometers')
    },
    { 
      label: getLocalizedText('filters.top_rated', 'Top Rated (4.5+)'), 
      key: 'topRated',
      ariaLabel: getLocalizedText('filters.top_rated_description', 'Filter to show only highly rated workers')
    },
    { 
      label: getLocalizedText('filters.online_now', 'Online Now'), 
      key: 'online',
      ariaLabel: getLocalizedText('filters.online_description', 'Filter to show only currently online workers')
    },
    { 
      label: getLocalizedText('filters.fast_response', 'Fast Response'), 
      key: 'fastResponse',
      ariaLabel: getLocalizedText('filters.fast_response_description', 'Filter to show workers with quick response times')
    }
  ];

  const applyQuickFilter = (filterKey: string) => {
    const newFilters = { ...filters };
    
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
    <ModernCard className="p-4 mb-4" role="region" aria-label={getLocalizedText('filters.title', 'Search Filters')}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-600" aria-hidden="true" />
          <span className="font-semibold text-gray-900">
            {getLocalizedText('filters.smart_filters', 'Smart Filters')}
          </span>
          <span 
            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
            aria-label={`${resultCount} ${getLocalizedText('filters.results_found', 'results found')}`}
          >
            {resultCount} {getLocalizedText('filters.results', 'results')}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="advanced-filters"
          className="flex items-center space-x-1"
        >
          <span>{isExpanded ? getLocalizedText('common.less', 'Less') : getLocalizedText('common.more', 'More')}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label={getLocalizedText('filters.quick_filters', 'Quick filter options')}>
        {quickFilters.map((filter) => (
          <Button
            key={filter.key}
            variant="outline"
            size="sm"
            onClick={() => applyQuickFilter(filter.key)}
            className="text-xs"
            aria-label={filter.ariaLabel}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {isExpanded && (
        <div 
          id="advanced-filters"
          className="space-y-4 pt-3 border-t border-gray-100"
          role="group"
          aria-label={getLocalizedText('filters.advanced_filters', 'Advanced filter options')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" aria-hidden="true" />
              {getLocalizedText('filters.distance', 'Distance')}: {filters.distance}km
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={filters.distance}
              onChange={(e) => onFiltersChange({ ...filters, distance: Number(e.target.value) })}
              className="w-full"
              aria-label={`${getLocalizedText('filters.distance', 'Distance')} ${filters.distance} ${getLocalizedText('common.kilometers', 'kilometers')}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Star className="w-4 h-4 inline mr-1" aria-hidden="true" />
              {getLocalizedText('filters.minimum_rating', 'Minimum Rating')}: {filters.minRating}+
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => onFiltersChange({ ...filters, minRating: Number(e.target.value) })}
              className="w-full"
              aria-label={`${getLocalizedText('filters.minimum_rating', 'Minimum rating')} ${filters.minRating} ${getLocalizedText('common.stars', 'stars')}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="w-4 h-4 inline mr-1" aria-hidden="true" />
              {getLocalizedText('filters.price_range', 'Price Range')}: {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                placeholder={getLocalizedText('filters.min_price', 'Min')}
                value={filters.priceRange[0]}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  priceRange: [Number(e.target.value), filters.priceRange[1]] 
                })}
                className="flex-1 px-2 py-1 border rounded text-sm"
                aria-label={getLocalizedText('filters.minimum_price', 'Minimum price')}
              />
              <input
                type="number"
                placeholder={getLocalizedText('filters.max_price', 'Max')}
                value={filters.priceRange[1]}
                onChange={(e) => onFiltersChange({ 
                  ...filters, 
                  priceRange: [filters.priceRange[0], Number(e.target.value)] 
                })}
                className="flex-1 px-2 py-1 border rounded text-sm"
                aria-label={getLocalizedText('filters.maximum_price', 'Maximum price')}
              />
            </div>
          </div>

          <Button 
            onClick={clearFilters} 
            variant="outline" 
            size="sm" 
            className="w-full"
            aria-label={getLocalizedText('filters.clear_all_description', 'Clear all applied filters and reset to default values')}
          >
            {getLocalizedText('filters.clear_all', 'Clear All Filters')}
          </Button>
        </div>
      )}
    </ModernCard>
  );
};

export default SmartFilters;
