
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { FloatingCard } from '@/components/ui/floating-card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, DollarSign, Clock, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import BottomNavigation from '@/components/BottomNavigation';
import { categories } from '@/data/categories';

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    location: '',
    salary: '',
    salaryPeriod: 'daily',
    contactPhone: user?.phone || '',
    contactEmail: '',
    urgent: false,
    requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSubcategories = () => {
    if (!formData.category) return [];
    const category = categories.find(cat => cat.name.toLowerCase() === formData.category.toLowerCase());
    return category?.subcategories || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.location || !formData.salary) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create job post object
      const jobPost = {
        id: `job-${Date.now()}`,
        ...formData,
        employerId: user?.id,
        employerName: user?.name || 'Anonymous Employer',
        postedAt: new Date().toISOString(),
        status: 'active',
        applicants: 0
      };

      // Store in localStorage for demo purposes
      const existingJobs = JSON.parse(localStorage.getItem('userJobs') || '[]');
      existingJobs.push(jobPost);
      localStorage.setItem('userJobs', JSON.stringify(existingJobs));

      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and visible to job seekers",
      });

      navigate('/my-jobs');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only employers can post jobs</p>
          <Button onClick={() => navigate('/home')}>Go to Home</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Post a Job</h1>
        </div>
        <p className="text-gray-600 text-sm ml-14">
          Create a job posting to find the right candidate
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        {/* Job Details */}
        <FloatingCard variant="elevated" size="md" className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Briefcase className="w-5 h-5 mr-2" />
            Job Details
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <Input
              placeholder="e.g., Mason for construction project"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
              value={formData.category}
              onChange={(e) => {
                handleInputChange('category', e.target.value);
                handleInputChange('subcategory', '');
              }}
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>
          </div>

          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={formData.subcategory}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
              >
                <option value="">Select specialization (optional)</option>
                {getSubcategories().map((sub) => (
                  <option key={sub.name} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <Textarea
              placeholder="Describe the job requirements, working conditions, and expectations..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>
        </FloatingCard>

        {/* Location & Compensation */}
        <FloatingCard variant="elevated" size="md" className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Location & Pay
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <Input
              placeholder="e.g., Mumbai, Maharashtra"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salary Amount *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="number"
                  placeholder="500"
                  className="pl-10"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Period
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white h-10"
                value={formData.salaryPeriod}
                onChange={(e) => handleInputChange('salaryPeriod', e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="urgent"
              checked={formData.urgent}
              onChange={(e) => handleInputChange('urgent', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="urgent" className="text-sm text-gray-700">
              This is an urgent hiring
            </label>
            {formData.urgent && (
              <Badge variant="destructive" className="text-xs">
                URGENT
              </Badge>
            )}
          </div>
        </FloatingCard>

        {/* Contact Information */}
        <FloatingCard variant="elevated" size="md" className="space-y-4">
          <h3 className="font-semibold text-gray-900">Contact Information</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+91 9876543210"
              value={formData.contactPhone}
              onChange={(e) => handleInputChange('contactPhone', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Optional)
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            />
          </div>
        </FloatingCard>

        {/* Submit Button */}
        <div className="fixed bottom-20 left-0 right-0 z-50 p-4">
          <div className="w-full max-w-lg mx-auto">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Posting Job...</span>
                </div>
              ) : (
                <>
                  <Briefcase className="w-5 h-5 mr-2" />
                  Post Job
                </>
              )}
            </Button>
          </div>
        </div>
      </form>

      <BottomNavigation />
    </div>
  );
};

export default PostJob;
