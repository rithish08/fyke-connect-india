
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Shield, 
  AlertTriangle,
  Settings,
  LogOut,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { signOut, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingVerifications: 0,
    activeReports: 0
  });

  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [reports, setReports] = useState([]);
  const [verifications, setVerifications] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchJobs(),
        fetchApplications(),
        fetchReports(),
        fetchVerifications()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const [usersCount, jobsCount, applicationsCount, verificationsCount, reportsCount] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('jobs').select('*', { count: 'exact', head: true }),
      supabase.from('applications').select('*', { count: 'exact', head: true }),
      supabase.from('verification_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending')
    ]);

    setStats({
      totalUsers: usersCount.count || 0,
      totalJobs: jobsCount.count || 0,
      totalApplications: applicationsCount.count || 0,
      pendingVerifications: verificationsCount.count || 0,
      activeReports: reportsCount.count || 0
    });
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
      return;
    }
    setUsers(data || []);
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles:employer_id (name, email),
        categories (name),
        subcategories (name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching jobs:', error);
      return;
    }
    setJobs(data || []);
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (title),
        profiles:applicant_id (name, email)
      `)
      .order('applied_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
      return;
    }
    setApplications(data || []);
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        profiles:reporter_id (name, email),
        reported_profiles:reported_user_id (name, email),
        jobs:reported_job_id (title)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reports:', error);
      return;
    }
    setReports(data || []);
  };

  const fetchVerifications = async () => {
    const { data, error } = await supabase
      .from('verification_requests')
      .select(`
        *,
        profiles:user_id (name, email)
      `)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching verifications:', error);
      return;
    }
    setVerifications(data || []);
  };

  const updateUserStatus = async (userId: string, updates: any) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      toast.error('Error updating user');
      return;
    }

    toast.success('User updated successfully');
    fetchUsers();
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId);

    if (error) {
      toast.error('Error updating job');
      return;
    }

    toast.success('Job updated successfully');
    fetchJobs();
  };

  const updateVerificationStatus = async (verificationId: string, status: string, adminNotes?: string) => {
    const { error } = await supabase
      .from('verification_requests')
      .update({ 
        status, 
        admin_notes: adminNotes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: userProfile?.id
      })
      .eq('id', verificationId);

    if (error) {
      toast.error('Error updating verification');
      return;
    }

    toast.success('Verification updated successfully');
    fetchVerifications();
    fetchStats();
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      verified: 'bg-blue-100 text-blue-800',
      filled: 'bg-purple-100 text-purple-800',
      expired: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Fyke Platform Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {userProfile?.name}</span>
              <Button onClick={signOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Briefcase className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingVerifications}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeReports}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                        <StatusBadge status={user.role} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobs.slice(0, 5).map((job: any) => (
                      <div key={job.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-600">{job.location}</p>
                        </div>
                        <StatusBadge status={job.status} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage all platform users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Name</th>
                        <th className="text-left p-2">Email</th>
                        <th className="text-left p-2">Role</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Created</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users
                        .filter((user: any) => 
                          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((user: any) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">
                            <StatusBadge status={user.role} />
                          </td>
                          <td className="p-2">
                            <StatusBadge status={user.verified ? 'verified' : 'pending'} />
                          </td>
                          <td className="p-2">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateUserStatus(user.id, { verified: !user.verified })}
                              >
                                {user.verified ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>Manage all job postings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Title</th>
                        <th className="text-left p-2">Employer</th>
                        <th className="text-left p-2">Category</th>
                        <th className="text-left p-2">Location</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Posted</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job: any) => (
                        <tr key={job.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{job.title}</td>
                          <td className="p-2">{job.profiles?.name}</td>
                          <td className="p-2">{job.categories?.name}</td>
                          <td className="p-2">{job.location}</td>
                          <td className="p-2">
                            <StatusBadge status={job.status} />
                          </td>
                          <td className="p-2">
                            {new Date(job.posted_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Select onValueChange={(value) => updateJobStatus(job.id, value)}>
                                <SelectTrigger className="w-24">
                                  <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="active">Active</SelectItem>
                                  <SelectItem value="filled">Filled</SelectItem>
                                  <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="verifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Requests</CardTitle>
                <CardDescription>Review user verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verifications.map((verification: any) => (
                    <div key={verification.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{verification.profiles?.name}</h3>
                          <p className="text-sm text-gray-600">{verification.profiles?.email}</p>
                          <p className="text-sm text-gray-600">Document Type: {verification.document_type}</p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(verification.submitted_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={verification.status} />
                          {verification.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Approve Verification</DialogTitle>
                                    <DialogDescription>
                                      Approve this verification request?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea placeholder="Admin notes (optional)" />
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        onClick={() => updateVerificationStatus(verification.id, 'verified')}
                                      >
                                        Approve
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <XCircle className="w-4 h-4 text-red-600" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Reject Verification</DialogTitle>
                                    <DialogDescription>
                                      Reject this verification request?
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Textarea placeholder="Reason for rejection" />
                                    <div className="flex justify-end space-x-2">
                                      <Button 
                                        variant="destructive"
                                        onClick={() => updateVerificationStatus(verification.id, 'rejected')}
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>Monitor all job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Applicant</th>
                        <th className="text-left p-2">Job Title</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Applied Date</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((application: any) => (
                        <tr key={application.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <p className="font-medium">{application.profiles?.name}</p>
                              <p className="text-sm text-gray-600">{application.profiles?.email}</p>
                            </div>
                          </td>
                          <td className="p-2">{application.jobs?.title}</td>
                          <td className="p-2">
                            <StatusBadge status={application.status} />
                          </td>
                          <td className="p-2">
                            {new Date(application.applied_at).toLocaleDateString()}
                          </td>
                          <td className="p-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Flags</CardTitle>
                <CardDescription>Manage reported content and users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reports.map((report: any) => (
                    <div key={report.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">Report: {report.reason}</h3>
                          <p className="text-sm text-gray-600">
                            Reporter: {report.profiles?.name} ({report.profiles?.email})
                          </p>
                          {report.reported_profiles && (
                            <p className="text-sm text-gray-600">
                              Reported User: {report.reported_profiles.name}
                            </p>
                          )}
                          {report.jobs && (
                            <p className="text-sm text-gray-600">
                              Reported Job: {report.jobs.title}
                            </p>
                          )}
                          <p className="text-sm text-gray-500 mt-2">{report.description}</p>
                          <p className="text-xs text-gray-500">
                            Reported: {new Date(report.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <StatusBadge status={report.status} />
                          {report.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                Review
                              </Button>
                              <Button size="sm" variant="destructive">
                                Take Action
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
