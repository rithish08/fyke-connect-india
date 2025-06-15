
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useProfileSetupForm } from '@/hooks/useProfileSetupForm';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';
import { FloatingCard } from '@/components/ui/floating-card';
import ProfileLoading from '@/components/profile/setup/ProfileLoading';
import ProfileRedirect from '@/components/profile/setup/ProfileRedirect';
import ProfileNameStep from '@/components/profile/setup/ProfileNameStep';

const ProfileSetup = () => {
  const { userProfile, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const {
    form,
    currentStep,
    isSubmitting,
    nextStep,
    prevStep,
    submitProfile,
    shouldSkipWages,
    shouldShowPartialWages
  } = useProfileSetupForm();
  const [nameStep, setNameStep] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!userProfile) {
      navigate('/');
      return;
    }
    if (userProfile.role === 'employer') {
      navigate('/home');
      return;
    }
    if (!userProfile.role) {
      navigate('/role-selection');
      return;
    }
    if (userProfile.profile_complete) {
      navigate('/home');
      return;
    }
    if (!userProfile.name?.trim()) setNameStep(0);
    else setNameStep(1);
  }, [userProfile, loading, navigate]);

  const handleBack = async () => {
    if (currentStep > 0) {
      prevStep();
    } else {
      setNameStep(0);
    }
    return true;
  };

  const handleNameSubmit = (name: string) => {
    updateProfile({ name: name });
    setNameStep(1);
  };

  const handleFinish = async () => {
    console.log('handleFinish called');
    
    // Get all form data
    const formData = form.getValues();
    console.log('Form data:', formData);
    
    // Force completion by directly updating profile
    try {
      // Ensure salary data has required fields with proper types
      const salaryBySubcategory = formData.salaryBySubcategory || {};
      const processedSalaryData: Record<string, { amount: string; period: string }> = {};
      
      Object.entries(salaryBySubcategory).forEach(([key, value]) => {
        processedSalaryData[key] = {
          amount: value?.amount || '500',
          period: value?.period || 'daily'
        };
      });

      const profileData = {
        ...formData,
        profile_complete: true,
        availability: formData.availability || 'available' as const,
        salaryBySubcategory: Object.keys(processedSalaryData).length > 0 ? processedSalaryData : undefined
      };
      
      console.log('Updating profile with:', profileData);
      await updateProfile(profileData);
      
      console.log('Profile updated successfully, navigating to home');
      navigate('/home');
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      return false;
    }
  };

  if (loading) return <ProfileLoading />;
  if (!userProfile) return <ProfileRedirect />;

  if (nameStep === 0) {
    return (
      <ProfileNameStep
        onSubmit={handleNameSubmit}
        initialName=""
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        {/* Floating Header */}
        <FloatingCard variant="glow" size="sm" className="mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all duration-200 hover:scale-110"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Complete Profile
              </span>
            </div>
            <div className="w-10 h-10"></div>
          </div>
        </FloatingCard>

        {/* Step Content */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})}>
            {currentStep === 0 && (
              <ModernCategoryStep
                form={form}
                onNext={nextStep}
                userName={userProfile?.name || ""}
              />
            )}
            {currentStep === 1 && (shouldShowPartialWages || !shouldSkipWages) && (
              <ModernMultiSalaryStep
                form={form}
                onNext={handleFinish}
                onBack={prevStep}
              />
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSetup;
