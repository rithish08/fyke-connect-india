
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ShimmerLoader from '@/components/ui/ShimmerLoader';
import JobCard from '@/components/search/JobCard';
import WorkerCard from '@/components/search/WorkerCard';
import QuickHireCard from '@/components/instant-hire/QuickHireCard';
import SmartFilters from '@/components/filters/SmartFilters';
import LocationPicker from '@/components/location/LocationPicker';
import WorkerDetailModal from '@/components/worker/WorkerDetailModal';
import QuickPostModal from '@/components/job/QuickPostModal';
import BottomNavigation from '@/components/BottomNavigation';
import { MapPin, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
}

const workersDb = [
  { 
    id: '1', 
    name: "Raj Kumar", 
    category: "Construction", 
    skills: ["Manual Labor", "Masonry", "Painting"], 
    rating: 4.8,
    distance: "1.2km",
    responseTime: "< 5min",
    hourlyRate: 350,
    isOnline: true,
    completedJobs: 47,
    verificationLevel: 'verified' as const
  },
  { 
    id: '2', 
    name: "Amit Singh", 
    category: "Gardening", 
    skills: ["Landscaping", "Plant Care", "Irrigation"], 
    rating: 4.4,
    distance: "2.1km",
    responseTime: "< 10min",
    hourlyRate: 280,
    isOnline: true,
    completedJobs: 23,
    verificationLevel: 'basic' as const
  },
  { 
    id: '3', 
    name: "Devika Sharma", 
    category: "Driver", 
    skills: ["City Driving", "Tempo", "Night Shift"], 
    rating: 4.9,
    distance: "0.8km",
    responseTime: "< 3min",
    hourlyRate: 420,
    isOnline: true,
    completedJobs: 89,
    verificationLevel: 'premium' as const
  },
];

const jobsDb = [
  { id: 1, title: "Construction Worker Needed Urgently", category: "Construction", skills: ["Manual Labor"], salary: "400", urgent: true },
  { id: 2, title: "Tempo Driver for Moving", category: "Driver", skills: ["Driving", "Tempo"], salary: "500", urgent: false },
  { id: 3, title: "Garden Maintenance Required", category: "Gardening", skills: ["Gardening"], salary: "300", urgent: false },
];

const JobSearch = () => {
  const { user } = useAuth();
  const [results, setResults] = useState<null | any[]>(null);
  const [location, setLocation] = useState<any>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [showWorkerModal, setShowWorkerModal] = useState(false);
  const [showQuickPost, setShowQuickPost] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    distance: 10,
    minRating: 0,
    priceRange: [0, 1000],
    availability: 'all',
    responseTime: 'all'
  });
  const [urgentOnly, setUrgentOnly] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const filterFn = (item: any) => {
        const categoryMatch = user?.categories?.length
          ? user.categories.includes(item.category)
          : true;
        
        const ratingMatch = item.rating ? item.rating >= filters.minRating : true;
        const urgentMatch = urgentOnly ? item.urgent || item.isOnline : true;
        
        return categoryMatch && ratingMatch && urgentMatch;
      };

      if (user?.role === 'employer') {
        setResults(workersDb.filter(filterFn));
      } else {
        setResults(jobsDb.filter(filterFn));
      }
    }, 1000);
  }, [user, filters, urgentOnly]);

  const handleQuickHire = (workerId: string) => {
    console.log('Quick hiring worker:', workerId);
  };

  const handleMessage = (workerId: string) => {
    console.log('Messaging worker:', workerId);
  };

  const handleWorkerClick = (worker: any) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-2xl mx-auto px-2 pt-4">
          <ShimmerLoader height={50} className="my-5" />
          <ShimmerLoader height={50} className="my-3" />
          <ShimmerLoader height={50} className="my-3" />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <main className="max-w-2xl mx-auto px-2 pt-5" aria-live="polite">
        {/* Location Header */}
        <ModernCard className="p-4 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-semibold text-gray-900">
                  {location?.area || 'Select Location'}
                </div>
                <div className="text-xs text-gray-600">
                  {user?.role === 'employer' ? 'Find workers nearby' : 'Find jobs in your area'}
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLocationPicker(!showLocationPicker)}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              Change
            </Button>
          </div>
        </ModernCard>

        {showLocationPicker && (
          <ModernCard className="p-4 mb-4">
            <LocationPicker
              onLocationSelect={(loc) => {
                setLocation(loc);
                setShowLocationPicker(false);
              }}
              currentLocation={location}
            />
          </ModernCard>
        )}

        {/* Smart Filters */}
        <SmartFilters
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={results.length}
        />

        {/* Urgent Jobs Toggle / Quick Post Button */}
        <div className="flex items-center justify-between mb-4">
          {user?.role === 'employer' ? (
            <>
              <span className="font-semibold text-gray-900">Available Workers</span>
              <div className="flex space-x-2">
                <Button
                  variant={urgentOnly ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUrgentOnly(!urgentOnly)}
                  className="flex items-center space-x-1"
                >
                  <Zap className="w-4 h-4" />
                  <span>Online Only</span>
                </Button>
                <Button
                  onClick={() => setShowQuickPost(true)}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Quick Post</span>
                </Button>
              </div>
            </>
          ) : (
            <span className="font-semibold text-gray-900">Available Jobs</span>
          )}
        </div>

        {/* Results */}
        {results.length === 0 && (
          <div className="text-gray-400 text-center my-8 text-base animate-fade-in">
            No results found with current filters.<br />
            <span className="text-xs text-gray-300">Try adjusting your search criteria.</span>
          </div>
        )}

        <div role="list" className="space-y-3">
          {results.map(res =>
            user?.role === 'employer' ? (
              <WorkerCard
                key={res.id}
                name={res.name}
                category={res.category}
                skills={res.skills}
                rating={res.rating}
                completedJobs={res.completedJobs}
                verificationLevel={res.verificationLevel}
                responseTime={res.responseTime}
                distance={res.distance}
                hourlyRate={res.hourlyRate}
                isOnline={res.isOnline}
                onClick={() => handleWorkerClick(res)}
              />
            ) : (
              <JobCard
                key={res.id}
                title={res.title}
                category={res.category}
                skills={res.skills || []}
                salary={res.salary}
                urgent={res.urgent}
              />
            )
          )}
        </div>
      </main>
      
      {/* Modals */}
      {selectedWorker && (
        <WorkerDetailModal
          isOpen={showWorkerModal}
          onClose={() => setShowWorkerModal(false)}
          worker={selectedWorker}
          onHire={handleQuickHire}
        />
      )}
      
      <QuickPostModal
        isOpen={showQuickPost}
        onClose={() => setShowQuickPost(false)}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default JobSearch;
