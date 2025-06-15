import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, MapPin, Calendar, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { categories } from '@/data/categories';

const PostJob = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const { showSuccess } = useGlobalToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    salary: '',
    salaryType: 'fixed',
    location: userProfile?.location || '',
    deadline: '',
    requirements: '',
    contactInfo: userProfile?.name || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, category: value, subcategory: '' }));
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, subcategory: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock job posting - in real app, this would call an API
    const jobData = {
      ...formData,
      employerName: userProfile?.name || 'Anonymous',
      employerLocation: userProfile?.location || 'Not specified',
      postedDate: new Date().toISOString(),
      status: 'active'
    };

    console.log('Posting job:', jobData);
    showSuccess('Job posted successfully!');
    navigate('/my-jobs');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post a New Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Carpenter, Plumber, Electrician..."
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the job in detail"
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full rounded-md border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              {formData.category && (
                <div>
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <select
                    id="subcategory"
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleSubcategoryChange}
                    className="w-full rounded-md border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a subcategory</option>
                    {categories.find(cat => cat.id === formData.category)?.subcategories.map(subcat => (
                      <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <Label htmlFor="salary">Salary</Label>
                <div className="relative">
                  <Input
                    type="number"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="Enter salary amount"
                    required
                    className="pl-8"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="salaryType">Salary Type</Label>
                <select
                  id="salaryType"
                  name="salaryType"
                  value={formData.salaryType}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="fixed">Fixed</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Enter job location"
                    required
                    className="pl-8"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="deadline">Application Deadline</Label>
                <div className="relative">
                  <Input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="List job requirements"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactInfo">Contact Information</Label>
                <Input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Enter contact name"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Post Job
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PostJob;
