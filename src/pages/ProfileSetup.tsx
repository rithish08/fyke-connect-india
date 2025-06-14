
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import EnhancedCategoryStep from '@/components/profile/EnhancedCategoryStep';
import EnhancedSalaryStep from '@/components/profile/EnhancedSalaryStep';
import AvailabilityStep from '@/components/profile/AvailabilityStep';
import { BadgeCheck, ArrowLeft } from "lucide-react";

const STEPS = ["category", "salary", "availability"];
const STEP_TITLES = ["Choose Categories", "Set Salary Rates", "Availability"];

interface SalaryRates {
  daily: string;
  weekly: string;
  monthly: string;
}

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Enhanced form state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<{ [key: string]: string[] }>({});
  const [salaryRates, setSalaryRates] = useState<SalaryRates>({ daily: '', weekly: '', monthly: '' });
  const [availability, setAvailability] = useState<'available' | 'busy' | 'offline'>('available');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // Redirect employers to home since they don't need profile setup
    if (user?.role === 'employer') {
      navigate('/home');
    }
    if (user?.profileComplete) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleFinish = () => {
    // Prepare subcategories array for storage
    const allSubcategories = Object.values(selectedSubcategories).flat();
    
    updateProfile({
      categories: selectedCategories,
      primaryCategory: selectedCategories[0] || '',
      subcategories: allSubcategories,
      salaryRates: {
        daily: salaryRates.daily ? Number(salaryRates.daily) : undefined,
        weekly: salaryRates.weekly ? Number(salaryRates.weekly) : undefined,
        monthly: salaryRates.monthly ? Number(salaryRates.monthly) : undefined,
      },
      availability,
      profileComplete: true,
    });
    
    navigate('/home');
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate('/login');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-lg mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center hover:shadow-lg transition-shadow"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <BadgeCheck className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold text-gray-900">Profile Setup</span>
          </div>
          <div className="w-10 h-10"></div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600">
              Step {step + 1} of {STEPS.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((step + 1) / STEPS.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-semibold text-gray-900">{STEP_TITLES[step]}</h3>
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-6 shadow-xl rounded-3xl bg-white border-0">
          {step === 0 && (
            <EnhancedCategoryStep
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              setSelectedCategories={setSelectedCategories}
              setSelectedSubcategories={setSelectedSubcategories}
              onNext={() => setStep(step + 1)}
            />
          )}
          {step === 1 && (
            <EnhancedSalaryStep
              salaryRates={salaryRates}
              setSalaryRates={setSalaryRates}
              onNext={() => setStep(step + 1)}
              onBack={() => setStep(step - 1)}
            />
          )}
          {step === 2 && (
            <AvailabilityStep
              availability={availability}
              setAvailability={setAvailability}
              onBack={() => setStep(step - 1)}
              onFinish={handleFinish}
            />
          )}
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 px-4">
          Complete your profile to get verified and access better job opportunities
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
