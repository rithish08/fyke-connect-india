
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import AnimatedWrapper from './AnimatedWrapper';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();
  const { t } = useLocalization();

  if (!user) return null;

  const currentRole = user.role;
  const isJobSeeker = currentRole === 'jobseeker';

  return (
    <AnimatedWrapper variant="slide" direction="down" delay={100}>
      <Card className="mx-4 my-3 p-4 bg-gradient-to-r from-blue-50 via-white to-green-50 border-0 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              isJobSeeker ? 'bg-blue-500' : 'bg-green-500'
            }`} />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Current Mode:
              </span>
              <div className={`mt-1 px-3 py-1 rounded-full text-sm font-bold transition-all duration-300 ${
                isJobSeeker 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                {isJobSeeker ? 'Job Seeker' : 'Employer'}
              </div>
            </div>
          </div>
          
          <Button
            onClick={switchRole}
            variant="outline"
            size="sm"
            className={`transition-all duration-300 hover:scale-105 font-medium ${
              isJobSeeker
                ? 'border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700'
                : 'border-blue-300 hover:bg-blue-50 hover:border-blue-400 text-blue-700'
            }`}
          >
            <span className="text-lg mr-2">
              {isJobSeeker ? '🏢' : '🔍'}
            </span>
            Switch to {isJobSeeker ? 'Employer' : 'Job Seeker'}
          </Button>
        </div>
      </Card>
    </AnimatedWrapper>
  );
};

export default RoleSwitcher;
