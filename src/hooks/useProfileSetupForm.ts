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

  const nextStep = useCallback(async () => {
    const currentData = form.getValues();
    saveDraft(currentData);
    let isValid = false;
    if (currentStep === 0) {
      isValid = await form.trigger(['category', 'subcategories', 'vehicle']);
    } else if (currentStep === 1) {
      isValid = await form.trigger(['salaryBySubcategory']);
    }
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 2));
    }
    return isValid;
  }, [currentStep, form, saveDraft]);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const submitProfile = useCallback(async (data: ProfileSetupFormData) => {
    setIsSubmitting(true);
    try {
      const salaries = Object.values(data.salaryBySubcategory || {});
      const min = Math.min(...salaries.map(s => Number(s.amount)));
      const max = Math.max(...salaries.map(s => Number(s.amount)));
      await updateProfile({
        primaryCategory: data.category,
        categories: [data.category],
        subcategories: data.subcategories,
        vehicle: data.subcategories.some(sub =>
          ['Taxi Driver', 'Delivery Driver', 'Personal Driver', 'Tour Guide'].includes(sub)
        ) ? data.vehicle : undefined,
        salaryExpectations: data.salaryBySubcategory,
        salaryExpectation: { min, max },
        salaryPeriod: salaries[0]?.period,
        availability: data.availability,
        name: data.name,
        profileComplete: true
      });
      localStorage.removeItem('fyke_profile_setup_draft');
      localStorage.removeItem('fyke_selected_subcategories');
      return true;
    } catch (error) {
      console.error('Profile update failed:', error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [updateProfile]);

  return {
    form,
    currentStep,
    isSubmitting,
    nextStep,
    prevStep,
    submitProfile,
    saveDraft
  };
};
