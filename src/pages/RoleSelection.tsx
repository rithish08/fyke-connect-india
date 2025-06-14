import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
  const [hoveredRole, setHoveredRole] = useState<'jobseeker' | 'employer' | null>(null);
  const { setRole } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      navigate('/login');
    }
  };

  const roles = [
    {
      type: 'jobseeker' as const,
      icon: '🔍',
      title: 'I am looking for work',
      subtitle: 'Job Seeker',
      description: 'Find opportunities, apply instantly, and start earning',
      features: ['Find Jobs Nearby', 'Apply Instantly', 'Track Applications', 'Get Hired Fast'],
      successStory: 'Raj found 5 jobs this week and earned ₹12,000',
      bgImage: '🏗️', // Construction worker illustration
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      stats: '50,000+ jobs posted daily'
    },
    {
      type: 'employer' as const,
      icon: '🏢',
      title: 'I want to hire workers',
      subtitle: 'Employer',
      description: 'Post jobs, find skilled workers, and grow your business',
      features: ['Post Jobs Free', 'Find Verified Workers', 'Hire in Minutes', 'Manage Your Team'],
      successStory: 'Priya hired 3 workers in 2 hours for her restaurant',
      bgImage: '👥', // Team illustration
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      stats: '2 lakh+ verified workers'
    }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white shadow flex items-center justify-center mx-auto border border-gray-100">
            <span className="text-2xl font-bold text-gray-800">F</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Fyke</h1>
            <p className="text-gray-600 text-base">How would you like to use Fyke today?</p>
          </div>
        </div>

        <div className="space-y-6">
          {roles.map((role) => (
            <Card
              key={role.type}
              className={`p-6 cursor-pointer border-2 transition-all duration-300 bg-white relative ${
                selectedRole === role.type
                  ? 'border-gray-700 shadow-xl scale-105'
                  : hoveredRole === role.type
                  ? 'border-gray-400 shadow'
                  : 'border-gray-100 hover:border-gray-300'
              }`}
              onClick={() => setSelectedRole(role.type)}
              onMouseEnter={() => setHoveredRole(role.type)}
              onMouseLeave={() => setHoveredRole(null)}
            >
              <div className="absolute top-0 right-0 text-5xl opacity-10 pointer-events-none">
                {role.bgImage}
              </div>
              <div className="relative space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-50">
                    <span className="text-3xl">{role.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                    <p className="text-sm font-semibold text-gray-600">{role.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{role.description}</p>
                <div className="flex flex-wrap gap-2">
                  {role.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-900 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-gray-500 font-medium">📊 {role.stats}</div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <p className="text-sm text-gray-700 font-medium">
                    ✨ {role.successStory}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className={`w-full font-medium py-4 rounded-2xl shadow transition-all duration-200 text-lg ${
            selectedRole
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {selectedRole ? 'Continue as ' + (selectedRole === 'jobseeker' ? 'Job Seeker' : 'Employer') : 'Select your role to continue'}
        </Button>
        <div className="text-center text-xs text-gray-400 mt-2">
          You can switch roles anytime later in the app
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
