
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CompactAdvancedFilters from '@/components/search/CompactAdvancedFilters';
import { Filter, Zap, Plus } from 'lucide-react';

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

interface JobSearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  urgentOnly: boolean;
  setUrgentOnly: (urgent: boolean) => void;
  resultsCount: number;
  userRole: string | undefined;
  onShowQuickPost: () => void;
}

const JobSearchFilters = ({
  filters,
  onFiltersChange,
  urgentOnly,
  setUrgentOnly,
  resultsCount,
  userRole,
  onShowQuickPost
}: JobSearchFiltersProps) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Quick Action Bar */}
      <div className="flex items-center justify-between mb-2 bg-white mx-4 p-3 rounded-xl shadow-sm border border-gray-100">
        {userRole === 'employer' ? (
          <>
            <span className="font-semibold text-gray-900 text-sm">Available Workers</span>
            <div className="flex space-x-2">
              <Button
                variant={urgentOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgentOnly(!urgentOnly)}
                className="flex items-center space-x-1 text-xs h-8"
              >
                <Zap className="w-3 h-3" />
                <span>Online</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-1 text-xs h-8"
              >
                <Filter className="w-3 h-3" />
                <span>Filters</span>
              </Button>
              <Button
                onClick={onShowQuickPost}
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-1 text-xs h-8"
              >
                <Plus className="w-3 h-3" />
                <span>Post</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-900 text-sm">Available Jobs</span>
            <div className="flex space-x-2">
              <Button
                variant={urgentOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgentOnly(!urgentOnly)}
                className="flex items-center space-x-1 text-xs h-8"
              >
                <Zap className="w-3 h-3" />
                <span>Urgent</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-1 text-xs h-8"
              >
                <Filter className="w-3 h-3" />
                <span>Filters</span>
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <CompactAdvancedFilters
          filters={filters}
          onFiltersChange={onFiltersChange}
          resultCount={resultsCount}
          userRole={userRole}
          onClose={() => setShowAdvancedFilters(false)}
        />
      )}
    </div>
  );
};

export default JobSearchFilters;
