import { useState, useEffect } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedWrapper from './AnimatedWrapper';
const EarningsPotential = () => {
  const {
    user
  } = useAuth();
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
  return <AnimatedWrapper variant="slide" direction="up" delay={100}>
      
    </AnimatedWrapper>;
};
export default EarningsPotential;