
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, Eye, MessageSquare, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface JobPosting {
  id: string;
  title: string;
  location: string;
  salary: string;
  applicants: number;
  views: number;
  status: 'active' | 'paused' | 'filled';
  postedDate: Date;
  urgent?: boolean;
}

const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    title: 'Delivery Partner',
    location: 'Bangalore, KA',
    salary: '₹15,000 - ₹25,000/month',
    applicants: 12,
    views: 45,
    status: 'active',
    postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    urgent: true
  },
  {
    id: '2',
    title: 'Office Assistant',
    location: 'Mumbai, MH',
    salary: '₹18,000 - ₹22,000/month',
    applicants: 8,
    views: 28,
    status: 'active',
    postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Security Guard',
    location: 'Delhi, DL',
    salary: '₹16,000 - ₹20,000/month',
    applicants: 23,
    views: 67,
    status: 'filled',
    postedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
  }
];

const EmployerDashboard = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>(mockJobPostings);
  const { userProfile } = useAuth();

  const activeJobs = jobPostings.filter(job => job.status === 'active').length;
  const totalApplicants = jobPostings.reduce((sum, job) => sum + job.applicants, 0);
  const totalViews = jobPostings.reduce((sum, job) => sum + job.views, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      case 'filled': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {userProfile?.name || 'Employer'}!
          </h1>
          <p className="text-blue-100">Manage your job postings and find the perfect candidates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{activeJobs}</p>
                <p className="text-sm text-gray-600">Active Jobs</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalApplicants}</p>
                <p className="text-sm text-gray-600">Total Applicants</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{totalViews}</p>
                <p className="text-sm text-gray-600">Total Views</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">5</p>
                <p className="text-sm text-gray-600">Messages</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center gap-2">
              <Plus className="w-6 h-6" />
              <span>Post New Job</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              <span>View Candidates</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="w-6 h-6" />
              <span>Messages</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Eye className="w-6 h-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </Card>

        {/* Job Postings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Your Job Postings</h2>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Button>
          </div>

          <div className="space-y-4">
            {jobPostings.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{job.title}</h3>
                      {job.urgent && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{job.location} • {job.salary}</p>
                    <p className="text-gray-500 text-xs mt-1">Posted {formatDate(job.postedDate)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{job.applicants} applicants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{job.views} views</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button size="sm">Manage</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {jobPostings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings yet</h3>
              <p className="text-gray-600 mb-4">Create your first job posting to start hiring</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EmployerDashboard;
