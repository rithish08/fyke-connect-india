
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FloatingCard } from '@/components/ui/floating-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, DollarSign, Users, Eye, Edit, Briefcase, Calendar } from 'lucide-react';
import BottomNavigation from '@/components/BottomNavigation';
import StickyHeader from '@/components/layout/StickyHeader';

interface JobPost {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  postedAt: string;
  status: 'active' | 'paused' | 'closed';
  applicants: number;
  urgent: boolean;
}

interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: 'applied' | 'interview' | 'rejected' | 'accepted';
  location: string;
  salary: string;
}

const MyJobs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const isEmployer = user?.role === 'employer';

  useEffect(() => {
    if (isEmployer) {
      // Load job posts from localStorage
      const storedJobs = JSON.parse(localStorage.getItem('userJobs') || '[]');
      setJobPosts(storedJobs);
    } else {
      // Load mock applications for job seekers
      setApplications([
        {
          id: '1',
          jobTitle: 'Construction Worker',
          company: 'BuildPro Construction',
          appliedAt: '2025-06-14',
          status: 'interview',
          location: 'Mumbai, Maharashtra',
          salary: '₹500/day'
        },
        {
          id: '2',
          jobTitle: 'Delivery Driver',
          company: 'Quick Delivery Services',
          appliedAt: '2025-06-13',
          status: 'applied',
          location: 'Delhi, India',
          salary: '₹400/day'
        },
        {
          id: '3',
          jobTitle: 'House Cleaning',
          company: 'CleanHome Services',
          appliedAt: '2025-06-12',
          status: 'rejected',
          location: 'Bangalore, Karnataka',
          salary: '₹300/day'
        }
      ]);
    }
  }, [isEmployer]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'paused':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/job/${jobId}`);
  };

  const handleViewApplicants = (jobId: string) => {
    // TODO: Navigate to applicants page
    console.log('Viewing applicants for job:', jobId);
  };

  const handleEditJob = (jobId: string) => {
    // TODO: Navigate to edit job page
    console.log('Editing job:', jobId);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <StickyHeader currentTime={currentTime} />
      
      <div className="max-w-2xl mx-auto p-4 pb-20">
        <Tabs defaultValue={isEmployer ? "active" : "applied"} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {isEmployer ? (
              <>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="applicants">Applications</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="applied">Applied</TabsTrigger>
                <TabsTrigger value="saved">Saved</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </>
            )}
          </TabsList>

          {isEmployer ? (
            // Employer Views
            <>
              <TabsContent value="active" className="space-y-4">
                {jobPosts.length === 0 ? (
                  <FloatingCard variant="minimal" size="md" className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No active job posts</h3>
                    <p className="text-gray-600 mb-4">Create your first job posting to find candidates</p>
                    <Button onClick={() => navigate('/post-job')}>
                      <Briefcase className="w-4 h-4 mr-2" />
                      Post a Job
                    </Button>
                  </FloatingCard>
                ) : (
                  jobPosts
                    .filter(job => job.status === 'active')
                    .map((job) => (
                      <FloatingCard key={job.id} variant="elevated" size="md">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                                {job.urgent && (
                                  <Badge variant="destructive" className="text-xs">URGENT</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{job.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {job.location}
                                </span>
                                <span className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  ₹{job.salary}/{job.salaryPeriod}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {formatDate(job.postedAt)}
                                </span>
                              </div>
                            </div>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <span className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              {job.applicants} applicants
                            </span>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleViewApplicants(job.id)}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditJob(job.id)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      </FloatingCard>
                    ))
                )}
              </TabsContent>

              <TabsContent value="applicants" className="space-y-4">
                <FloatingCard variant="minimal" size="md" className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                  <p className="text-gray-600">Applications will appear here when job seekers apply to your posts</p>
                </FloatingCard>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <FloatingCard variant="minimal" size="md" className="text-center py-8">
                  <div className="text-4xl mb-4">📅</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No scheduled interviews</h3>
                  <p className="text-gray-600">Your interview schedule will appear here</p>
                </FloatingCard>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <FloatingCard variant="minimal" size="md" className="text-center py-8">
                  <div className="text-4xl mb-4">📚</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No job history</h3>
                  <p className="text-gray-600">Completed and closed jobs will appear here</p>
                </FloatingCard>
              </TabsContent>
            </>
          ) : (
            // Job Seeker Views
            <>
              <TabsContent value="applied" className="space-y-4">
                {applications.map((application) => (
                  <FloatingCard key={application.id} variant="elevated" size="md">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
                          <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {application.location}
                            </span>
                            <span className="flex items-center">
                              <DollarSign className="w-3 h-3 mr-1" />
                              {application.salary}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                      </div>
                      
                      <div className="flex justify-end pt-3 border-t border-gray-100">
                        <Button variant="outline" size="sm" onClick={() => handleViewJob(application.id)}>
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </FloatingCard>
                ))}
              </TabsContent>

              <TabsContent value="saved" className="space-y-4">
                <FloatingCard variant="minimal" size="md" className="text-center py-8">
                  <div className="text-4xl mb-4">💾</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved jobs</h3>
                  <p className="text-gray-600">Jobs you save will appear here</p>
                </FloatingCard>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                {applications
                  .filter(app => app.status === 'interview')
                  .map((application) => (
                    <FloatingCard key={application.id} variant="elevated" size="md">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Interview Scheduled
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Interview
                          </Badge>
                        </div>
                      </div>
                    </FloatingCard>
                  ))}
                {applications.filter(app => app.status === 'interview').length === 0 && (
                  <FloatingCard variant="minimal" size="md" className="text-center py-8">
                    <div className="text-4xl mb-4">📅</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No scheduled interviews</h3>
                    <p className="text-gray-600">Your interview schedule will appear here</p>
                  </FloatingCard>
                )}
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                {applications
                  .filter(app => ['accepted', 'rejected'].includes(app.status))
                  .map((application) => (
                    <FloatingCard key={application.id} variant="elevated" size="md">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{application.jobTitle}</h3>
                            <p className="text-sm text-gray-600 mb-2">{application.company}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                Applied {formatDate(application.appliedAt)}
                              </span>
                            </div>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                    </FloatingCard>
                  ))}
                {applications.filter(app => ['accepted', 'rejected'].includes(app.status)).length === 0 && (
                  <FloatingCard variant="minimal" size="md" className="text-center py-8">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No application history</h3>
                    <p className="text-gray-600">Completed applications will appear here</p>
                  </FloatingCard>
                )}
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default MyJobs;
