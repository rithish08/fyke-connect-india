import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const currentRole = user.role;
  const isJobSeeker = currentRole === 'jobseeker';

  return (
    <Card className="mx-4 my-3 p-4 bg-white border shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isJobSeeker ? 'bg-blue-500' : 'bg-green-500'
          }`} />
          <div>
            <span className="text-sm font-medium text-gray-600">
              You are a:
            </span>
            <div className={`mt-1 px-3 py-1 rounded-full text-sm font-bold ${
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
          className={`font-medium hover:scale-105 transition-transform duration-200 ${
            isJobSeeker
              ? 'border-green-300 hover:bg-green-50 text-green-700'
              : 'border-blue-300 hover:bg-blue-50 text-blue-700'
          }`}
        >
          <span className="text-lg mr-2">
            {isJobSeeker ? '🏢' : '🔍'}
          </span>
          Switch to {isJobSeeker ? 'Employer' : 'Job Seeker'}
        </Button>
      </div>
    </Card>
  );
};

export default RoleSwitcher;
