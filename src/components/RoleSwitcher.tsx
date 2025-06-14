
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const RoleSwitcher = () => {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  return (
    <Card className="p-3 m-4 bg-gradient-to-r from-blue-50 to-green-50 border-0 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">
            Current Mode:
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            user.role === 'jobseeker' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-green-100 text-green-700'
          }`}>
            {user.role === 'jobseeker' ? 'Job Seeker' : 'Employer'}
          </span>
        </div>
        
        <Button
          onClick={switchRole}
          variant="outline"
          size="sm"
          className="text-xs px-3 py-1 h-auto border-gray-300 hover:bg-gray-50"
        >
          Switch to {user.role === 'jobseeker' ? 'Employer' : 'Job Seeker'}
        </Button>
      </div>
    </Card>
  );
};

export default RoleSwitcher;
