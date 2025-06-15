
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Clock, MapPin, Building2, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '@/components/BottomNavigation';

const ApplicationTracking = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');

  const applications = [
    {
      id: 1,
      jobTitle: 'Construction Worker',
      company: 'BuildPro Construction',
      location: 'Mumbai, Maharashtra',
      appliedDate: '2 days ago',
      status: 'under_review',
      salary: '500-700/day',
      lastUpdate: '1 day ago',
      statusMessage: 'Your application is being reviewed by the employer'
    },
    {
      id: 2,
      jobTitle: 'Delivery Executive',
      company: 'QuickDelivery Services',
      location: 'Pune, Maharashtra',
      appliedDate: '5 days ago',
      status: 'interview_scheduled',
      salary: '400-600/day',
      lastUpdate: '3 hours ago',
      statusMessage: 'Interview scheduled for tomorrow at 2:00 PM',
      interviewDate: 'Tomorrow, 2:00 PM'
    },
    {
      id: 3,
      jobTitle: 'Warehouse Helper',
      company: 'LogiCorp India',
      location: 'Mumbai, Maharashtra',
      appliedDate: '1 week ago',
      status: 'accepted',
      salary: '450/day',
      lastUpdate: '2 days ago',
      statusMessage: 'Congratulations! You have been selected for this position',
      startDate: 'Monday, 9:00 AM'
    },
    {
      id: 4,
      jobTitle: 'Security Guard',
      company: 'SecureMax Solutions',
      location: 'Thane, Maharashtra',
      appliedDate: '2 weeks ago',
      status: 'rejected',
      salary: '350-450/day',
      lastUpdate: '1 week ago',
      statusMessage: 'Thank you for your interest. We have selected another candidate.'
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'under_review':
        return { color: 'bg-yellow-100 text-yellow-700', label: 'Under Review', icon: '📋' };
      case 'interview_scheduled':
        return { color: 'bg-blue-100 text-blue-700', label: 'Interview Scheduled', icon: '📅' };
      case 'accepted':
        return { color: 'bg-green-100 text-green-700', label: 'Accepted', icon: '✅' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-700', label: 'Not Selected', icon: '❌' };
      default:
        return { color: 'bg-gray-100 text-gray-700', label: 'Unknown', icon: '❓' };
    }
  };

  const getApplicationsByStatus = (status: string) => {
    switch (status) {
      case 'active':
        return applications.filter(app => ['under_review', 'interview_scheduled'].includes(app.status));
      case 'completed':
        return applications.filter(app => ['accepted', 'rejected'].includes(app.status));
      default:
        return applications;
    }
  };

  const ApplicationCard = ({ application }: { application: any }) => {
    const statusInfo = getStatusInfo(application.status);
    
    return (
      <Card className="p-4 mb-3 border border-gray-200">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg mb-1">{application.jobTitle}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Building2 className="w-4 h-4" />
                <span>{application.company}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{application.location}</span>
                <span>•</span>
                <span>₹{application.salary}</span>
              </div>
            </div>
            <Badge className={statusInfo.color}>
              <span className="mr-1">{statusInfo.icon}</span>
              {statusInfo.label}
            </Badge>
          </div>

          {/* Status Message */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">{application.statusMessage}</p>
            {application.interviewDate && (
              <p className="text-sm font-medium text-blue-600 mt-1">📅 {application.interviewDate}</p>
            )}
            {application.startDate && (
              <p className="text-sm font-medium text-green-600 mt-1">🚀 Start Date: {application.startDate}</p>
            )}
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              Applied {application.appliedDate}
            </span>
            <span>Last update: {application.lastUpdate}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate(`/job/${application.id}`)}
            >
              View Job
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
              onClick={() => navigate('/messages')}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="flex items-center px-4 py-3 border-b border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="p-2 mr-3 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">My Applications</h1>
            <p className="text-sm text-gray-500">Track your job applications</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="active">Active ({getApplicationsByStatus('active').length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({getApplicationsByStatus('completed').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {getApplicationsByStatus('active').length > 0 ? (
              getApplicationsByStatus('active').map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Applications</h3>
                <p className="text-gray-600 mb-4">Start applying to jobs to track your applications here</p>
                <Button onClick={() => navigate('/search')}>
                  Find Jobs
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {getApplicationsByStatus('completed').length > 0 ? (
              getApplicationsByStatus('completed').map((application) => (
                <ApplicationCard key={application.id} application={application} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">📝</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Completed Applications</h3>
                <p className="text-gray-600">Completed applications will appear here</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ApplicationTracking;
