
import { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedWrapper from './AnimatedWrapper';

const EarningsPotential = () => {
  const { user } = useAuth();
  const [potentialEarnings, setPotentialEarnings] = useState(0);

  useEffect(() => {
    const calculateEarnings = () => {
      const baseEarnings = 12000;
      const locationMultiplier = 1.2;
      const profileCompleteness = user?.profileComplete ? 1.5 : 1.0;
      const skillsMultiplier = 1.3;
      return Math.round(baseEarnings * locationMultiplier * profileCompleteness * skillsMultiplier);
    };
    setPotentialEarnings(calculateEarnings());
  }, [user]);

  if (user?.role !== 'jobseeker') return null;

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={100}>
      <ModernCard className="bg-white border shadow rounded-2xl px-6 py-4 flex flex-col items-center text-center">
        <span className="text-2xl font-semibold text-gray-900 mb-1">Potential Monthly Earnings</span>
        <span className="text-4xl font-bold text-green-600 mb-2">
          ₹{potentialEarnings.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">Based on your profile and skills</span>
      </ModernCard>
    </AnimatedWrapper>
  );
};

export default EarningsPotential;
