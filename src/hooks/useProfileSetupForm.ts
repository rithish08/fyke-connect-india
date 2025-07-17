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

  const nextStep = async () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = async () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitProfile = async (data: ProfileSetupFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting profile data:', data);
      
      const profileData = {
        ...data,
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
  };
};
