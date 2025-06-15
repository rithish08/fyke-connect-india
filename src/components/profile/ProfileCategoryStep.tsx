
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/categories';
import VehicleSelection from './VehicleSelection';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';
import { useAuth } from '@/contexts/AuthContext';

interface StepProps {
  category: string;
  setCategory: (cat: string) => void;
  vehicle: string;
  setVehicle: (v: string) => void;
  role: 'jobseeker' | 'employer';
  onNext: () => void;
}

const ProfileCategoryStep = ({ category, setCategory, vehicle, setVehicle, role, onNext }: StepProps) => {
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const { userProfile } = useAuth();

  // Load saved subcategories from localStorage on mount
  useEffect(() => {
    const savedSubcategories = localStorage.getItem('fyke_selected_subcategories');
    if (savedSubcategories) {
      try {
        const parsed = JSON.parse(savedSubcategories);
        setSelectedSubcategories(parsed);
      } catch (error) {
        console.error('Error parsing saved subcategories:', error);
      }
    }
  }, []);

  // Reset subcategories when category changes
  useEffect(() => {
    if (!category) {
      setSelectedSubcategories([]);
    }
  }, [category]);

  const selectedCategory = category ? { id: category.toLowerCase(), name: category } : null;

  const handleCategorySelect = (categoryId: string) => {
    console.log('Category selected:', categoryId);
    const found = categories.find(cat => cat.name.toLowerCase() === categoryId.toLowerCase());
    const categoryName = found ? found.name : categoryId;
    
    // Reset subcategories when changing category
    if (categoryName !== category) {
      setSelectedSubcategories([]);
      localStorage.removeItem('fyke_selected_subcategories');
    }
    
    setCategory(categoryName);
  };

  const handleSubcategorySelect = (categoryId: string, subcategories: string[]) => {
    console.log('Subcategories selected:', subcategories);
    setSelectedSubcategories(subcategories);
    
    // Save to localStorage
    localStorage.setItem('fyke_selected_subcategories', JSON.stringify(subcategories));
    
    // Ensure category is set
    const found = categories.find(cat => cat.name.toLowerCase() === categoryId.toLowerCase());
    if (found && found.name !== category) {
      setCategory(found.name);
    }
  };

  // Check if user can proceed to next step
  const canProceed = category && 
                    selectedSubcategories.length > 0 && 
                    (category !== "Driver" || vehicle);

  const handleNext = () => {
    if (canProceed) {
      console.log('Proceeding to next step with:', {
        category,
        subcategories: selectedSubcategories,
        vehicle
      });
      
      // Save selected data for profile completion
      localStorage.setItem('fyke_profile_category', category);
      localStorage.setItem('fyke_profile_subcategories', JSON.stringify(selectedSubcategories));
      if (vehicle) {
        localStorage.setItem('fyke_profile_vehicle', vehicle);
      }
      
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          {role === "jobseeker" ? "What work do you do?" : "What type of worker do you need?"}
        </h2>
        <p className="text-gray-500">Select your primary category to get started</p>
      </div>

      {/* Enhanced Category Selection */}
      <div className="space-y-4">
        <EnhancedCategoryModal
          selectedCategories={
            selectedCategory ? { [selectedCategory.id]: selectedSubcategories } : {}
          }
          onCategorySelect={handleCategorySelect}
          onSubcategorySelect={handleSubcategorySelect}
          onClear={() => {
            setSelectedSubcategories([]);
            setCategory("");
            localStorage.removeItem('fyke_selected_subcategories');
          }}
        />
        
        {/* Show selected category and subcategories */}
        {category && (
          <div className="bg-blue-50 p-4 rounded-xl">
            <div className="text-sm font-medium text-blue-900">Selected:</div>
            <div className="text-blue-700">{category}</div>
            {selectedSubcategories.length > 0 && (
              <div className="text-xs text-blue-600 mt-1">
                {selectedSubcategories.length} specialization{selectedSubcategories.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vehicle Selection for Drivers */}
      {category === "Driver" && (
        <VehicleSelection
          selectedVehicle={vehicle}
          onVehicleSelect={setVehicle}
        />
      )}

      {/* Continue Button */}
      <div className="pt-4">
        <Button
          className={`w-full h-14 font-semibold text-lg rounded-2xl transition-all ${
            canProceed
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!canProceed}
          onClick={handleNext}
        >
          {!category
            ? 'Select a category to continue'
            : selectedSubcategories.length === 0
            ? 'Select at least 1 specialization'
            : category === "Driver" && !vehicle
            ? 'Select a vehicle type'
            : `Continue with ${category}`
          }
        </Button>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCategoryStep;
