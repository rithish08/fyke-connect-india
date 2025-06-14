
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SkeletonGrid } from '@/components/ui/skeleton-cards';
import WorkerDetailModal from '@/components/worker/WorkerDetailModal';
import QuickPostModal from '@/components/job/QuickPostModal';
import CategorySelection from '@/components/search/CategorySelection';
import SubcategorySelection from '@/components/search/SubcategorySelection';
import JobSearchHeader from '@/components/search/JobSearchHeader';
import JobSearchFilters from '@/components/search/JobSearchFilters';
import JobSearchResults from '@/components/search/JobSearchResults';
import BottomNavigation from '@/components/BottomNavigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  { id: 8, title: "Delivery Partner Needed", category: "Delivery", skills: ["Two Wheeler"], salary: "400", urgent: true },
];

const JobSearch = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewState>('category');
  const [selectedCategory, setSelectedCategory] = useState<{id: string, name: string} | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [results, setResults] = useState<null | any[]>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<any>(null);
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
    // For job seekers, check if they can select this category
    if (user?.role === 'jobseeker' && user?.primaryCategory && user.primaryCategory !== categoryName) {
      // Job seekers can only view their selected category
      return;
    }
    
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

  // For job seekers, auto-navigate to their category
  useEffect(() => {
    if (user?.role === 'jobseeker' && user?.primaryCategory && currentView === 'category') {
      // Auto-select job seeker's category and go to subcategory view
      const categoryId = user.primaryCategory.toLowerCase();
      setSelectedCategory({ id: categoryId, name: user.primaryCategory });
      setCurrentView('subcategory');
    }
  }, [user, currentView]);

  const handleQuickHire = (workerId: string) => {
    console.log('Quick hiring worker:', workerId);
  };

  const handleWorkerClick = (worker: any) => {
    setSelectedWorker(worker);
    setShowWorkerModal(true);
  };

  const handleBackToCategory = () => {
    // Job seekers cannot go back to category selection
    if (user?.role === 'jobseeker') {
      return;
    }
    setCurrentView('category');
    setSelectedCategory(null);
    setSelectedSubcategories([]);
  };

  const handleBackToSubcategory = () => {
    setCurrentView('subcategory');
    setResults(null);
  };

  // For job seekers, skip category selection if they have a primary category
  if (currentView === 'category' && user?.role === 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-4">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold text-gray-900">
              Find Workers by Category
            </h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pt-6">
          <CategorySelection 
            onCategorySelect={handleCategorySelect}
            title="Select Worker Category"
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
              {user?.role === 'employer' && (
                <Button variant="ghost" size="sm" onClick={handleBackToCategory} className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-xl font-bold text-gray-900">
                {user?.role === 'jobseeker' ? 'Find Jobs in ' + selectedCategory.name : 'Select Specialization'}
              </h1>
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
          {user?.role === 'jobseeker' && (
            <div className="mt-6">
              <Button 
                className="w-full"
                onClick={handleSearchWithSubcategories}
              >
                View All {selectedCategory.name} Jobs
              </Button>
            </div>
          )}
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <JobSearchHeader
          searchQuery=""
          setSearchQuery={() => {}}
          location={location}
          setLocation={setLocation}
          selectedCategory={selectedCategory}
          resultsCount={0}
          userRole={user?.role}
          onBackToSubcategory={handleBackToSubcategory}
        />
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <SkeletonGrid count={5} type={user?.role === 'employer' ? 'worker' : 'job'} />
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <JobSearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
        setLocation={setLocation}
        selectedCategory={selectedCategory}
        resultsCount={results.length}
        userRole={user?.role}
        onBackToSubcategory={handleBackToSubcategory}
      />

      <main aria-live="polite">
        <JobSearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          urgentOnly={urgentOnly}
          setUrgentOnly={setUrgentOnly}
          resultsCount={results.length}
          userRole={user?.role}
          onShowQuickPost={() => setShowQuickPost(true)}
        />

        <JobSearchResults
          results={results}
          userRole={user?.role}
          onWorkerClick={handleWorkerClick}
        />
      </main>
      
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
