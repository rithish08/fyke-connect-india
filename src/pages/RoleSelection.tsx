import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Check } from 'lucide-react';

const roles = [
  {
    id: 'jobseeker',
    title: 'Job Seeker',
    description: 'Looking for work opportunities',
    icon: Users,
    gradient: 'from-blue-500 to-blue-600'
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Hiring workers for jobs',
    icon: Briefcase,
    gradient: 'from-purple-500 to-purple-600'
  }
];
const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selectedRole) return;
    try {
      await setRole(selectedRole as 'jobseeker' | 'employer');
      if (selectedRole === 'jobseeker') {
        navigate('/profile-setup');
      } else {
        navigate('/home');
      }
    } catch (error) {
      alert('Failed to set role. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col px-2 py-6">
      <div className="flex-1 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full space-y-6 sm:space-y-8">
          <div className="text-center space-y-4">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-xl sm:text-3xl font-bold text-white">F</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">What brings you here?</h1>
              <p className="text-gray-600 text-base">Choose your role to get started</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <ModernCard
                  key={role.id}
                  variant={isSelected ? 'active' : 'selection'}
                  className={`cursor-pointer p-4 sm:p-6 transition-all duration-200 rounded-xl sm:rounded-2xl ${
                    isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base sm:text-lg text-gray-900">{role.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm">{role.description}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </div>
                </ModernCard>
              );
            })}
          </div>
          <div className="pt-2 sm:pt-4">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              className="w-full h-12 sm:h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              aria-label="Continue with selected role"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RoleSelection;
