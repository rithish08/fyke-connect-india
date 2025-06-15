
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSetupSchema, ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileSetupForm = () => {
  const { updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      name: '',
      category: '',
      subcategories: [],
      vehicle: '',
      salaryBySubcategory: {},
      availability: 'available'
    }
  });

  const watchedSubcategories = form.watch('subcategories') || [];

  // Update: Allow "Mason", "House Cleaning", and vehicle categories to be combined
  const isVehicleCategory = (sub: string) => [
    'Cargo Auto', 'Mini Truck (e.g., Tata Ace)', 'Lorry / Truck (6–12 wheeler)', 'Tractor with Trailer',
    'Bike with Carrier', 'Auto Rickshaw', 'Bike Taxi', 'Taxi (Sedan/Hatchback)', 'Passenger Van (Eeco, Force)', 
    'Private Bus (15–50 seats)', 'Water Tanker', 'Ambulance'
  ].includes(sub);

  const hasVehicleOwnerCategory = watchedSubcategories.some(isVehicleCategory);
  const hasMason = watchedSubcategories.includes('Mason');
  const hasHouseCleaning = watchedSubcategories.includes('House Cleaning');
  const hasNonVehicleOwnerCategory = watchedSubcategories.some(sub =>
    !isVehicleCategory(sub)
  );
  // (NEW logic) If categories are combined, allow progression
  // -- allow combinations of "Mason", "House Cleaning", vehicle and others!

  // If only vehicle owner, skip wages; if vehicle + other (incl. Mason/HouseCleaning), show partial wages
  const shouldSkipWages = hasVehicleOwnerCategory && !hasNonVehicleOwnerCategory;
  const shouldShowPartialWages = hasVehicleOwnerCategory && hasNonVehicleOwnerCategory;

  const nextStep = async () => {
    if (currentStep === 0) {
      // From category selection
      if (shouldSkipWages) {
        setCurrentStep(2); // Skip to availability
      } else {
        setCurrentStep(1); // Go to wages
      }
    } else if (currentStep === 1) {
      setCurrentStep(2); // From wages to availability
    }
    return true;
  };

  const prevStep = async () => {
    if (currentStep === 2 && shouldSkipWages) {
      setCurrentStep(0); // From availability back to category
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
    return true;
  };

  const submitProfile = async (data: ProfileSetupFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting profile data:', data);
      
      // Filter out salary data for vehicle owner subcategories
      const filteredSalaryData = shouldShowPartialWages 
        ? Object.fromEntries(
            Object.entries(data.salaryBySubcategory || {}).filter(([subcategory]) =>
              !['Cargo Auto', 'Mini Truck (e.g., Tata Ace)', 'Lorry / Truck (6–12 wheeler)', 
                'Tractor with Trailer', 'Bike with Carrier', 'Auto Rickshaw', 'Bike Taxi', 
                'Taxi (Sedan/Hatchback)', 'Passenger Van (Eeco, Force)', 'Private Bus (15–50 seats)', 
                'Water Tanker', 'Ambulance'].includes(subcategory)
            )
          )
        : data.salaryBySubcategory;

      // Convert optional properties to required for User type
      const salaryBySubcategory = filteredSalaryData 
        ? Object.fromEntries(
            Object.entries(filteredSalaryData).map(([key, value]) => [
              key, 
              { 
                amount: value.amount || '0', 
                period: value.period || 'daily' 
              }
            ])
          )
        : undefined;

      const profileData = {
        ...data,
        salaryBySubcategory: shouldSkipWages ? undefined : salaryBySubcategory,
        profileComplete: true
      };

      await updateProfile(profileData);
      return true;
    } catch (error) {
      console.error('Profile submission error:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    submitProfile,
    isSubmitting,
    shouldSkipWages,
    shouldShowPartialWages,
    hasVehicleOwnerCategory
  };
};
