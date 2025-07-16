
import { z } from 'zod';

export const profileSetupSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  categories: z.array(z.string()).min(1, 'Please select at least one category').optional(),
  category: z.string().optional(),
  subcategories: z.array(z.string()).min(1, 'Please select at least one specialization').max(3, 'You can select up to 3 specializations'),
  vehicle: z.string().optional(),
  salaryBySubcategory: z.record(
    z.string(),
    z.object({
      amount: z.string().min(1, 'Please enter a salary amount').refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        'Please enter a valid amount'
      ),
      period: z.enum(['daily', 'weekly', 'monthly'])
    })
  ).optional(),
  availability: z.enum(['available', 'busy', 'offline'])
}).refine((data) => {
  const hasDriverSubcategory = data.subcategories.some(sub =>
    ['Taxi Driver', 'Delivery Driver', 'Personal Driver', 'Tour Guide'].includes(sub)
  );
  if (hasDriverSubcategory && !data.vehicle) {
    return false;
  }
  return true;
}, {
  message: 'Please select a vehicle type for driver specializations',
  path: ['vehicle']
}).refine((data) => {
  // Check if user has non-vehicle subcategories that need salary
  const vehicleOwnerSubs = ['Cargo Auto', 'Mini Truck (e.g., Tata Ace)', 'Lorry / Truck (6–12 wheeler)', 
    'Tractor with Trailer', 'Bike with Carrier', 'Auto Rickshaw', 'Bike Taxi', 
    'Taxi (Sedan/Hatchback)', 'Passenger Van (Eeco, Force)', 'Private Bus (15–50 seats)', 
    'Water Tanker', 'Ambulance'];
  
  const nonVehicleSubcategories = data.subcategories.filter(sub => !vehicleOwnerSubs.includes(sub));
  
  // If there are non-vehicle subcategories, salary data is required for them
  if (nonVehicleSubcategories.length > 0) {
    const salaryData = data.salaryBySubcategory || {};
    const allHaveSalary = nonVehicleSubcategories.every(sub => 
      salaryData[sub]?.amount && salaryData[sub]?.period
    );
    
    if (!allHaveSalary) {
      return false;
    }
  }
  
  return true;
}, {
  message: 'Please set salary for all non-vehicle specializations',
  path: ['salaryBySubcategory']
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
