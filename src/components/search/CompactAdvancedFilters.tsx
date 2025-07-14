import { useState } from 'react';
import { Filter, MapPin, Clock, Star, DollarSign, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useLocalization } from '@/hooks/useLocalization';

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

interface CompactAdvancedFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
  userRole?: string;
  onClose?: () => void;
}

const CompactAdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  resultCount, 
  userRole,
  onClose 
}: CompactAdvancedFiltersProps) => {
  const { getLocalizedText } = useLocalization();
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const quickFilters = [
    { 
      id: 'nearby', 
      label: 'Nearby (2km)', 
      icon: MapPin,
      action: () => updateFilter('distance', 2)
    },
    { 
      id: 'topRated', 
      label: 'Top Rated', 
      icon: Star,
      action: () => updateFilter('minRating', 4.5)
    },
    { 
      id: 'online', 
      label: 'Online Now', 
      icon: Zap,
      action: () => updateFilter('availability', 'online')
    },
    { 
      id: 'fastResponse', 
      label: 'Fast Response', 
      icon: Clock,
      action: () => updateFilter('responseTime', 'fast')
    }
  ];

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
    
    if (!activeFilters.includes(key)) {
      setActiveFilters([...activeFilters, key]);
    }
  };

  const removeFilter = (key: string) => {
    const defaultValues: Partial<FilterState> = {
      distance: 10,
      minRating: 0,
      availability: 'all',
      responseTime: 'all',
      urgent: false
    };
    
    if (key in defaultValues) {
      updateFilter(key as keyof FilterState, defaultValues[key as keyof FilterState]);
    }
    
    setActiveFilters(activeFilters.filter(f => f !== key));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      distance: 10,
      minRating: 0,
      priceRange: [0, 1000],
      availability: 'all',
      responseTime: 'all',
      location: '',
      urgent: false,
      category: ''
    });
    setActiveFilters([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.distance < 10) count++;
    if (filters.minRating > 0) count++;
    if (filters.availability !== 'all') count++;
    if (filters.responseTime !== 'all') count++;
    if (filters.urgent) count++;
    return count;
  };

  return (
    <Card className="p-4 mx-4 mb-4 bg-white shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-900">Filters</span>
          <Badge variant="secondary" className="text-xs px-2 py-1">
            {resultCount} results
          </Badge>
          {getActiveFilterCount() > 0 && (
            <Badge variant="default" className="text-xs px-2 py-1">
              {getActiveFilterCount()} active
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {getActiveFilterCount() > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-xs h-6 px-2"
            >
              Clear all
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {quickFilters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilters.includes(filter.id);
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={filter.action}
              className="h-8 text-xs justify-start"
            >
              <Icon className="w-3 h-3 mr-1" />
              {filter.label}
            </Button>
          );
        })}
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {activeFilters.map((filterKey) => (
            <Badge 
              key={filterKey} 
              variant="secondary" 
              className="text-xs px-2 py-1 flex items-center space-x-1"
            >
              <span>
                {filterKey === 'distance' && `${filters.distance}km`}
                {filterKey === 'minRating' && `${filters.minRating}+ stars`}
                {filterKey === 'availability' && filters.availability}
                {filterKey === 'responseTime' && `${filters.responseTime} response`}
                {filterKey === 'urgent' && 'Urgent only'}
              </span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => removeFilter(filterKey)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Compact Range Controls */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Distance */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              Distance: {filters.distance}km
            </label>
            <Slider
              value={[filters.distance]}
              onValueChange={(value) => updateFilter('distance', value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Rating */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700 flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Rating: {filters.minRating}+
            </label>
            <Slider
              value={[filters.minRating]}
              onValueChange={(value) => updateFilter('minRating', value[0])}
              max={5}
              min={0}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-gray-700 flex items-center">
            <DollarSign className="w-3 h-3 mr-1" />
            Price: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
          </label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
        </div>
      </div>

      {/* Specialty Filters by Role */}
      {userRole === 'employer' && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <Button
            variant={filters.urgent ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilter('urgent', !filters.urgent)}
            className="w-full h-8 text-xs"
          >
            <Zap className="w-3 h-3 mr-1" />
            Show Online Workers Only
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CompactAdvancedFilters;
