
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileStep {
  id: string;
  title: string;
  description: string;
  benefit: string;
  completed: boolean;
  icon: string;
}

const ProfileProgress = () => {
  const { user } = useAuth();

  const profileSteps: ProfileStep[] = [
    {
      id: 'name',
      title: 'Add Your Name',
      description: 'Help employers know who you are',
      benefit: 'Increases trust by 60%',
      completed: !!user?.name,
      icon: '👤'
    },
    {
      id: 'photo',
      title: 'Upload Photo',
      description: 'Show your friendly face',
      benefit: 'Increases hire chances by 70%',
      completed: false,
      icon: '📸'
    },
    {
      id: 'skills',
      title: 'List Your Skills',
      description: 'Show what you can do',
      benefit: 'Get 3x more job matches',
      completed: false,
      icon: '🛠️'
    },
    {
      id: 'location',
      title: 'Set Location',
      description: 'Find nearby opportunities',
      benefit: 'See jobs within 5km',
      completed: false,
      icon: '📍'
    }
  ];

  const completedSteps = profileSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / profileSteps.length) * 100;

  if (progressPercentage === 100) return null;

  return (
    <Card className="mx-4 my-3 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Complete Your Profile</h3>
            <p className="text-sm text-gray-600">{completedSteps} of {profileSteps.length} completed</p>
          </div>
          <div className="text-2xl">🚀</div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Next Steps */}
        <div className="space-y-2">
          {profileSteps
            .filter(step => !step.completed)
            .slice(0, 2)
            .map((step) => (
              <div key={step.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{step.icon}</span>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{step.title}</p>
                    <p className="text-xs text-green-600">{step.benefit}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50">
                  Add
                </Button>
              </div>
            ))}
        </div>
      </div>
    </Card>
  );
};

export default ProfileProgress;
