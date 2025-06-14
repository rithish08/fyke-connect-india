import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ModernCard } from '@/components/ui/modern-card';
import BottomNavigation from '@/components/BottomNavigation';
import CommunicationButtons from '@/components/communication/CommunicationButtons';
import { Building2, User } from 'lucide-react';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    requirements: '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    salaryPeriod: 'daily' as 'daily' | 'weekly' | 'monthly',
    jobType: 'full-time',
    urgency: false,
    contactPhone: '',
    contactEmail: '',
    businessType: 'personal' as 'personal' | 'commercial'
  });

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Warehouse', 
    'Manufacturing', 'Driver', 'Cook', 'Helper', 'Maintenance'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job posted:', formData);
    alert('Job posted successfully!');
    navigate('/my-jobs');
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user || user.role !== 'employer') {
    navigate('/home');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/home')}
            className="p-2"
          >
            ←
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Post New Job</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type Selection */}
          <ModernCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Business Type</h2>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant={formData.businessType === 'personal' ? 'default' : 'outline'}
                onClick={() => handleInputChange('businessType', 'personal')}
                className="flex-1 flex items-center space-x-2 h-12"
              >
                <User className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Personal</div>
                  <div className="text-xs opacity-70">Home repairs, personal tasks</div>
                </div>
              </Button>
              <Button
                type="button"
                variant={formData.businessType === 'commercial' ? 'default' : 'outline'}
                onClick={() => handleInputChange('businessType', 'commercial')}
                className="flex-1 flex items-center space-x-2 h-12"
              >
                <Building2 className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Commercial</div>
                  <div className="text-xs opacity-70">Business projects, contracts</div>
                </div>
              </Button>
            </div>
          </ModernCard>

          {/* Job Details */}
          <ModernCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="space-y-4">
              <Input
                placeholder="Job Title (e.g., Construction Worker Needed)"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
              
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                required
              />

              <Textarea
                placeholder="Requirements & Skills Needed"
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={2}
              />
            </div>
          </ModernCard>

          {/* Location & Salary */}
          <ModernCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Location & Pay</h2>
            <div className="space-y-4">
              <Input
                placeholder="Job Location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                required
              />
              
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  placeholder="Min Salary (₹)"
                  value={formData.salaryMin}
                  onChange={(e) => handleInputChange('salaryMin', e.target.value)}
                  required
                />
                <Input
                  type="number"
                  placeholder="Max Salary (₹)"
                  value={formData.salaryMax}
                  onChange={(e) => handleInputChange('salaryMax', e.target.value)}
                  required
                />
              </div>

              <Select value={formData.salaryPeriod} onValueChange={(value) => handleInputChange('salaryPeriod', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Per Day</SelectItem>
                  <SelectItem value="weekly">Per Week</SelectItem>
                  <SelectItem value="monthly">Per Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </ModernCard>

          {/* Job Type & Urgency */}
          <ModernCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Type</h2>
            <div className="space-y-4">
              <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="temporary">Temporary</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div>
                  <p className="font-medium text-gray-900">Mark as Urgent</p>
                  <p className="text-sm text-gray-600">Get faster responses from workers</p>
                </div>
                <Button
                  type="button"
                  variant={formData.urgency ? "default" : "outline"}
                  onClick={() => handleInputChange('urgency', !formData.urgency)}
                  className="min-w-[80px]"
                >
                  {formData.urgency ? 'Urgent' : 'Normal'}
                </Button>
              </div>
            </div>
          </ModernCard>

          {/* Contact Information with Communication Options */}
          <ModernCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <Input
                type="tel"
                placeholder="Contact Phone"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Contact Email (Optional)"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
              />
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Communication Preferences</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Workers will be able to contact you via:
                </p>
                <CommunicationButtons
                  targetId={user.id || 'current-user'}
                  targetName={user.name || 'You'}
                  targetType="employer"
                  size="sm"
                />
              </div>
            </div>
          </ModernCard>

          {/* Submit Button */}
          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold"
            >
              Post Job Now
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Your job will be visible to {Math.floor(Math.random() * 200 + 100)} workers in your area
            </p>
          </div>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PostJob;
