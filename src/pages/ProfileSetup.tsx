import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useForm, UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';
import { FloatingCard } from '@/components/ui/floating-card';
import ProfileLoading from '@/components/profile/setup/ProfileLoading';
import ProfileRedirect from '@/components/profile/setup/ProfileRedirect';
import ProfileNameStep from '@/components/profile/setup/ProfileNameStep';
import { useLocalization } from '@/contexts/LocalizationContext';
import WagesPopup from '@/components/profile/setup/WagesPopup';

// Define a schema for the multi-step form
const profileSetupSchema = z.object({
  name: z.string().optional(),
  categories: z.array(z.string()).optional(),
  salaryBySubcategory: z.record(z.object({
    amount: z.string(),
    period: z.enum(['daily', 'weekly', 'monthly']),
  })).optional(),
});

type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

const ProfileSetup = () => {
  const { user, loading, updateProfile } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  // Local step state, always starts at name for new user
  const [step, setStep] = useState<'name' | 'category' | 'wages' | 'complete'>('name');
  const [loadingStep, setLoadingStep] = useState(false);
  const [showWagesPopup, setShowWagesPopup] = useState(false);

  const form = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      categories: [],
      salaryBySubcategory: {},
    },
  });

  const handleNameSubmit = async (name: string) => {
    setLoadingStep(true);
    await updateProfile({ name });
    setLoadingStep(false);
    setStep('category');
  };

  const handleCategorySubmit = async (data: ProfileSetupFormValues) => {
    setLoadingStep(true);
    await updateProfile({ categories: data.categories });
    setLoadingStep(false);
    // For jobseekers, show the floating wages popup after category selection
    if (user?.role === 'jobseeker') {
      setShowWagesPopup(true);
    } else {
      setStep('complete');
      await updateProfile({ profileComplete: true });
      navigate('/home', { replace: true });
    }
  };

  const handleWagesPopupClose = async (wagesData) => {
    setShowWagesPopup(false);
    await updateProfile({ wages: wagesData || undefined });
    setStep('complete');
    await updateProfile({ profileComplete: true });
    navigate('/home', { replace: true });
  };

  const renderStep = () => {
    if (loadingStep) {
      return <ProfileLoading />;
    }
    switch(step) {
      case 'name':
        return <ProfileNameStep onSubmit={handleNameSubmit} initialName={user?.name || ''} />;
      case 'category':
        return (
          <ModernCategoryStep
            form={form as UseFormReturn<ProfileSetupFormValues>}
            onNext={() => {
              form.handleSubmit(handleCategorySubmit)();
              return Promise.resolve(true);
            }}
            userName={user?.name || ''}
          />
        );
      default:
        return <ProfileLoading />;
    }
  };

  if (loading) return <ProfileLoading />;
  if (!user) return <ProfileRedirect />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 px-4 py-6">
      <div className="w-full max-w-lg mx-auto">
        <FloatingCard variant="glow" size="sm" className="mb-6">
           <div className="flex items-center justify-center">
             <div className="flex items-center space-x-3">
               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center">
                 <BadgeCheck className="w-4 h-4 text-white" />
               </div>
               <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                 {t('profile.completeProfile', 'Complete Your Profile')}
               </span>
             </div>
           </div>
         </FloatingCard>
        <Form {...form}>
          <form>
            {renderStep()}
          </form>
        </Form>
        {/* Floating WagesPopup for jobseekers after category selection */}
        {showWagesPopup && (
          <WagesPopup
            categories={form.getValues('categories') || []}
            onClose={handleWagesPopupClose}
          />
        )}
      </div>
    </div>
  );
};

export default ProfileSetup;
