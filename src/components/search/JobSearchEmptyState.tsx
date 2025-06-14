
import { Search } from 'lucide-react';

const JobSearchEmptyState = () => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <div className="text-gray-500 text-center">
        <p className="font-medium">No results found</p>
        <p className="text-sm mt-1">Try adjusting your search criteria</p>
      </div>
    </div>
  );
};

export default JobSearchEmptyState;
