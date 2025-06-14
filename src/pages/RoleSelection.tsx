
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <AnimatedWrapper variant="slide" direction="down" delay={100}>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl">
              <span className="text-white text-2xl font-bold">F</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Fyke</h1>
              <p className="text-gray-600 text-lg">How would you like to use Fyke today?</p>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Role Selection Cards */}
        <div className="space-y-6">
          {roles.map((role, index) => (
            <AnimatedWrapper key={role.type} variant="slide" direction="up" delay={300 + index * 200}>
              <Card
                className={`p-6 cursor-pointer transition-all duration-500 border-2 overflow-hidden relative group ${
                  selectedRole === role.type
                    ? `border-${role.color}-500 bg-${role.color}-50 shadow-2xl scale-105 ring-4 ring-${role.color}-200`
                    : hoveredRole === role.type
                    ? `border-${role.color}-300 shadow-xl scale-102`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
                onClick={() => setSelectedRole(role.type)}
                onMouseEnter={() => setHoveredRole(role.type)}
                onMouseLeave={() => setHoveredRole(null)}
              >
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 text-6xl opacity-10 transform rotate-12 transition-transform duration-500 ${
                  selectedRole === role.type ? 'scale-110' : ''
                }`}>
                  {role.bgImage}
                </div>
                
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 transition-opacity duration-500 ${
                  selectedRole === role.type ? 'opacity-10' : hoveredRole === role.type ? 'opacity-5' : ''
                }`} />
                
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-${role.color}-100 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        selectedRole === role.type ? 'scale-110 shadow-lg' : ''
                      }`}>
                        <span className="text-3xl">{role.icon}</span>
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
                        <p className={`text-sm font-semibold text-${role.color}-600`}>{role.subtitle}</p>
                      </div>
                    </div>
                    
                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                      selectedRole === role.type
                        ? `bg-${role.color}-500 border-${role.color}-500 scale-110`
                        : 'border-gray-300'
                    }`}>
                      {selectedRole === role.type && (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">{role.description}</p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {role.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1.5 bg-${role.color}-100 text-${role.color}-700 rounded-full text-sm font-medium transition-all duration-300 ${
                          selectedRole === role.type ? 'scale-105' : ''
                        }`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className={`text-xs text-${role.color}-600 font-medium`}>
                    📊 {role.stats}
                  </div>
                  
                  {/* Success Story */}
                  <div className={`bg-${role.color}-50 p-3 rounded-lg border border-${role.color}-100`}>
                    <p className={`text-sm text-${role.color}-800 font-medium`}>
                      ✨ {role.successStory}
                    </p>
                  </div>
                </div>
              </Card>
            </AnimatedWrapper>
          ))}
        </div>

        <AnimatedWrapper variant="slide" direction="up" delay={800}>
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className={`w-full font-medium py-4 rounded-2xl shadow-lg transition-all duration-300 text-lg ${
              selectedRole
                ? 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 hover:scale-105 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {selectedRole ? 'Continue as ' + (selectedRole === 'jobseeker' ? 'Job Seeker' : 'Employer') : 'Select your role to continue'}
          </Button>
        </AnimatedWrapper>

        <AnimatedWrapper variant="fade" delay={1000}>
          <div className="text-center text-sm text-gray-500">
            You can switch roles anytime later in the app
          </div>
        </AnimatedWrapper>
      </div>
    </div>
  );
};

export default RoleSelection;
