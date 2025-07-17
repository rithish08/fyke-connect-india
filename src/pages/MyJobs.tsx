
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, MapPin, Clock, User, Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';
import { mockJobs } from '@/data/mockData';

const MyJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [applications, setApplications] = useState<any[]>([]);
  const [hireRequests, setHireRequests] = useState<any[]>([]);

  const isEmployer = user?.role === 'employer';

  useEffect(() => {
    // Load applications and hire requests from localStorage
    const storedApplications = JSON.parse(localStorage.getItem('fyke_applications') || '[]');
    const storedHireRequests = JSON.parse(localStorage.getItem('fyke_hire_requests') || '[]');
    
    setApplications(storedApplications);
    setHireRequests(storedHireRequests);
  }, []);

  // Mock data based on user role
  const jobsData = isEmployer ? {
    active: Object.values(mockJobs).flat().slice(0, 3),
    completed: Object.values(mockJobs).flat().slice(3, 5),
    draft: Object.values(mockJobs).flat().slice(5, 6)
  } : {
    applied: applications.map(app => {
      const allJobs = Object.values(mockJobs).flat();
      const job = allJobs.find(j => j.id === app.jobId);
      return job ? { ...job, applicationStatus: app.status, appliedAt: app.appliedAt } : null;
    }).filter(Boolean),
    active: Object.values(mockJobs).flat().slice(4, 6),
    completed: Object.values(mockJobs).flat().slice(6, 8)
  };

  const JobCard = ({ job, showActions = true }: { job: any; showActions?: boolean }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-1">{job.title || 'Job Title'}</h3>
          <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
            <span className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{job.company || 'Company'}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{job.location || 'Location'}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={job.urgent ? "destructive" : "secondary"} className="text-xs">
              {job.urgent ? 'Urgent' : 'Regular'}
            </Badge>
            <Badge variant="outline" className="text-xs">{job.category || 'General'}</Badge>
            {job.applicationStatus && (
              <Badge variant="outline" className="text-xs">
                {job.applicationStatus}
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-bold text-green-600">₹{job.salary || '0'}</div>
          <div className="text-xs text-gray-500">per {job.salaryPeriod || 'day'}</div>
        </div>
      </div>
      
      {showActions && (
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500 flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Posted {job.postedTime || 'recently'}</span>
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigate(`/job/${job.id}`)}>
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            {isEmployer && (
              <>
                <Button variant="outline" size="sm">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEmployer ? 'My Job Posts' : 'My Applications'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEmployer ? 'Manage your job postings' : 'Track your job applications'}
            </p>
          </div>
          {isEmployer && (
            <Button onClick={() => navigate('/post-job')} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              {t('my_jobs.post_job_btn', 'Post Job')}
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${isEmployer ? 'grid-cols-3' : 'grid-cols-3'}`}>
            {isEmployer ? (
              <>
                <TabsTrigger value="active">Active ({jobsData.active?.length || 0})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({jobsData.completed?.length || 0})</TabsTrigger>
                <TabsTrigger value="draft">Draft ({jobsData.draft?.length || 0})</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="applied">Applied ({jobsData.applied?.length || 0})</TabsTrigger>
                <TabsTrigger value="active">Active ({jobsData.active?.length || 0})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({jobsData.completed?.length || 0})</TabsTrigger>
              </>
            )}
          </TabsList>

          {Object.entries(jobsData).map(([key, jobs]) => (
            <TabsContent key={key} value={key} className="space-y-4 mt-6">
              {jobs && jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <JobCard key={job?.id || index} job={job} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No {key} jobs
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isEmployer 
                      ? `You don't have any ${key} job posts yet.`
                      : `You haven't ${key === 'applied' ? 'applied to' : key} any jobs yet.`
                    }
                  </p>
                  {isEmployer && key === 'active' && (
                    <Button onClick={() => navigate('/post-job')}>
                      Post Your First Job
                    </Button>
                  )}
                  {!isEmployer && key === 'applied' && (
                    <Button onClick={() => navigate('/search')}>
                      Browse Jobs
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyJobs;
