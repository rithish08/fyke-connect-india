
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonGrid } from '@/components/ui/skeleton-cards';
import JobCard from '@/components/search/JobCard';
import WorkerCard from '@/components/search/WorkerCard';
import QuickHireCard from '@/components/instant-hire/QuickHireCard';
import SmartFilters from '@/components/filters/SmartFilters';
import LocationPicker from '@/components/location/LocationPicker';
import WorkerDetailModal from '@/components/worker/WorkerDetailModal';
import QuickPostModal from '@/components/job/QuickPostModal';
import CategorySelection from '@/components/search/CategorySelection';
import SubcategorySelection from '@/components/search/SubcategorySelection';
import BottomNavigation from '@/components/BottomNavigation';
import { MapPin, Zap, Plus, Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { Input } from '@/components/ui/input';
import { workersDb } from '@/data/workersDb';

interface FilterState {
  distance: number;
  minRating: number;
  priceRange: [number, number];
  availability: 'all' | 'online' | 'verified';
  responseTime: 'all' | 'fast' | 'medium';
}

type ViewState = 'category' | 'subcategory' | 'results';

const jobsDb = [
  { id: 1, title: "Construction Worker Needed Urgently", category: "Construction", skills: ["Manual Labor"], salary: "400", urgent: true },
  { id: 2, title: "Tempo Driver for Moving", category: "Driver", skills: ["Driving", "Tempo"], salary: "500", urgent: false },
  { id: 3, title: "Garden Maintenance Required", category: "Gardening", skills: ["Gardening"], salary: "300", urgent: false },
  { id: 4, title: "House Cleaning Service", category: "Cleaning", skills: ["Deep Cleaning"], salary: "350", urgent: true },
  { id: 5, title: "Security Guard Needed", category: "Security", skills: ["Night Shift"], salary: "400", urgent: false },
  { id: 6, title: "Home Cook Required", category: "Cooking", skills: ["Indian Cuisine"], salary: "450", urgent: false },
  { id: 7, title: "Hair Stylist for Salon", category: "Beauty", skills: ["Hair Cutting"], salary: "500", urgent: true },
  { id: 8, title: "Warehouse Helper", category: "Warehouse", skills: ["Packing"], salary: "320", urgent: false },
  { id: 9, title: "Factory Worker", category: "Manufacturing", skills: ["Assembly"], salary: "380", urgent: false },
  { id: 10, title: "Food Delivery Partner", category: "Delivery", skills: ["Two Wheeler"], salary: "400", urgent: true },
];

const JobSearch = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('category');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [results, setResults] = useState<null | any[]>(null);
  const [searchQuery, setSearchQuery] = useState('');
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

  const handleCategorySelect = (categoryId: string, categoryName: string) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setCurrentView('subcategory');
  };

  const handleSubcategorySelect = (subcategory: string) => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(prev => prev.filter(s => s !== subcategory));
    } else {
      setSelectedSubcategories(prev => [...prev, subcategory]);
    }
  };

  const handleSearchWithSubcategories = () => {
    setCurrentView('results');
    // Trigger search with selected category and subcategories
    loadResults();
  };

  const loadResults = () => {
    setTimeout(() => {
      const filterFn = (item: any) => {
        const categoryMatch = selectedCategory 
          ? item.category.toLowerCase() === selectedCategory.name.toLowerCase()
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
  };

  useEffect(() => {
    if (currentView === 'results') {
      loadResults();
    }
  }, [currentView, filters, urgentOnly, selectedCategory]);

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

  const handleBackToCategory = () => {
    setCurrentView('category');
    setSelectedCategory(null);
    setSelectedSubcategories([]);
  };

  const handleBackToSubcategory = () => {
    setCurrentView('subcategory');
    setResults(null);
  };

  if (currentView === 'category') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900">
              {user?.role === 'employer' ? 'Find Workers by Category' : 'Find Jobs by Category'}
            </h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <CategorySelection 
            onCategorySelect={handleCategorySelect}
            title={user?.role === 'employer' ? 'Select Worker Category' : 'Select Job Category'}
          />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (currentView === 'subcategory' && selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleBackToCategory} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Select Specialization</h1>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <SubcategorySelection
            categoryId={selectedCategory.id}
            onSubcategorySelect={handleSubcategorySelect}
            onBack={handleBackToCategory}
            selectedSubcategories={selectedSubcategories}
            multiSelect={true}
          />
          {selectedSubcategories.length > 0 && (
            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={handleSearchWithSubcategories}
              >
                Search {user?.role === 'employer' ? 'Workers' : 'Jobs'} ({selectedSubcategories.length} selected)
              </Button>
            </div>
          )}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  // Enhanced loading state with proper skeleton
  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-3 mb-3">
              <Button variant="ghost" size="sm" onClick={handleBackToSubcategory} className="p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={`Search ${user?.role === 'employer' ? 'workers' : 'jobs'}...`}
                  className="pl-10 bg-gray-50 border-gray-200 rounded-xl"
                  disabled
                />
              </div>
              <Button size="sm" className="rounded-xl" disabled>
                <MapPin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <SkeletonGrid count={5} type={user?.role === 'employer' ? 'worker' : 'job'} />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced sticky header with search */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="sm" onClick={handleBackToSubcategory} className="p-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${user?.role === 'employer' ? 'workers' : 'jobs'}...`}
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

          {/* Location display */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{location?.area || 'Current Location'}</span>
              {selectedCategory && (
                <>
                  <span>•</span>
                  <span className="text-blue-600">{selectedCategory.name}</span>
                </>
              )}
            </div>
            <span className="text-gray-500">{results.length} results</span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4" aria-live="polite">
        {showLocationPicker && (
          <ModernCard className="p-4 mb-4 mt-4">
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

        {/* Action bar */}
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl shadow-sm">
          {user?.role === 'employer' ? (
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
                  onClick={() => setShowQuickPost(true)}
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

        {/* Results */}
        {results.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-gray-500 text-center">
              <p className="font-medium">No results found</p>
              <p className="text-sm mt-1">Try adjusting your search criteria</p>
            </div>
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
