
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSetupSchema, ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileSetupForm = () => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getInitialData = useCallback((): ProfileSetupFormData => {
    const savedData = localStorage.getItem('fyke_profile_setup_draft');
    const parsedData = savedData ? JSON.parse(savedData) : {};
    
    return {
      category: user?.primaryCategory || parsedData.category || '',
      subcategories: parsedData.subcategories || [],
      vehicle: parsedData.vehicle || '',
      salaryBySubcategory: parsedData.salaryBySubcategory || {},
      availability: user?.availability || parsedData.availability || 'available',
      name: user?.name || parsedData.name || '',
    };
  }, [user]);

  const form = useForm<ProfileSetupFormData>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: getInitialData(),
    mode: 'onChange'
  });

  const saveDraft = useCallback((data: Partial<ProfileSetupFormData>) => {
    const currentData = form.getValues();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem('fyke_profile_setup_draft', JSON.stringify(updatedData));
  }, [form]);

  const isVehicleOwner = useCallback(() => {
    const category = form.getValues('category');
    return category === 'Vehicle Owners';
  }, [form]);

  const nextStep = useCallback(async () => {
    const currentData = form.getValues();
    saveDraft(currentData);
    let isValid = false;
    
    if (currentStep === 0) {
      isValid = await form.trigger(['category', 'subcategories', 'vehicle']);
    } else if (currentStep === 1 && !isVehicleOwner()) {
      isValid = await form.trigger(['salaryBySubcategory']);
    } else if (currentStep === 1 && isVehicleOwner()) {
      // Skip salary step for vehicle owners
      isValid = true;
    }
    
    if (isValid) {
      // For vehicle owners, skip from step 0 to step 2 (availability)
      if (currentStep === 0 && isVehicleOwner()) {
        setCurrentStep(2);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 2));
      }
    }
    return isValid;
  }, [currentStep, form, saveDraft, isVehicleOwner]);

  const prevStep = useCallback(() => {
    // For vehicle owners going back from availability (step 2), go to category (step 0)
    if (currentStep === 2 && isVehicleOwner()) {
      setCurrentStep(0);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 0));
    }
  }, [currentStep, isVehicleOwner]);

  const submitProfile = useCallback(async (data: ProfileSetupFormData) => {
    setIsSubmitting(true);
    try {
      let profileUpdate: any = {
        primaryCategory: data.category,
        categories: [data.category],
        subcategories: data.subcategories,
        vehicle: data.subcategories.some(sub =>
          ['Taxi Driver', 'Delivery Driver', 'Personal Driver', 'Tour Guide'].includes(sub)
        ) ? data.vehicle : undefined,
        availability: data.availability,
        name: data.name,
        profileComplete: true
      };

      // Only set salary for non-vehicle owners
      if (!isVehicleOwner()) {
        const salaries = Object.values(data.salaryBySubcategory || {});
        if (salaries.length > 0) {
          const min = Math.min(...salaries.map(s => Number(s.amount)));
          const max = Math.max(...salaries.map(s => Number(s.amount)));
          profileUpdate.salaryExpectation = { min, max };
          profileUpdate.salaryPeriod = salaries[0]?.period;
        }
      }

      await updateProfile(profileUpdate);
      localStorage.removeItem('fyke_profile_setup_draft');
      localStorage.removeItem('fyke_selected_subcategories');
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [updateProfile, isVehicleOwner]);

  return {
    form,
    currentStep,
    isSubmitting,
    nextStep,
    prevStep,
    submitProfile,
    saveDraft,
    isVehicleOwner: isVehicleOwner()
  };
};
