
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useProfileSetupForm } from '@/hooks/useProfileSetupForm';
import ProfileSetupStepper from '@/components/profile/ProfileSetupStepper';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernSalaryStep from '@/components/profile/ModernSalaryStep';
import ModernAvailabilityStep from '@/components/profile/ModernAvailabilityStep';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import ShimmerLoader from '@/components/ui/ShimmerLoader';

const STEPS = [
  {
    title: "Choose Your Category",
    description: "Select what type of work you do and your specializations"
  },
  {
    title: "Set Your Rate",
    description: "Tell us your expected salary to match with right opportunities"
  },
  {
    title: "Set Availability",
    description: "Let employers know when you're ready to work"
  }
];

const ProfileSetup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { form, currentStep, isSubmitting, nextStep, prevStep, submitProfile } = useProfileSetupForm();

  useEffect(() => {
    console.log('[ProfileSetup] Auth state:', { user: !!user, loading, role: user?.role, profileComplete: user?.profileComplete });

    if (loading) {
      console.log('[ProfileSetup] Still loading auth...');
      return;
    }

    if (!user) {
      console.log('[ProfileSetup] No user, redirecting to login...');
      navigate('/login');
      return;
    }

    if (user.role === 'employer') {
      console.log('[ProfileSetup] Employer detected, redirecting to home...');
      navigate('/home');
      return;
    }

    if (!user.role) {
      console.log('[ProfileSetup] No role set, redirecting to role selection...');
      navigate('/role-selection');
      return;
    }

    if (user.profileComplete) {
      console.log('[ProfileSetup] Profile already complete, redirecting to home...');
      navigate('/home');
      return;
    }

    console.log('[ProfileSetup] Ready to show profile setup form');
  }, [user, loading, navigate]);

  const handleBack = () => {
    if (currentStep > 0) {
      prevStep();
    } else {
      navigate('/role-selection');
    }
  };

  const handleFinish = async (data: any) => {
    const success = await submitProfile(data);
    if (success) {
      navigate('/home');
    }
    return success;
  };

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShimmerLoader height={60} width="200px" />
          <p className="text-gray-600">Setting up your profile...</p>
        </div>
      </div>
    );
  }

  // Show fallback if no user after loading
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Main profile setup UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-4 py-8">
      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <BadgeCheck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Profile Setup
            </span>
          </div>
          <div className="w-12 h-12"></div>
        </div>

        {/* Progress Stepper */}
        <AestheticCard variant="glass" className="shadow-xl border-0">
          <ProfileSetupStepper currentStep={currentStep} steps={STEPS} />
        </AestheticCard>

        {/* Step Content */}
        <AestheticCard variant="glass" className="shadow-xl border-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              {currentStep === 0 && (
                <ModernCategoryStep form={form} onNext={nextStep} />
              )}
              {currentStep === 1 && (
                <ModernSalaryStep form={form} onNext={nextStep} onBack={prevStep} />
              )}
              {currentStep === 2 && (
                <ModernAvailabilityStep 
                  form={form} 
                  onBack={prevStep} 
                  onFinish={handleFinish}
                  isSubmitting={isSubmitting}
                />
              )}
            </form>
          </Form>
        </AestheticCard>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 px-4">
          <p className="bg-white/80 backdrop-blur-sm rounded-xl py-3 px-4 shadow-sm">
            Complete your profile to get verified and access better job opportunities
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
