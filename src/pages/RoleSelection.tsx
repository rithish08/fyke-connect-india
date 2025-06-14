
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState<'jobseeker' | 'employer' | null>(null);
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white text-xl font-bold">F</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Path</h1>
            <p className="text-gray-600">Select how you want to use Fyke</p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4">
          <Card
            className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === 'jobseeker'
                ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedRole('jobseeker')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Job Seeker</h3>
                <p className="text-gray-600 text-sm">Find work opportunities and build your career</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Find Jobs</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Apply Instantly</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">Track Progress</span>
                </div>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer transition-all duration-200 border-2 ${
              selectedRole === 'employer'
                ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
            onClick={() => setSelectedRole('employer')}
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Employer</h3>
                <p className="text-gray-600 text-sm">Hire skilled workers and manage projects</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Post Jobs</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Find Workers</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">Hire Fast</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-medium py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          Continue
        </Button>

        <div className="text-center text-sm text-gray-500">
          You can switch roles anytime later in the app
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
