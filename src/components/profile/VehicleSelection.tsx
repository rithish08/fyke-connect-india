
import { vehicles } from '@/data/categories';

interface VehicleSelectionProps {
  selectedVehicle: string;
  onVehicleSelect: (vehicle: string) => void;
}

const VehicleSelection = ({ selectedVehicle, onVehicleSelect }: VehicleSelectionProps) => {
  return (
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
              selectedVehicle === v.key 
                ? "border-orange-500 bg-white shadow-md scale-105" 
                : "border-gray-200 bg-white/70 hover:border-orange-300 hover:bg-white"
            }`}
            onClick={() => onVehicleSelect(v.key)}
            type="button"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm flex items-center">
                  {v.label}
                  {selectedVehicle === v.key && <span className="ml-2 text-orange-500">✓</span>}
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
  );
};

export default VehicleSelection;
