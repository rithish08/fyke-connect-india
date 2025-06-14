import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BottomNavigation from '@/components/BottomNavigation';
import CommunicationButtons from '@/components/communication/CommunicationButtons';
import { useAuth } from '@/contexts/AuthContext';

const MyJobs = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applied');

  const appliedJobs = [
    {
      id: 1,
      title: 'Construction Worker',
      company: 'BuildPro Construction',
      employerId: 'emp-1',
      location: 'Mumbai',
      salary: '₹500-700/day',
      status: 'Interview Scheduled',
      appliedDate: '2 days ago'
    },
    {
      id: 2,
      title: 'Delivery Executive',
      company: 'QuickDelivery',
      employerId: 'emp-2',
      location: 'Pune',
      salary: '₹400-600/day',
      status: 'Under Review',
      appliedDate: '3 days ago'
    },
    {
      id: 3,
      title: 'Security Guard',
      company: 'SecureMax',
      employerId: 'emp-3',
      location: 'Chennai',
      salary: '₹450-550/day',
      status: 'Rejected',
      appliedDate: '1 week ago',
      rejectionReason: 'Experience requirement not met'
    }
  ];

  const postedJobs = [
    {
      id: 1,
      title: 'Construction Worker needed',
      location: 'Mumbai',
      salary: '₹500-700/day',
      applications: 12,
      status: 'Active',
      postedDate: '2 days ago',
      urgency: 'High',
      applicants: [
        { id: 'worker-1', name: 'Raj Kumar' },
        { id: 'worker-2', name: 'Amit Singh' }
      ]
    },
    {
      id: 2,
      title: 'Office Cleaner',
      location: 'Bangalore',
      salary: '₹300-400/day',
      applications: 8,
      status: 'Filled',
      postedDate: '1 week ago',
      applicants: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'interview scheduled':
      case 'hired':
        return 'bg-green-100 text-green-700';
      case 'under review':
      case 'active':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'filled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const JobSeekerView = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="applied">Applied</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="applied" className="space-y-4 mt-6">
        {appliedJobs.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">📍 {job.location}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{job.salary}</div>
                  <Badge className={`text-xs mt-1 ${getStatusColor(job.status)}`}>
                    {job.status}
                  </Badge>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Applied {job.appliedDate}
              </div>

              {job.rejectionReason && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">ℹ️</span>
                    <span className="text-sm text-red-800">
                      {job.rejectionReason}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <CommunicationButtons
                  targetId={job.employerId}
                  targetName={job.company}
                  targetType="employer"
                  size="sm"
                />
              </div>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="saved" className="space-y-4 mt-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">💾</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Jobs</h3>
          <p className="text-gray-600 mb-4">Save jobs you're interested in to view them here</p>
          <Button>Browse Jobs</Button>
        </div>
      </TabsContent>

      <TabsContent value="history" className="space-y-4 mt-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Work History</h3>
          <p className="text-gray-600">Your completed jobs will appear here</p>
        </div>
      </TabsContent>
    </Tabs>
  );

  const EmployerView = () => (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="active">Active Posts</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="hired">Hired</TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="space-y-4 mt-6">
        {postedJobs.map((job) => (
          <Card key={job.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {job.urgency === 'High' && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">📍 {job.location}</p>
                  <p className="text-sm text-green-600 font-medium">{job.salary}</p>
                </div>
                <Badge className={`text-xs ${getStatusColor(job.status)}`}>
                  {job.status}
                </Badge>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Posted {job.postedDate}</span>
                <span>{job.applications} applications</span>
              </div>

              {/* Show recent applicants with communication options */}
              {job.applicants.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Recent Applicants</h4>
                  <div className="space-y-2">
                    {job.applicants.slice(0, 2).map((applicant) => (
                      <div key={applicant.id} className="flex items-center justify-between">
                        <span className="text-sm text-blue-800">{applicant.name}</span>
                        <CommunicationButtons
                          targetId={applicant.id}
                          targetName={applicant.name}
                          targetType="worker"
                          size="sm"
                          className="scale-90"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-2 border-t">
                <Button variant="outline" size="sm">
                  View Applications
                </Button>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600">
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="applications" className="space-y-4 mt-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Applications</h3>
          <p className="text-gray-600">Review and respond to job applications</p>
        </div>
      </TabsContent>

      <TabsContent value="hired" className="space-y-4 mt-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Hired Workers</h3>
          <p className="text-gray-600">View and manage your hired workers</p>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">
          {user?.role === 'employer' ? 'My Job Posts' : 'My Jobs'}
        </h1>
        <p className="text-sm text-gray-500">
          {user?.role === 'employer' 
            ? 'Manage your job postings and applications' 
            : 'Track your applications and job history'
          }
        </p>
      </div>

      <div className="p-4">
        {user?.role === 'employer' ? <EmployerView /> : <JobSeekerView />}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default MyJobs;
