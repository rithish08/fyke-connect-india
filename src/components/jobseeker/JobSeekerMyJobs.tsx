
import React, { useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, CheckCircle, XCircle, User } from 'lucide-react';

const JobSeekerMyJobs = () => {
  const { t } = useLocalization();
  const [applications] = useState([
    {
      id: '1',
      title: 'Construction Worker',
      company: 'BuildRight Construction',
      location: 'Andheri West, Mumbai',
      salary: '500/day',
      appliedDate: '2 days ago',
      status: 'pending',
      urgent: true
    },
    {
      id: '2',
      title: 'Plumber Helper',
      company: 'Home Services Pro',
      location: 'Bandra East, Mumbai',
      salary: '400/day',
      appliedDate: '5 days ago',
      status: 'interview',
      urgent: false
    },
    {
      id: '3',
      title: 'Delivery Boy',
      company: 'Quick Delivery Co',
      location: 'Powai, Mumbai',
      salary: '300/day',
      appliedDate: '1 week ago',
      status: 'rejected',
      urgent: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'interview': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'interview': return <User className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const renderJobCard = (job: any) => (
    <Card key={job.id} className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900">{job.title}</h3>
                {job.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    {t('jobs.urgent', 'Urgent')}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm flex items-center gap-1">
                <User className="w-4 h-4" />
                {job.company}
              </p>
            </div>
            <Badge className={`${getStatusColor(job.status)} flex items-center gap-1`}>
              {getStatusIcon(job.status)}
              <span className="capitalize">{job.status}</span>
            </Badge>
          </div>

          {/* Details */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium text-gray-900">₹{job.salary}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Applied {job.appliedDate}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              {t('jobs.view_details', 'View Details')}
            </Button>
            {job.status === 'interview' && (
              <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                {t('jobs.schedule_interview', 'Schedule Interview')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">
          {t('jobs.my_applications', 'My Job Applications')}
        </h1>
        <p className="text-gray-600">
          {t('jobs.track_applications', 'Track your job applications and responses')}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {applications.filter(app => app.status === 'pending').length}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.pending', 'Pending')}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {applications.filter(app => app.status === 'interview').length}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.interviews', 'Interviews')}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-purple-600">
            {applications.filter(app => app.status === 'accepted').length}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.accepted', 'Accepted')}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-red-600">
            {applications.filter(app => app.status === 'rejected').length}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.rejected', 'Rejected')}</div>
        </Card>
      </div>

      {/* Applications List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">{t('jobs.all', 'All')}</TabsTrigger>
          <TabsTrigger value="pending">{t('jobs.pending', 'Pending')}</TabsTrigger>
          <TabsTrigger value="interview">{t('jobs.interviews', 'Interviews')}</TabsTrigger>
          <TabsTrigger value="completed">{t('jobs.completed', 'Completed')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {applications.map(renderJobCard)}
        </TabsContent>
        
        <TabsContent value="pending" className="mt-6">
          {applications.filter(app => app.status === 'pending').map(renderJobCard)}
        </TabsContent>
        
        <TabsContent value="interview" className="mt-6">
          {applications.filter(app => app.status === 'interview').map(renderJobCard)}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-6">
          {applications.filter(app => ['accepted', 'rejected'].includes(app.status)).map(renderJobCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobSeekerMyJobs;
