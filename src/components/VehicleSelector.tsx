
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface VehicleSelectorProps {
  onSelectionChange: (vehicles: string[]) => void;
  maxSelections?: number;
  selectedVehicles?: string[];
}

const vehicles = [
  { id: 'bike', name: 'Bike/Scooter', icon: '🏍️', description: 'Two-wheeler delivery' },
  { id: 'car', name: 'Car', icon: '🚗', description: 'Four-wheeler transport' },
  { id: 'van', name: 'Van', icon: '🚐', description: 'Large capacity delivery' },
  { id: 'truck', name: 'Truck', icon: '🚛', description: 'Heavy goods transport' },
  { id: 'auto', name: 'Auto Rickshaw', icon: '🛺', description: 'Local passenger transport' },
  { id: 'bicycle', name: 'Bicycle', icon: '🚲', description: 'Eco-friendly delivery' }
];

const VehicleSelector = ({ 
  onSelectionChange, 
  maxSelections = 3, 
  selectedVehicles = [] 
}: VehicleSelectorProps) => {
  const [selected, setSelected] = useState<string[]>(selectedVehicles);

  const handleVehicleToggle = (vehicleId: string) => {
    let newSelected: string[];
    
    if (selected.includes(vehicleId)) {
      // Remove if already selected
      newSelected = selected.filter(id => id !== vehicleId);
    } else if (selected.length < maxSelections) {
      // Add if under limit
      newSelected = [...selected, vehicleId];
    } else {
      // Replace first selection if at limit
      newSelected = [vehicleId, ...selected.slice(1)];
    }
    
    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select Your Vehicles</h3>
        <p className="text-sm text-gray-600">
          Choose up to {maxSelections} vehicles you can use for work
        </p>
        {selected.length > 0 && (
          <p className="text-xs text-blue-600 mt-1">
            {selected.length}/{maxSelections} selected
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {vehicles.map((vehicle) => {
          const isSelected = selected.includes(vehicle.id);
          const isDisabled = !isSelected && selected.length >= maxSelections;
          
          return (
            <Card
              key={vehicle.id}
              className={`p-4 cursor-pointer transition-all duration-200 relative ${
                isSelected
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200'
                  : isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-md hover:border-blue-200'
              }`}
              onClick={() => !isDisabled && handleVehicleToggle(vehicle.id)}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="text-center space-y-2">
                <div className="text-3xl">{vehicle.icon}</div>
                <h4 className={`font-semibold text-sm ${
                  isSelected ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {vehicle.name}
                </h4>
                <p className={`text-xs ${
                  isSelected ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {vehicle.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {selected.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">
              Selected: {selected.map(id => vehicles.find(v => v.id === id)?.name).join(', ')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSelector;
