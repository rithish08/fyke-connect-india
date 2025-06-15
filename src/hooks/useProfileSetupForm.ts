
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSetupSchema, ProfileSetupFormData } from '@/schemas/profileSetupSchema';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileSetupForm = () => {
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load saved data from localStorage or user profile
  const getInitialData = useCallback((): ProfileSetupFormData => {
    const savedData = localStorage.getItem('fyke_profile_setup_draft');
    const parsedData = savedData ? JSON.parse(savedData) : {};
    
    return {
      category: user?.primaryCategory || parsedData.category || '',
      subcategories: parsedData.subcategories || [],
      vehicle: parsedData.vehicle || '',
      salary: {
        amount: parsedData.salary?.amount || '',
        period: parsedData.salary?.period || 'daily'
      },
      availability: user?.availability || parsedData.availability || 'available'
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
    
    // Validate current step before proceeding
    let isValid = false;
    
    if (currentStep === 0) {
      isValid = await form.trigger(['category', 'subcategories', 'vehicle']);
    } else if (currentStep === 1) {
      isValid = await form.trigger(['salary']);
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
      await updateProfile({
        primaryCategory: data.category,
        categories: [data.category],
        subcategories: data.subcategories,
        vehicle: data.category === 'Driver' ? data.vehicle : undefined,
        salaryExpectation: { 
          min: Number(data.salary.amount), 
          max: Number(data.salary.amount) 
        },
        salaryPeriod: data.salary.period,
        availability: data.availability,
        profileComplete: true
      });
      
      // Clean up saved draft
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
