
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useProfileSetupForm } from '@/hooks/useProfileSetupForm';
import ProfileSetupStepper from '@/components/profile/ProfileSetupStepper';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernAvailabilityStep from '@/components/profile/ModernAvailabilityStep';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import ProfileLoading from '@/components/profile/setup/ProfileLoading';
import ProfileRedirect from '@/components/profile/setup/ProfileRedirect';
import ProfileNameStep from '@/components/profile/setup/ProfileNameStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';

const STEPS = [
  {
    title: "Enter Your Name",
    description: "Add your name to complete your profile"
  },
  {
    title: "Choose Specializations",
    description: "Select up to 3 specializations from any category"
  },
  {
    title: "Set Your Rate",
    description: "Enter your wage expectations for each work type"
  },
  {
    title: "Set Availability",
    description: "Let employers know when you're ready to work"
  }
];

const ProfileSetup = () => {
  const { user, loading, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { form, currentStep, isSubmitting, nextStep, prevStep, submitProfile } = useProfileSetupForm();
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
    if (currentStep > 0) prevStep();
    else setNameStep(0);
  };

  const handleNameSubmit = (name: string) => {
    updateProfile({ name: name });
    setNameStep(1);
  };

  const handleFinish = async (data: any) => {
    const success = await submitProfile(data);
    if (success) navigate('/home');
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
          <ProfileSetupStepper currentStep={currentStep + 1} steps={STEPS} />
        </AestheticCard>

        {/* Step Content */}
        <AestheticCard variant="glass" className="shadow-xl border-0">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(() => {})}>
              {currentStep === 0 && (
                <ModernCategoryStep
                  form={form}
                  onNext={nextStep}
                  userName={user?.name || ""}
                />
              )}
              {currentStep === 1 && (
                <ModernMultiSalaryStep
                  form={form}
                  onNext={nextStep}
                  onBack={prevStep}
                />
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
