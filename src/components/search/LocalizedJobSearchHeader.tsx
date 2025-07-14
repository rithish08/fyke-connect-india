import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ModernCard } from '@/components/ui/modern-card';
import LocationPicker from '@/components/location/LocationPicker';
import { MapPin, Search, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { Location } from '@/hooks/useJobSearchState';

interface LocalizedJobSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: Location | null;
  setLocation: (location: Location | null) => void;
  selectedCategory?: {id: string, name: string} | null;
  resultsCount: number;
  userRole?: string | undefined;
  onBackToSubcategory?: () => void;
}

const LocalizedJobSearchHeader = ({
  searchQuery,
  setSearchQuery,
  location,
  setLocation,
  selectedCategory,
  resultsCount,
  userRole,
  onBackToSubcategory
}: LocalizedJobSearchHeaderProps) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const { translateCategory, translateText } = useTranslation();

  const getSearchPlaceholder = () => {
    return userRole === 'employer' 
      ? translateText('search.placeholder_workers', 'Search workers...')
      : translateText('search.placeholder_jobs', 'Search jobs...');
  };

  return (
    <>
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            {onBackToSubcategory && (
              <Button variant="ghost" size="sm" onClick={onBackToSubcategory} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={getSearchPlaceholder()}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="rounded-xl border-gray-200"
            >
              <MapPin className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{location?.area || translateText('search.current_location', 'Current Location')}</span>
              {selectedCategory && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">{translateCategory(selectedCategory.name)}</span>
                </>
              )}
            </div>
            <span className="text-gray-500">
              {resultsCount} {translateText('search.results', 'results')}
            </span>
          </div>
        </div>
      </div>

      {showLocationPicker && (
        <div className="max-w-2xl mx-auto px-4">
          <ModernCard className="p-4 mb-4 mt-4">
            <LocationPicker
              onLocationSelect={(loc) => {
                setLocation(loc);
                setShowLocationPicker(false);
              }}
              currentLocation={location}
            />
          </ModernCard>
        </div>
      )}
    </>
  );
};

export default LocalizedJobSearchHeader;
