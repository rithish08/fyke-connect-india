
import { z } from 'zod';

export const profileSetupSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  subcategories: z.array(z.string()).min(1, 'Please select at least one specialization'),
  vehicle: z.string().optional(),
  salary: z.object({
    amount: z.string().min(1, 'Please enter a salary amount').refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      'Please enter a valid amount'
    ),
    period: z.enum(['daily', 'weekly', 'monthly'])
  }),
  availability: z.enum(['available', 'busy', 'offline'])
}).refine((data) => {
  // Vehicle is required for drivers
  if (data.category === 'Driver' && !data.vehicle) {
    return false;
  }
  return true;
}, {
  message: 'Please select a vehicle type for drivers',
  path: ['vehicle']
});

export type ProfileSetupFormData = z.infer<typeof profileSetupSchema>;
