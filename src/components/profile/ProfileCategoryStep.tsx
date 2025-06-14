import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { categories } from '@/data/categories';
import VehicleSelection from './VehicleSelection';
import EnhancedCategoryModal from '@/components/search/EnhancedCategoryModal';

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

  const selectedCategory = category ? { id: category.toLowerCase(), name: category } : null;

  // Now expects only a single categoryId (and can pick category name from id if needed)
  const handleCategorySelect = (categoryId: string) => {
    const found = categories.find(cat => cat.name.toLowerCase() === categoryId);
    const categoryName = found ? found.name : categoryId;
    setCategory(categoryName);
    // Clear subcategories when category changes
    if (categoryName !== category) {
      setSelectedSubcategories([]);
    }
  };

  // Now expects both categoryId and subcategories
  const handleSubcategorySelect = (categoryId: string, subcategories: string[]) => {
    setSelectedSubcategories(subcategories);
  };

  const handleNext = () => {
    if (selectedSubcategories.length > 0) {
      localStorage.setItem('fyke_selected_subcategories', JSON.stringify(selectedSubcategories));
    }
    onNext();
  };

  const canProceed = category && (category !== "Driver" || vehicle);

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
      <EnhancedCategoryModal
        selectedCategories={
          selectedCategory ? { [selectedCategory.id]: selectedSubcategories } : {}
        }
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        onClear={() => {
          // Clear selection for current category
          if (selectedCategory) {
            setSelectedSubcategories([]);
            setCategory("");
          }
        }}
      />
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
          {category ? `Continue with ${category}` : 'Select a category to continue'}
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
