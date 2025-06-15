
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
import StickyFooterButton from '@/components/ui/StickyFooterButton';

const ProfileSetup = () => {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { form, currentStep, isSubmitting, nextStep, prevStep, submitProfile } = useProfileSetupForm();
  const [step, setStep] = useState<"name"|"category"|"wage"|"availability">("name");

  // Initial authentication + profile state redirects
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
    // If name not set, go to name input, else category
    if (!user.name?.trim()) setStep("name");
    else setStep("category");
  }, [user, loading, navigate]);

  const handleNameSubmit = (name: string) => {
    updateProfile({ name: name });
    setStep("category");
  };

  // Category → Wage → Availability steps, but without a stepper
  const [interStep, setInterStep] = useState<"category"|"wage"|"availability">("category");

  // Used by the sticky footer in each step
  const goNext = async () => {
    if (interStep === "category") {
      const valid = await nextStep();
      if (valid) setInterStep("wage");
    }
    else if (interStep === "wage") {
      const valid = await nextStep();
      if (valid) setInterStep("availability");
    }
  };
  const goBack = () => {
    if (interStep === "wage") setInterStep("category");
    else if (interStep === "availability") setInterStep("wage");
  };

  // Final submission handler for complete profile
  const handleFinish = async (data: any) => {
    const success = await submitProfile(data);
    if (success) navigate('/home');
    return success;
  };

  if (loading) return <ProfileLoading />;
  if (!user) return <ProfileRedirect />;

  // Name step single input
  if (step === "name") {
    return (
      <ProfileNameStep
        onSubmit={handleNameSubmit}
        initialName=""
      />
    );
  }

  // Main profile setup UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 px-2 py-3">
      <div className="w-full max-w-lg mx-auto">
        {/* Floating Header */}
        <FloatingCard variant="glow" size="sm" className="mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (interStep === "category") setStep("name");
                else goBack();
              }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center hover:from-gray-200 hover:to-gray-300 transition-all duration-200 hover:scale-110"
            >
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                Profile Setup
              </span>
            </div>
            <div className="w-10 h-10" />
          </div>
        </FloatingCard>

        <Form {...form}>
          {/* Main body */}
          <form
            // Don't automatically submit
            onSubmit={e => e.preventDefault()}
            className="w-full"
            autoComplete="off"
          >
            {interStep === "category" && (
              <ModernCategoryStep
                form={form}
                onNext={goNext}
                userName={user?.name || ""}
              />
            )}
            {interStep === "wage" && (
              <ModernMultiSalaryStep
                form={form}
                onNext={goNext}
                onBack={goBack}
              />
            )}
            {interStep === "availability" && (
              <ModernAvailabilityStep 
                form={form} 
                onBack={goBack} 
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
