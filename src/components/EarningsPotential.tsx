
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
      <ModernCard variant="elevated" className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h3 className="font-bold text-lg">Potential Earnings</h3>
              <p className="text-green-100 text-sm">This month in your area</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">₹{potentialEarnings.toLocaleString()}</div>
            <p className="text-green-100 text-sm">+15% from last month</p>
          </div>
        </div>
        
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <p className="text-sm text-green-100">23 workers earned this much nearby</p>
        </div>
      </ModernCard>
    </AnimatedWrapper>
  );
};

export default EarningsPotential;
