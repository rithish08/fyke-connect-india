
import { z } from 'zod';

export const profileSetupSchema = z.object({
  name: z.string().min(1, 'Please enter your name'),
  category: z.string().optional(),
  subcategories: z.array(z.string()).min(1, 'Please select at least one specialization').max(3, 'You can select up to 3 specializations'),
  vehicle: z.string().optional(),
  // Removed the old salary object, now using salaryBySubcategory:
  salaryBySubcategory: z.record(
    z.string(),
    z.object({
      amount: z.string().min(1, 'Please enter a salary amount').refine(
        (val) => !isNaN(Number(val)) && Number(val) > 0,
        'Please enter a valid amount'
      ),
      period: z.enum(['daily', 'weekly', 'monthly'])
    })
  ),
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
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
