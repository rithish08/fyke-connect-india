import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
  location: string;
  urgent: boolean;
  category: string;
  sortBy: 'relevance' | 'distance' | 'rating' | 'price' | 'date';
}

interface AdvancedJobFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose: () => void;
  userRole: string | undefined;
  resultsCount: number;
}

const AdvancedJobFilters: React.FC<AdvancedJobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
  userRole,
  resultsCount
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="p-4 mx-4 mb-4 bg-white border shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close filters">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Distance Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Distance: {filters.distance}km</Label>
          <Slider
            value={[filters.distance]}
            onValueChange={([value]) => updateFilter('distance', value)}
            max={50}
            min={1}
            step={1}
            className="w-full"
            aria-label="Maximum distance in kilometers"
          />
        </div>

        {/* Price Range Filter */}
        {userRole === 'employer' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Hourly Rate: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              max={2000}
              min={100}
              step={50}
              className="w-full"
              aria-label="Hourly rate range"
            />
          </div>
        )}

        {/* Salary Range Filter for Job Seekers */}
        {userRole === 'jobseeker' && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Salary Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
            </Label>
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              max={100000}
              min={5000}
              step={1000}
              className="w-full"
              aria-label="Expected salary range"
            />
          </div>
        )}

        {/* Rating Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Minimum Rating: {filters.minRating} stars</Label>
          <Slider
            value={[filters.minRating]}
            onValueChange={([value]) => updateFilter('minRating', value)}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
            aria-label="Minimum rating"
          />
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Availability</Label>
          <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="online">Currently Online</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Response Time Filter */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Response Time</Label>
          <Select value={filters.responseTime} onValueChange={(value) => updateFilter('responseTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select response time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Response Time</SelectItem>
              <SelectItem value="fast">Responds in &lt; 1 hour</SelectItem>
              <SelectItem value="medium">Responds in &lt; 6 hours</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Sort By</Label>
          <Select value={filters.sortBy || 'relevance'} onValueChange={(value) => updateFilter('sortBy', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price">Price {userRole === 'employer' ? '(Low to High)' : '(High to Low)'}</SelectItem>
              <SelectItem value="date">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Emergency/Urgent Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">
            {userRole === 'employer' ? 'Emergency Hiring' : 'Urgent Jobs Only'}
          </Label>
          <Switch
            checked={filters.urgent}
            onCheckedChange={(checked) => updateFilter('urgent', checked)}
            aria-label={userRole === 'employer' ? 'Emergency hiring only' : 'Urgent jobs only'}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <span className="text-sm text-gray-600">{resultsCount} results found</span>
        <Button variant="outline" size="sm" onClick={onClose}>
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};

export default AdvancedJobFilters;