
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

interface StepProps {
  category: string;
  setCategory: (cat: string) => void;
  vehicle: string;
  setVehicle: (v: string) => void;
  role: 'jobseeker' | 'employer';
  onNext: () => void;
}

const categories = [
  { name: "Construction", icon: "🏗️", subcategories: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter"] },
  { name: "Delivery", icon: "🚚", subcategories: ["Food Delivery", "Package Delivery", "Grocery Delivery"] },
  { name: "Cleaning", icon: "🧹", subcategories: ["House Cleaning", "Office Cleaning", "Deep Cleaning"] },
  { name: "Security", icon: "🛡️", subcategories: ["Night Guard", "Event Security", "CCTV Operator"] },
  { name: "Driver", icon: "🚗", subcategories: ["Taxi Driver", "Delivery Driver", "Personal Driver"] },
  { name: "Cooking", icon: "👨‍🍳", subcategories: ["Home Cook", "Event Cook", "Kitchen Helper"] },
  { name: "Gardening", icon: "🌱", subcategories: ["Gardener", "Landscaper", "Plant Care"] },
];

const vehicles = [
  { key: "bike", label: "🏍️ Bike", description: "2-wheeler delivery" },
  { key: "car", label: "🚗 Car", description: "Passenger transport" },
  { key: "van", label: "🚐 Van", description: "Large delivery" },
  { key: "truck", label: "🚛 Truck", description: "Heavy transport" },
];

const ProfileCategoryStep = ({ category, setCategory, vehicle, setVehicle, role, onNext }: StepProps) => {
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const selectedCategoryData = categories.find(cat => cat.name === category);

  const handleCategorySelect = (categoryName: string) => {
    setCategory(categoryName);
    const categoryData = categories.find(cat => cat.name === categoryName);
    if (categoryData?.subcategories.length) {
      setShowSubcategories(true);
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    );
  };

  const handleCloseSubcategories = () => {
    setShowSubcategories(false);
  };

  const canProceed = category && (category !== "Driver" || vehicle);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {role === "jobseeker" ? "What work do you do?" : "What type of worker do you need?"}
        </h2>
        <p className="text-gray-500">Select your primary category</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => (
          <button
            key={cat.name}
            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
              category === cat.name 
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105" 
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
            }`}
            onClick={() => handleCategorySelect(cat.name)}
            type="button"
          >
            <div className="text-2xl mb-2">{cat.icon}</div>
            <div className="font-semibold text-gray-900 text-sm">{cat.name}</div>
            {cat.subcategories.length > 0 && (
              <div className="text-xs text-gray-500 mt-1">
                {cat.subcategories.length} specializations
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Vehicle Selection for Drivers */}
      {category === "Driver" && (
        <div className="bg-blue-50 rounded-2xl p-4 space-y-3">
          <h3 className="font-semibold text-gray-900">Select your vehicle</h3>
          <div className="grid grid-cols-2 gap-2">
            {vehicles.map(v => (
              <button
                key={v.key}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  vehicle === v.key 
                    ? "border-blue-500 bg-white shadow-md" 
                    : "border-gray-200 bg-white/50 hover:border-blue-300"
                }`}
                onClick={() => setVehicle(v.key)}
                type="button"
              >
                <div className="font-medium text-sm">{v.label}</div>
                <div className="text-xs text-gray-500">{v.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Modal */}
      {showSubcategories && selectedCategoryData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {selectedCategoryData.icon} {selectedCategoryData.name} Specializations
              </h3>
              <button
                onClick={handleCloseSubcategories}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 mb-6">
              {selectedCategoryData.subcategories.map(sub => (
                <button
                  key={sub}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    selectedSubcategories.includes(sub)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => handleSubcategoryToggle(sub)}
                  type="button"
                >
                  <div className="font-medium text-sm">{sub}</div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleCloseSubcategories}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Done ({selectedSubcategories.length} selected)
            </Button>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <Button
        className={`w-full h-14 font-semibold text-lg rounded-2xl transition-all ${
          canProceed
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
        disabled={!canProceed}
        onClick={onNext}
      >
        Continue
      </Button>
    </div>
  );
};

export default ProfileCategoryStep;
