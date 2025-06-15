import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Shield, 
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data states
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [verificationRequests, setVerificationRequests] = useState([]);
  const [reports, setReports] = useState([]);
  
  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobs: 0,
    totalApplications: 0,
    pendingVerifications: 0
  });

  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') {
      navigate('/admin');
      return;
    }
    fetchAllData();
  }, [userProfile, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUsers(),
        fetchJobs(),
        fetchApplications(),
        fetchMessages(),
        fetchVerificationRequests(),
        fetchReports(),
        fetchStats()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data || []);
    }
  };

  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        profiles:employer_id(name, email),
        categories(name),
        subcategories(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching jobs:', error);
    } else {
      setJobs(data || []);
    }
  };

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs(title),
        profiles:applicant_id(name, email)
      `)
      .order('applied_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching applications:', error);
    } else {
      setApplications(data || []);
    }
  };

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('conversation_messages')
      .select(`
        *,
        profiles:sender_id(name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
  };

  const fetchVerificationRequests = async () => {
    const { data, error } = await supabase
      .from('verification_requests')
      .select(`
        *,
        profiles:user_id(name, email)
      `)
      .order('submitted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching verification requests:', error);
    } else {
      setVerificationRequests(data || []);
    }
  };

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        reporter:profiles!reporter_id(name, email),
        reported_user:profiles!reported_user_id(name, email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching reports:', error);
    } else {
      setReports(data || []);
    }
  };

  const fetchStats = async () => {
    try {
      const [usersCount, jobsCount, applicationsCount, verificationsCount] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact' }),
        supabase.from('jobs').select('id', { count: 'exact' }),
        supabase.from('applications').select('id', { count: 'exact' }),
        supabase.from('verification_requests').select('id', { count: 'exact' }).eq('status', 'pending')
      ]);

      setStats({
        totalUsers: usersCount.count || 0,
        totalJobs: jobsCount.count || 0,
        totalApplications: applicationsCount.count || 0,
        pendingVerifications: verificationsCount.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateJobStatus = async (jobId: string, status: 'active' | 'filled' | 'expired' | 'draft') => {
    const { error } = await supabase
      .from('jobs')
      .update({ status })
      .eq('id', jobId);

    if (error) {
      toast.error('Error updating job status');
    } else {
      toast.success('Job status updated');
      fetchJobs();
    }
  };

  const updateVerificationStatus = async (requestId: string, status: 'pending' | 'verified' | 'rejected') => {
    const { error } = await supabase
      .from('verification_requests')
      .update({ 
        status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: userProfile?.id
      })
      .eq('id', requestId);

    if (error) {
      toast.error('Error updating verification status');
    } else {
      toast.success('Verification status updated');
      fetchVerificationRequests();
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (error) {
      toast.error('Error deleting user');
    } else {
      toast.success('User deleted');
      fetchUsers();
    }
  };

  const exportData = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your Fyke platform</p>
          </div>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button onClick={signOut} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalJobs}</p>
                </div>
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Applications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalApplications}</p>
                </div>
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingVerifications}</p>
                </div>
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Users Management</CardTitle>
                <Button onClick={() => exportData(users, 'users')} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Name</th>
                        <th className="text-left p-4">Email</th>
                        <th className="text-left p-4">Role</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Joined</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user: any) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">{user.name || 'N/A'}</td>
                          <td className="p-4">{user.email || 'N/A'}</td>
                          <td className="p-4">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'default'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.verified ? 'default' : 'secondary'}>
                              {user.verified ? 'Verified' : 'Unverified'}
                            </Badge>
                          </td>
                          <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
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

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Jobs Management</CardTitle>
                <Button onClick={() => exportData(jobs, 'jobs')} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Title</th>
                        <th className="text-left p-4">Employer</th>
                        <th className="text-left p-4">Category</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Posted</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job: any) => (
                        <tr key={job.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">{job.title}</td>
                          <td className="p-4">{job.profiles?.name || 'N/A'}</td>
                          <td className="p-4">{job.categories?.name || 'N/A'}</td>
                          <td className="p-4">
                            <select
                              value={job.status}
                              onChange={(e) => updateJobStatus(job.id, e.target.value as any)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="active">Active</option>
                              <option value="filled">Filled</option>
                              <option value="expired">Expired</option>
                              <option value="draft">Draft</option>
                            </select>
                          </td>
                          <td className="p-4">{new Date(job.posted_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
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

          {/* Verifications Tab */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <CardTitle>Verification Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">User</th>
                        <th className="text-left p-4">Document Type</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Submitted</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verificationRequests.map((request: any) => (
                        <tr key={request.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">{request.profiles?.name || 'N/A'}</td>
                          <td className="p-4">{request.document_type}</td>
                          <td className="p-4">
                            <select
                              value={request.status}
                              onChange={(e) => updateVerificationStatus(request.id, e.target.value as any)}
                              className="px-2 py-1 border rounded"
                            >
                              <option value="pending">Pending</option>
                              <option value="verified">Verified</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="p-4">{new Date(request.submitted_at).toLocaleDateString()}</td>
                          <td className="p-4">
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

          {/* Other tabs... */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Applications data will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Messages data will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Reports data will be displayed here...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
