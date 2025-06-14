
import { Button } from '@/components/ui/button';
import { X, ChevronRight } from 'lucide-react';
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
  { 
    name: "Construction", 
    icon: "🏗️", 
    color: "from-orange-400 to-red-500",
    subcategories: ["Mason", "Carpenter", "Electrician", "Plumber", "Painter", "Welder"] 
  },
  { 
    name: "Delivery", 
    icon: "🚚", 
    color: "from-blue-400 to-indigo-500",
    subcategories: ["Food Delivery", "Package Delivery", "Grocery Delivery", "Medicine Delivery"] 
  },
  { 
    name: "Cleaning", 
    icon: "🧹", 
    color: "from-green-400 to-emerald-500",
    subcategories: ["House Cleaning", "Office Cleaning", "Deep Cleaning", "Post-Construction"] 
  },
  { 
    name: "Security", 
    icon: "🛡️", 
    color: "from-purple-400 to-violet-500",
    subcategories: ["Night Guard", "Event Security", "CCTV Operator", "Residential Security"] 
  },
  { 
    name: "Driver", 
    icon: "🚗", 
    color: "from-yellow-400 to-orange-500",
    subcategories: ["Taxi Driver", "Delivery Driver", "Personal Driver", "Tour Guide"] 
  },
  { 
    name: "Cooking", 
    icon: "👨‍🍳", 
    color: "from-pink-400 to-rose-500",
    subcategories: ["Home Cook", "Event Cook", "Kitchen Helper", "Catering Assistant"] 
  },
  { 
    name: "Gardening", 
    icon: "🌱", 
    color: "from-lime-400 to-green-500",
    subcategories: ["Gardener", "Landscaper", "Plant Care", "Lawn Maintenance"] 
  },
  { 
    name: "Beauty", 
    icon: "💄", 
    color: "from-fuchsia-400 to-pink-500",
    subcategories: ["Hair Stylist", "Makeup Artist", "Nail Technician", "Spa Therapist"] 
  },
];

const vehicles = [
  { key: "bike", label: "🏍️ Motorcycle", description: "2-wheeler delivery", wage: "₹400-600/day" },
  { key: "car", label: "🚗 Car", description: "Passenger transport", wage: "₹800-1200/day" },
  { key: "auto", label: "🛺 Auto Rickshaw", description: "Local transport", wage: "₹600-900/day" },
  { key: "van", label: "🚐 Van", description: "Large delivery", wage: "₹1000-1500/day" },
];

const ProfileCategoryStep = ({ category, setCategory, vehicle, setVehicle, role, onNext }: StepProps) => {
  const [showSubcategories, setShowSubcategories] = useState(false);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  const selectedCategoryData = categories.find(cat => cat.name === category);

  const handleCategorySelect = (categoryName: string) => {
    setCategory(categoryName);
    const categoryData = categories.find(cat => cat.name === categoryName);
    if (categoryData?.subcategories.length && role === 'jobseeker') {
      setShowSubcategories(true);
    }
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    setSelectedSubcategories(prev => {
      const newSelection = prev.includes(subcategory) 
        ? prev.filter(s => s !== subcategory)
        : prev.length < 3 
          ? [...prev, subcategory]
          : prev;
      return newSelection;
    });
  };

  const handleNext = () => {
    // Save subcategories to localStorage for later use in profile completion
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

      {/* Category Grid - Enhanced for mobile */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map(cat => (
          <button
            key={cat.name}
            className={`relative p-4 rounded-2xl border-2 text-left transition-all duration-300 transform ${
              category === cat.name 
                ? "border-blue-500 bg-blue-50 shadow-lg scale-105 z-10" 
                : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-102"
            }`}
            onClick={() => handleCategorySelect(cat.name)}
            type="button"
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-5 rounded-2xl`} />
            
            <div className="relative">
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{cat.name}</div>
              <div className="text-xs text-gray-500 mb-2">
                {cat.subcategories.length} specializations
              </div>
              
              {category === cat.name && selectedSubcategories.length > 0 && (
                <div className="text-xs text-blue-600 font-medium">
                  {selectedSubcategories.length} selected
                </div>
              )}
              
              {category === cat.name && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Vehicle Selection for Drivers */}
      {category === "Driver" && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-lg mr-2">🚗</span>
            Select your vehicle type
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {vehicles.map(v => (
              <button
                key={v.key}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  vehicle === v.key 
                    ? "border-orange-500 bg-white shadow-md scale-105" 
                    : "border-gray-200 bg-white/70 hover:border-orange-300 hover:bg-white"
                }`}
                onClick={() => setVehicle(v.key)}
                type="button"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm flex items-center">
                      {v.label}
                      {vehicle === v.key && <span className="ml-2 text-orange-500">✓</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{v.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-green-600">{v.wage}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subcategories Modal */}
      {showSubcategories && selectedCategoryData && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <span className="text-2xl mr-2">{selectedCategoryData.icon}</span>
                Choose Specializations
              </h3>
              <button
                onClick={() => setShowSubcategories(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">
              Select up to 3 specializations that match your expertise
            </p>
            
            <div className="grid grid-cols-1 gap-2 mb-6">
              {selectedCategoryData.subcategories.map(sub => (
                <button
                  key={sub}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    selectedSubcategories.includes(sub)
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : selectedSubcategories.length >= 3
                      ? "border-gray-200 text-gray-400 cursor-not-allowed"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                  onClick={() => handleSubcategoryToggle(sub)}
                  disabled={!selectedSubcategories.includes(sub) && selectedSubcategories.length >= 3}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{sub}</span>
                    {selectedSubcategories.includes(sub) && (
                      <span className="text-blue-500 font-bold">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-500 mb-4 text-center">
              {selectedSubcategories.length}/3 specializations selected
            </div>

            <Button
              onClick={() => setShowSubcategories(false)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Done {selectedSubcategories.length > 0 && `(${selectedSubcategories.length} selected)`}
            </Button>
          </div>
        </div>
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
