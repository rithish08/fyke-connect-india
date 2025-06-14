
import { Button } from '@/components/ui/button';
import SmartFilters from '@/components/filters/SmartFilters';
import { Zap, Plus } from 'lucide-react';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
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
  return (
    <div className="max-w-2xl mx-auto px-4">
      <SmartFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        resultCount={resultsCount}
      />

      <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl shadow-sm">
        {userRole === 'employer' ? (
          <>
            <span className="font-semibold text-gray-900 text-sm">Available Workers</span>
            <div className="flex space-x-2">
              <Button
                variant={urgentOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setUrgentOnly(!urgentOnly)}
                className="flex items-center space-x-1 text-xs"
              >
                <Zap className="w-3 h-3" />
                <span>Online</span>
              </Button>
              <Button
                onClick={onShowQuickPost}
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-1 text-xs"
              >
                <Plus className="w-3 h-3" />
                <span>Post</span>
              </Button>
            </div>
          </>
        ) : (
          <>
            <span className="font-semibold text-gray-900 text-sm">Available Jobs</span>
            <Button
              variant={urgentOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setUrgentOnly(!urgentOnly)}
              className="flex items-center space-x-1 text-xs"
            >
              <Zap className="w-3 h-3" />
              <span>Urgent</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default JobSearchFilters;
