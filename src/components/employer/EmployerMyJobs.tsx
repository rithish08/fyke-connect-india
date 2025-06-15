
import React, { useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, MapPin, Users, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EmployerMyJobs = () => {
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [jobPosts] = useState([
    {
      id: '1',
      title: 'Construction Worker',
      category: 'Construction',
      location: 'Andheri West, Mumbai',
      salary: '500/day',
      postedDate: '2 days ago',
      applications: 12,
      status: 'active',
      urgent: true
    },
    {
      id: '2',
      title: 'Plumber',
      category: 'Plumbing',
      location: 'Bandra East, Mumbai',
      salary: '600/day',
      postedDate: '5 days ago',
      applications: 8,
      status: 'active',
      urgent: false
    },
    {
      id: '3',
      title: 'Electrician',
      category: 'Electrical',
      location: 'Powai, Mumbai',
      salary: '700/day',
      postedDate: '1 week ago',
      applications: 15,
      status: 'closed',
      urgent: false
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
              <p className="text-gray-600 text-sm">{job.category}</p>
            </div>
            <Badge className={getStatusColor(job.status)}>
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
              <span>Posted {job.postedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{job.applications} applications</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {t('jobs.view_applications', 'View Applications')}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="w-4 h-4" />
              {t('jobs.edit', 'Edit')}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1 text-red-600 hover:text-red-700">
              <Trash2 className="w-4 h-4" />
              {t('jobs.delete', 'Delete')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('jobs.my_job_posts', 'My Job Posts')}
          </h1>
          <p className="text-gray-600">
            {t('jobs.manage_postings', 'Manage your job postings and applications')}
          </p>
        </div>
        <Button onClick={() => navigate('/post-job')} className="bg-green-600 hover:bg-green-700">
          {t('jobs.post_new', 'Post New Job')}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-green-600">
            {jobPosts.filter(job => job.status === 'active').length}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.active', 'Active')}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-blue-600">
            {jobPosts.reduce((total, job) => total + job.applications, 0)}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.total_applications', 'Total Applications')}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-lg font-bold text-gray-600">
            {jobPosts.filter(job => job.status === 'closed').length}
          </div>
          <div className="text-xs text-gray-600">{t('jobs.closed', 'Closed')}</div>
        </Card>
      </div>

      {/* Job Posts List */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">{t('jobs.all', 'All')}</TabsTrigger>
          <TabsTrigger value="active">{t('jobs.active', 'Active')}</TabsTrigger>
          <TabsTrigger value="closed">{t('jobs.closed', 'Closed')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {jobPosts.map(renderJobCard)}
        </TabsContent>
        
        <TabsContent value="active" className="mt-6">
          {jobPosts.filter(job => job.status === 'active').map(renderJobCard)}
        </TabsContent>
        
        <TabsContent value="closed" className="mt-6">
          {jobPosts.filter(job => job.status === 'closed').map(renderJobCard)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployerMyJobs;
