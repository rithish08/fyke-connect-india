
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useProfileSetupForm } from '@/hooks/useProfileSetupForm';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernAvailabilityStep from '@/components/profile/ModernAvailabilityStep';
import { FloatingCard } from '@/components/ui/floating-card';
import ProfileLoading from '@/components/profile/setup/ProfileLoading';
import ProfileRedirect from '@/components/profile/setup/ProfileRedirect';
import ProfileNameStep from '@/components/profile/setup/ProfileNameStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';
import { ProfileSetupFormData } from '@/schemas/profileSetupSchema';

const ProfileSetup = () => {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { form, currentStep, isSubmitting, nextStep, prevStep, submitProfile, isVehicleOwner } = useProfileSetupForm();
  const [nameStep, setNameStep] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate('/');
      return;
    }
    if (user.role === 'employer') {
      navigate('/home');
      return;
    }
    if (!user.role) {
      navigate('/role-selection');
      return;
    }
    if (user.profileComplete) {
      navigate('/home');
      return;
    }
    // Always start with name step if not present
    if (!user.name?.trim()) setNameStep(0);
    else setNameStep(1);
  }, [user, loading, navigate]);

  const handleBack = () => {
    if (currentStep > 0) {
      // For vehicle owners, handle the skip between steps
      if (currentStep === 2 && isVehicleOwner) {
        prevStep(); // This will go to step 0
      } else {
        prevStep();
      }
    } else {
      setNameStep(0);
    }
  };

  const handleNameSubmit = (name: string) => {
    updateProfile({ name: name });
    setNameStep(1);
  };

  const handleFinish = async (data: ProfileSetupFormData) => {
    console.log('Profile setup data:', data);
    const success = await submitProfile(data);
    console.log('Profile submission result:', success);
    if (success) {
      console.log('Navigating to home after successful profile setup');
      navigate('/home');
    }
    return success;
  };

  if (loading) return <ProfileLoading />;
  if (!user) return <ProfileRedirect />;

  // Name input step
  if (nameStep === 0) {
    return (
      <ProfileNameStep
        onSubmit={handleNameSubmit}
        initialName=""
      />
    );
  }

  // Main profile setup UI
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
                userName={user?.name || ""}
              />
            )}
            {currentStep === 1 && !isVehicleOwner && (
              <ModernMultiSalaryStep
                form={form}
                onNext={nextStep}
                onBack={prevStep}
              />
            )}
            {currentStep === 2 && (
              <ModernAvailabilityStep 
                form={form} 
                onBack={handleBack} 
                onFinish={handleFinish}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSetup;
