import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProfileCategoryStep from '@/components/profile/ProfileCategoryStep';
import SkillSelectionStep from '@/components/profile/SkillSelectionStep';
import SalaryStep from '@/components/profile/SalaryStep';
import AvailabilityStep from '@/components/profile/AvailabilityStep';
import { BadgeCheck } from "lucide-react";

const STEPS = ["category", "skills", "salary", "availability"];

const ProfileSetup = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  // Form state
  const [category, setCategory] = useState(user?.primaryCategory || '');
  const [vehicle, setVehicle] = useState(''); // For drivers
  const [skills, setSkills] = useState<string[]>([]);
  const [salary, setSalary] = useState<{ amount: string; period: 'daily' | 'weekly' | 'monthly' }>({ amount: '', period: 'daily' });
  const [availability, setAvailability] = useState<'available' | 'busy' | 'offline'>('available');

  if (!user) {
    navigate('/login');
    return null;
  }

  // Collect all and save on finish
  const handleFinish = () => {
    updateProfile({
      category,
      categories: user?.categories, // keep overall categories
      primaryCategory: category,
      vehicle: category === "Driver" ? vehicle : undefined,
      skills,
      salaryExpectation: { min: Number(salary.amount), max: Number(salary.amount) },
      salaryPeriod: salary.period,
      availability,
      profileComplete: true,
    });
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-lg px-3 pt-8 pb-8 space-y-7">
        {/* Gamified header with badge */}
        <div className="flex items-center justify-center space-x-2 mb-1">
          <BadgeCheck className="w-6 h-6 text-green-500" />
          <span className="text-xl font-bold text-gray-900">Profile Setup</span>
        </div>
        <Card className="p-6 shadow-lg rounded-2xl space-y-7">
          {/* StepStepper */}
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((st, idx) => (
              <div className="flex-1 flex flex-col items-center" key={st}>
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1
                  ${idx < step ? "bg-green-100 border-green-500 text-green-700" : idx === step ? "border-indigo-500 text-indigo-800 bg-indigo-50"
                  : "border-gray-200 text-gray-300 bg-gray-50"}`}>
                  {idx < step ? <span className="text-lg font-bold">✓</span> : idx+1}
                </div>
                <span className="text-[10px] text-gray-400 font-medium">{st}</span>
              </div>
            ))}
          </div>
          {/* Step Content */}
          {step === 0 && (
            <ProfileCategoryStep
              category={category}
              setCategory={setCategory}
              vehicle={vehicle}
              setVehicle={setVehicle}
              role={user.role}
              onNext={() => setStep(step+1)}
            />
          )}
          {step === 1 && (
            <SkillSelectionStep
              skills={skills}
              setSkills={setSkills}
              category={category}
              onNext={() => setStep(step+1)}
              onBack={() => setStep(step-1)}
            />
          )}
          {step === 2 && (
            <SalaryStep
              salary={salary}
              setSalary={setSalary}
              onNext={() => setStep(step+1)}
              onBack={() => setStep(step-1)}
            />
          )}
          {step === 3 && (
            <AvailabilityStep
              availability={availability}
              setAvailability={setAvailability}
              onBack={() => setStep(step-1)}
              onFinish={handleFinish}
            />
          )}
        </Card>
        <div className="text-center text-xs text-gray-400 mt-1">
          Build trust: Complete your profile to get a <span className="text-green-700 font-semibold">Verified</span> badge and better job matching.
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
