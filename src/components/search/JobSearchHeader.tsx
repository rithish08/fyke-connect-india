
import LocalizedJobSearchHeader from '@/components/search/LocalizedJobSearchHeader';

interface JobSearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: any;
  setLocation: (location: any) => void;
  selectedCategory: {id: string, name: string} | null;
  resultsCount: number;
  userRole: string | undefined;
  onBackToSubcategory: () => void;
}

const JobSearchHeader = (props: JobSearchHeaderProps) => {
  return <LocalizedJobSearchHeader {...props} />;
};

export default JobSearchHeader;
