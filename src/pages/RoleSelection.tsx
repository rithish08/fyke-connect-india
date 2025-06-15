
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, Briefcase, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { updateProfile, user } = useAuth();
  const { t } = useLocalization();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const roles = [
    {
      id: 'jobseeker' as const,
      title: t('role.jobseeker', 'Job Seeker'),
      description: t('role.jobseeker_desc', 'Find work opportunities near you'),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 'employer' as const,
      title: t('role.employer', 'Employer'),
      description: t('role.employer_desc', 'Hire skilled workers for your business'),
      icon: Briefcase,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    }
  ];

  const handleRoleSelect = (role: 'jobseeker' | 'employer') => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      await updateProfile({ role: selectedRole });
      
      toast({
        title: t('role.selected', 'Role Selected'),
        description: t('role.success', `You are now registered as a ${selectedRole}`)
      });

      if (selectedRole === 'jobseeker') {
        navigate('/profile-setup');
      } else {
        navigate('/home');
      }
    } catch (error) {
      toast({
        title: t('role.error', 'Error'),
        description: t('role.error_desc', 'Failed to update role. Please try again.'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <button
                onClick={() => navigate('/login')}
                className="absolute left-4 top-4 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('role.title', 'How will you use fyke?')}
            </h1>
            <p className="text-gray-600">
              {t('role.subtitle', 'Choose your role to get started')}
            </p>
          </div>

          {/* Role Options */}
          <div className="space-y-4">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              
              return (
                <Card
                  key={role.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                    isSelected
                      ? 'border-blue-500 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-xl ${role.bgColor} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${role.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{role.title}</h3>
                        <p className="text-gray-600 text-sm">{role.description}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                      }`}>
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={!selectedRole || isLoading}
            className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? (
              t('role.updating', 'Setting up...')
            ) : (
              <>
                {t('role.continue', 'Continue')}
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
