
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Briefcase, MessageCircle, TrendingUp } from 'lucide-react';
import { mockJobs } from '@/data/mockData';

const EmployerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postedJobs, setPostedJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    // Load posted jobs from localStorage or mock data
    const storedJobs = JSON.parse(localStorage.getItem('fyke_posted_jobs') || '[]');
    if (storedJobs.length > 0) {
      setPostedJobs(storedJobs);
    } else {
      // Use mock data for demo
      const employerJobs = Object.values(mockJobs).flat().slice(0, 3);
      setPostedJobs(employerJobs);
    }

    // Load applications for employer's jobs
    const allApplications = JSON.parse(localStorage.getItem('fyke_applications') || '[]');
    setApplications(allApplications);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTotalApplications = () => {
    return applications.filter(app => 
      postedJobs.some(job => job.id === app.jobId)
    ).length;
  };

  const getActiveJobs = () => {
    return postedJobs.filter(job => job.status !== 'closed').length;
  };

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          {getGreeting()}, {user?.name || 'Employer'}! 🏢
        </h1>
        <p className="text-green-100">Manage your hiring and find great talent</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => navigate('/post-job')}
          className="h-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
        >
          <div className="text-center">
            <Plus className="w-6 h-6 mx-auto mb-1" />
            <span className="text-sm font-medium">Post New Job</span>
          </div>
        </Button>
        <Button 
          onClick={() => navigate('/search')}
          className="h-20 bg-white border-2 border-green-100 text-gray-900 hover:bg-green-50"
        >
          <div className="text-center">
            <Users className="w-6 h-6 mx-auto mb-1 text-green-600" />
            <span className="text-sm font-medium">Find Workers</span>
          </div>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{getActiveJobs()}</div>
          <div className="text-sm text-gray-500">Active Jobs</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{getTotalApplications()}</div>
          <div className="text-sm text-gray-500">Applications</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {applications.filter(app => app.status === 'interview').length}
          </div>
          <div className="text-sm text-gray-500">Interviews</div>
        </Card>
      </div>

      {/* Recent Applications */}
      {applications.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Applications</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/my-jobs')}
            >
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {applications.slice(0, 3).map((application) => (
              <div key={application.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">{application.jobTitle}</div>
                  <div className="text-sm text-gray-500">Applied {new Date(application.appliedAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{application.status}</Badge>
                  <Button size="sm" variant="outline">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Posted Jobs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Your Job Posts</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/my-jobs')}
          >
            Manage All
          </Button>
        </div>
        
        <div className="space-y-4">
          {postedJobs.slice(0, 3).map((job) => (
            <Card key={job.id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
                    <span className="flex items-center space-x-1">
                      <Briefcase className="w-3 h-3" />
                      <span>{job.category || 'General'}</span>
                    </span>
                    <span>Posted {job.postedTime || 'recently'}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={job.urgent ? "destructive" : "secondary"} className="text-xs">
                      {job.urgent ? 'Urgent' : 'Regular'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {applications.filter(app => app.jobId === job.id).length} applications
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">₹{job.salary}</div>
                  <div className="text-xs text-gray-500">per {job.salaryPeriod || 'day'}</div>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-3 border-t border-gray-100">
                <Button size="sm" variant="outline" onClick={() => navigate(`/job/${job.id}`)}>
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  Edit Job
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  Close Job
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Hiring Tips */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <h3 className="font-semibold text-gray-900 mb-2">💡 Hiring Tip</h3>
        <p className="text-sm text-gray-600 mb-3">
          Jobs with clear descriptions and competitive wages get 3x more applications!
        </p>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => navigate('/post-job')}
        >
          Create Better Job Post
        </Button>
      </Card>
    </div>
  );
};

export default EmployerHome;
