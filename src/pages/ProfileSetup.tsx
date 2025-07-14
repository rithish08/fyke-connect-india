import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Form } from '@/components/ui/form';
import { ArrowLeft, BadgeCheck } from "lucide-react";
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ModernCategoryStep from '@/components/profile/ModernCategoryStep';
import ModernMultiSalaryStep from '@/components/profile/ModernMultiSalaryStep';
import { FloatingCard } from '@/components/ui/floating-card';
import ProfileLoading from '@/components/profile/setup/ProfileLoading';
import ProfileRedirect from '@/components/profile/setup/ProfileRedirect';
import ProfileNameStep from '@/components/profile/setup/ProfileNameStep';
import { useLocalization } from '@/contexts/LocalizationContext';

// Define a schema for the multi-step form
const profileSetupSchema = z.object({
  name: z.string().optional(),
  selectedCategories: z.array(z.string()).optional(),
  salaryBySubcategory: z.record(z.object({
    amount: z.string(),
    period: z.string(),
  })).optional(),
});

type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

const ProfileSetup = () => {
  const { user, loading, updateProfile } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const form = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      selectedCategories: user?.categories || [],
      salaryBySubcategory: user?.wages ? Object.fromEntries(
        Object.entries(user.wages).map(([key, value]) => [
          key, 
          { amount: String(value.rate || ''), period: value.unit || 'hour' }
        ])
      ) : {},
    },
  });

  const getCurrentStep = useMemo(() => {
    if (!user) return 'loading';
    if (!user.name) return 'name';
    if (user.role === 'employer') return 'complete'; // Employers only need a name
    if (!user.categories || user.categories.length === 0) return 'category';
    if (!user.wages) return 'wages';
    return 'complete';
  }, [user]);

  const [currentStep, setCurrentStep] = useState(getCurrentStep);
  
  useEffect(() => {
    setCurrentStep(getCurrentStep);
  }, [getCurrentStep]);
  

  const handleNameSubmit = async (name: string) => {
    await updateProfile({ name });
    // The RouteGuard will handle redirection
  };

  const handleCategorySubmit = async (data: ProfileSetupFormValues) => {
    await updateProfile({ categories: data.selectedCategories });
  };

  const handleWagesSubmit = async (data: ProfileSetupFormValues) => {
    const wagesData = data.salaryBySubcategory ? Object.fromEntries(
      Object.entries(data.salaryBySubcategory).map(([key, value]) => [
        key,
        { rate: value.amount, unit: value.period }
      ])
    ) : {};
    await updateProfile({ wages: wagesData });
  };
  
  const renderStep = () => {
    switch(currentStep) {
      case 'name':
        return <ProfileNameStep onSubmit={handleNameSubmit} initialName={user?.name || ''} />;
      case 'category':
        return (
          <ModernCategoryStep
            form={form as any}
            onNext={() => {
              form.handleSubmit(handleCategorySubmit)();
              return Promise.resolve(true);
            }}
            userName={user?.name || ''}
          />
        );
      case 'wages':
        return (
          <ModernMultiSalaryStep
            form={form as any}
            onNext={async () => {
              const isValid = await form.trigger();
              if (isValid) {
                await handleWagesSubmit(form.getValues());
                return true;
              }
              return false;
            }}
            onBack={() => setCurrentStep('category')}
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
      </div>
    </div>
  );
};

export default ProfileSetup;
