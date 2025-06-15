
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, MapPin, DollarSign, Clock, AlertCircle, Zap } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import BottomNavigation from '@/components/BottomNavigation';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useGlobalToast();
  const [activeTab, setActiveTab] = useState('quick');
  
  const [formData, setFormData] = useState({
    title: '',
    company: user?.name || '',
    category: '',
    location: user?.location || '',
    description: '',
    requirements: '',
    salary: '',
    salaryPeriod: 'day',
    hiringType: 'full-time',
    urgent: false,
    contactPhone: '',
    contactEmail: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 
    'Driver', 'Cooking', 'Gardening', 'Beauty'
  ];

  const hiringTypes = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'gig', label: 'Gig/One-time' },
    { value: 'temporary', label: 'Temporary' }
  ];

  const quickPostTemplates = [
    {
      title: 'Construction Worker Needed',
      category: 'Construction',
      description: 'Looking for experienced construction worker for residential project.',
      salary: '500',
      hiringType: 'full-time'
    },
    {
      title: 'Delivery Partner',
      category: 'Delivery',
      description: 'Need reliable delivery partner with own vehicle.',
      salary: '300',
      hiringType: 'gig'
    },
    {
      title: 'House Cleaning',
      category: 'Cleaning',
      description: 'Regular house cleaning service required.',
      salary: '250',
      hiringType: 'part-time'
    }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleQuickPost = (template: any) => {
    setFormData(prev => ({
      ...prev,
      ...template,
      company: user?.name || '',
      location: user?.location || ''
    }));
    setActiveTab('detailed');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.category || !formData.description || !formData.salary) {
      showError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob = {
        id: `job-${Date.now()}`,
        ...formData,
        postedTime: 'Just now',
        employerId: user?.id || 'current-user',
        postedDate: new Date().toISOString(),
        type: formData.hiringType
      };

      const existingJobs = JSON.parse(localStorage.getItem('fyke_posted_jobs') || '[]');
      existingJobs.push(newJob);
      localStorage.setItem('fyke_posted_jobs', JSON.stringify(existingJobs));

      showSuccess('Job posted successfully!');
      navigate('/my-jobs');
    } catch (error) {
      showError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only employers can post jobs</p>
          <Button onClick={() => navigate('/home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Post a Job</h1>
            <p className="text-sm text-gray-500">Find the right workers for your job</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick" className="flex items-center space-x-2">
              <Zap className="w-4 h-4" />
              <span>Quick Post</span>
            </TabsTrigger>
            <TabsTrigger value="detailed">Detailed Post</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Job Templates</h2>
              <div className="space-y-3">
                {quickPostTemplates.map((template, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer" onClick={() => handleQuickPost(template)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{template.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          <span>₹{template.salary}/day</span>
                          <span>{template.hiringType}</span>
                        </div>
                      </div>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="detailed">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Job Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Construction Worker, Delivery Partner"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="hiringType">Hiring Type *</Label>
                      <Select value={formData.hiringType} onValueChange={(value) => handleInputChange('hiringType', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {hiringTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="Job location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Job Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the job responsibilities, working conditions, and any specific requirements..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea
                      id="requirements"
                      placeholder="List the skills, experience, or qualifications needed..."
                      rows={3}
                      value={formData.requirements}
                      onChange={(e) => handleInputChange('requirements', e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              {/* Salary Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Compensation</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="salary">Salary Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="salary"
                        type="number"
                        placeholder="Amount"
                        value={formData.salary}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="salaryPeriod">Payment Period</Label>
                    <Select value={formData.salaryPeriod} onValueChange={(value) => handleInputChange('salaryPeriod', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hour">Per Hour</SelectItem>
                        <SelectItem value="day">Per Day</SelectItem>
                        <SelectItem value="week">Per Week</SelectItem>
                        <SelectItem value="month">Per Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>

              {/* Contact & Options */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Contact & Options</h2>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contactPhone">Contact Phone</Label>
                    <Input
                      id="contactPhone"
                      placeholder="Your contact number"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="urgent"
                      checked={formData.urgent}
                      onCheckedChange={(checked) => handleInputChange('urgent', checked)}
                    />
                    <Label htmlFor="urgent" className="flex items-center space-x-2">
                      <span>Mark as Urgent</span>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    </Label>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
                <div className="max-w-2xl mx-auto">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? 'Posting Job...' : 'Post Job'}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PostJob;
