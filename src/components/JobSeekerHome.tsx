
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Star, TrendingUp } from 'lucide-react';
import JobCard from './JobCard';
import { mockJobs } from '@/data/mockData';

const JobSeekerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    // Load recommended jobs based on user's categories
    const allJobs = Object.values(mockJobs).flat();
    const filtered = allJobs.slice(0, 5); // Show top 5 jobs
    setRecommendedJobs(filtered);

    // Load user applications from localStorage
    const storedApplications = JSON.parse(localStorage.getItem('fyke_applications') || '[]');
    setApplications(storedApplications);
  }, [user]);

  const handleJobApply = (jobId: string) => {
    const job = recommendedJobs.find(j => j.id === jobId);
    if (!job) return;

    const newApplication = {
      id: Date.now().toString(),
      jobId,
      jobTitle: job.title,
      company: job.company,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };

    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('fyke_applications', JSON.stringify(updatedApplications));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const profileCompletionPercentage = () => {
    let percentage = 20; // Base for having account
    if (user?.name) percentage += 20;
    if (user?.categories?.length) percentage += 30;
    if (user?.salaryBySubcategory) percentage += 20;
    if (user?.availability) percentage += 10;
    return percentage;
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.name || 'Job Seeker'}! 👋
        </h1>
        <p className="text-blue-100">Ready to find your next opportunity?</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/search')}
          className="h-20 bg-white border-2 border-blue-100 text-gray-900 hover:bg-blue-50"
        >
          <div className="text-center">
            <Search className="w-6 h-6 mx-auto mb-1 text-blue-600" />
            <span className="text-sm font-medium">Find Jobs</span>
          </div>
        </Button>
        <Button 
          onClick={() => navigate('/my-jobs')}
          className="h-20 bg-white border-2 border-green-100 text-gray-900 hover:bg-green-50"
        >
          <div className="text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-1 text-green-600" />
            <span className="text-sm font-medium">My Applications</span>
          </div>
        </Button>
      </div>

      {/* Profile Completion */}
      {profileCompletionPercentage() < 100 && (
        <Card className="p-4 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
              <p className="text-sm text-gray-600">Get more job recommendations</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-orange-600">{profileCompletionPercentage()}%</div>
              <Button 
                size="sm" 
                onClick={() => navigate('/profile')}
                className="mt-1 bg-orange-600 hover:bg-orange-700"
              >
                Complete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Application Status */}
      {applications.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Applications</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-500">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'interview').length}
              </div>
              <div className="text-xs text-gray-500">Interview</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-600">
                {applications.length}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </Card>
      )}

      {/* Recommended Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/search')}
          >
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {recommendedJobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onApply={handleJobApply}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Your Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
            <div className="text-sm text-gray-500">Applications Sent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {user?.availability === 'available' ? 'Available' : 'Busy'}
            </div>
            <div className="text-sm text-gray-500">Current Status</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default JobSeekerHome;
