
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const EarningsPotential = () => {
  const { user } = useAuth();
  const [potentialEarnings, setPotentialEarnings] = useState(0);

  useEffect(() => {
    // Simulate dynamic earnings calculation
    const calculateEarnings = () => {
      const baseEarnings = 12000;
      const locationMultiplier = 1.2; // Based on user location
      const profileCompleteness = user?.profileComplete ? 1.5 : 1.0;
      const skillsMultiplier = 1.3; // Based on skills
      
      return Math.round(baseEarnings * locationMultiplier * profileCompleteness * skillsMultiplier);
    };

    setPotentialEarnings(calculateEarnings());
  }, [user]);

  if (user?.role !== 'jobseeker') return null;

  return (
    <Card className="mx-4 my-3 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-lg">Potential Earnings</h3>
          <p className="text-sm opacity-90">This month in your area</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">₹{potentialEarnings.toLocaleString()}</div>
          <p className="text-sm opacity-90">+15% from last month</p>
        </div>
      </div>
      
      <div className="mt-4 flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <p className="text-sm opacity-90">23 workers earned this much nearby</p>
      </div>
    </Card>
  );
};

export default EarningsPotential;
