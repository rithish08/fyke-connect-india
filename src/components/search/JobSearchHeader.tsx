import LocalizedJobSearchHeader from '@/components/search/LocalizedJobSearchHeader';
import { Location } from '@/hooks/useJobSearchState';

interface JobSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: Location | null;
  setLocation: (location: Location | null) => void;
  selectedCategory?: {id: string, name: string} | null;
  resultsCount: number;
  userRole?: string | undefined;
  onBackToSubcategory?: () => void;
  onBack?: () => void; // Added for compatibility
}

const JobSearchHeader = (props: JobSearchHeaderProps) => {
  return <LocalizedJobSearchHeader {...props} />;
};

export default JobSearchHeader;
