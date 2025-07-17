import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { useProfileSetupForm } from '@/hooks/useProfileSetupForm';
import ProfileNameStep from '@/components/profile/setup/ProfileNameStep';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';
import ProfileLoading from '@/components/profile/setup/ProfileLoading';
import ProfileRedirect from '@/components/profile/setup/ProfileRedirect';

const ProfileSetup = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { form, currentStep, isSubmitting, nextStep, prevStep, submitProfile } = useProfileSetupForm();

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
  }, [user, loading, navigate]);

  if (loading) return <ProfileLoading />;
  if (!user) return <ProfileRedirect />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(submitProfile)}>
            {currentStep === 0 && <ProfileNameStep form={form} onNext={nextStep} />}
            {currentStep === 1 && <ModernCategoryStep form={form} onNext={nextStep} />}
            {currentStep === 2 && <ModernMultiSalaryStep form={form} onNext={submitProfile} onBack={prevStep} />}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfileSetup;
