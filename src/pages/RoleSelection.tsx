
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import AnimatedWrapper from '@/components/AnimatedWrapper';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
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
      title: t('role.jobseeker'),
      description: t('role.jobseeker_desc'),
      features: ['Find Jobs', 'Apply Instantly', 'Track Progress', 'Get Hired'],
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      type: 'employer' as const,
      icon: '🏢',
      title: t('role.employer'),
      description: t('role.employer_desc'),
      features: ['Post Jobs', 'Find Workers', 'Hire Fast', 'Manage Team'],
      color: 'green',
      gradient: 'from-green-500 to-green-600'
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('role.title')}</h1>
              <p className="text-gray-600 text-lg">{t('role.subtitle')}</p>
            </div>
          </div>
        </AnimatedWrapper>

        {/* Role Selection Cards */}
        <div className="space-y-6">
          {roles.map((role, index) => (
            <AnimatedWrapper key={role.type} variant="slide" direction="up" delay={300 + index * 200}>
              <Card
                className={`p-8 cursor-pointer transition-all duration-300 border-2 overflow-hidden relative ${
                  selectedRole === role.type
                    ? `border-${role.color}-500 bg-${role.color}-50 shadow-2xl scale-105`
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-xl hover:scale-102'
                }`}
                onClick={() => setSelectedRole(role.type)}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-5 transition-opacity duration-300 ${
                  selectedRole === role.type ? 'opacity-10' : ''
                }`} />
                
                <div className="relative flex items-start space-x-6">
                  <div className={`w-16 h-16 bg-${role.color}-100 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                    selectedRole === role.type ? 'scale-110' : ''
                  }`}>
                    <span className="text-3xl">{role.icon}</span>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                      <p className="text-gray-700 text-lg leading-relaxed">{role.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {role.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1.5 bg-${role.color}-100 text-${role.color}-700 rounded-full text-sm font-medium transition-colors duration-300`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Selection indicator */}
                  <div className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                    selectedRole === role.type
                      ? `bg-${role.color}-500 border-${role.color}-500`
                      : 'border-gray-300'
                  }`}>
                    {selectedRole === role.type && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
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
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-lg disabled:scale-100"
          >
            {t('common.continue')}
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
