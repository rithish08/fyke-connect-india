
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Briefcase, User, Building2, Factory } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';

interface QuickPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickPostModal: React.FC<QuickPostModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess } = useGlobalToast();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    salary: '',
    salaryType: 'daily',
    businessType: 'individual',
    urgency: 'normal'
  });

  const businessTypes = [
    {
      id: 'individual',
      label: 'Individual',
      icon: <User className="w-5 h-5" />,
      description: 'Personal job posting'
    },
    {
      id: 'commercial',
      label: 'Commercial',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Small business/shop'
    },
    {
      id: 'business',
      label: 'Business',
      icon: <Factory className="w-5 h-5" />,
      description: 'Company/organization'
    }
  ];

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security',
    'Driver', 'Cooking', 'Gardening', 'Beauty', 'Repair'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category || !formData.salary) {
      return;
    }

    // Here you would normally send to backend
    showSuccess('Job posted successfully!');
    onClose();
    
    // Reset form
    setFormData({
      title: '',
      category: '',
      description: '',
      location: '',
      salary: '',
      salaryType: 'daily',
      businessType: 'individual',
      urgency: 'normal'
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Briefcase className="w-6 h-6 text-blue-600" />
            Quick Job Post
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Business Type</Label>
            <RadioGroup
              value={formData.businessType}
              onValueChange={(value) => handleInputChange('businessType', value)}
              className="grid grid-cols-1 gap-3"
            >
              {businessTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                  <Label
                    htmlFor={type.id}
                    className={`flex items-center space-x-3 w-full p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.businessType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                      formData.businessType === type.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{type.label}</div>
                      <div className="text-sm text-gray-500">{type.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">Job Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Construction Worker Needed"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          {/* Category and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="py-3 px-4 hover:bg-gray-50">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</Label>
              <Input
                id="location"
                placeholder="e.g., Mumbai, Maharashtra"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="h-12 text-base"
              />
            </div>
          </div>

          {/* Salary Section */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Salary *</Label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Amount"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>
              <Select value={formData.salaryType} onValueChange={(value) => handleInputChange('salaryType', value)}>
                <SelectTrigger className="w-32 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the job requirements, timing, and any specific skills needed..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="text-base"
            />
          </div>

          {/* Urgency */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">Urgency</Label>
            <RadioGroup
              value={formData.urgency}
              onValueChange={(value) => handleInputChange('urgency', value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="normal" id="normal" />
                <Label htmlFor="normal" className="text-sm font-medium">Normal</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="urgent" id="urgent" />
                <Label htmlFor="urgent" className="text-sm font-medium">Urgent</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700"
            >
              Post Job
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickPostModal;
