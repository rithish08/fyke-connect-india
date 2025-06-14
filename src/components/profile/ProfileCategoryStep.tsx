
import { Button } from '@/components/ui/button';

interface StepProps {
  category: string;
  setCategory: (cat: string) => void;
  vehicle: string;
  setVehicle: (v: string) => void;
  role: 'jobseeker' | 'employer';
  onNext: () => void;
}

const categories = [
  "Construction", "Delivery", "Cleaning", "Security", "Driver", "Cooking", "Gardening"
];

const vehicles = [
  { key: "bike", label: "Bike" },
  { key: "car", label: "Car" },
  { key: "van", label: "Van" },
  { key: "truck", label: "Truck" },
];

const ProfileCategoryStep = ({ category, setCategory, vehicle, setVehicle, role, onNext }: StepProps) => (
  <div>
    <h2 className="font-bold text-lg mb-1">{role === "jobseeker" ? "Choose your work category" : "What worker do you want to hire?"}</h2>
    <div className="grid grid-cols-2 gap-3 mb-5">
      {categories.map(cat => (
        <button
          key={cat}
          className={`rounded-xl p-3 border-2 text-left transition
            ${category === cat ? "border-indigo-600 bg-indigo-50 font-bold scale-105 shadow-sm" : "border-gray-200 bg-white hover:border-indigo-400"}`}
          onClick={() => setCategory(cat)}
          type="button"
        >
          {cat}
          {cat === "Driver" && <span className="inline ml-2 text-xs text-indigo-400">vehicle logic</span>}
        </button>
      ))}
    </div>
    {category === "Driver" && (
      <div className="rounded-xl border border-gray-200 p-3 mb-3">
        <span className="block text-sm mb-2 font-medium">Select your vehicle type</span>
        <div className="flex flex-wrap gap-3">
          {vehicles.map(v => (
            <button
              key={v.key}
              className={`rounded-lg px-4 py-2 border-2 text-sm transition
                ${vehicle === v.key ? "border-green-600 bg-green-50 font-bold scale-105" : "border-gray-200 bg-white hover:border-green-400"}`}
              onClick={() => setVehicle(v.key)}
              type="button"
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>
    )}
    <Button
      className="w-full bg-gray-900 text-white font-semibold rounded-xl mt-4"
      disabled={!category || (category === "Driver" && !vehicle)}
      onClick={onNext}
    >
      Next
    </Button>
  </div>
);

export default ProfileCategoryStep;
