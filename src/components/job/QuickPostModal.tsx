import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Briefcase, User, Building2, Factory, Loader2 } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useLocalization } from '@/contexts/LocalizationContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuickPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuickPostModal: React.FC<QuickPostModalProps> = ({ isOpen, onClose }) => {
  const { showSuccess, showError } = useGlobalToast();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFindWorker, setShowFindWorker] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

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

  // Example subcategories per category
  const subcategoriesMap: Record<string, string[]> = {
    Construction: ['Mason', 'Carpenter', 'Painter', 'Electrician'],
    Delivery: ['Bike Delivery', 'Van Delivery', 'Courier'],
    Cleaning: ['Home', 'Office', 'Deep Cleaning'],
    Security: ['Guard', 'Supervisor'],
    Driver: ['Car', 'Truck', 'Auto', 'Tempo'],
    Cooking: ['Home Cook', 'Restaurant', 'Catering'],
    Gardening: ['Landscaping', 'Maintenance'],
    Beauty: ['Hair', 'Makeup', 'Spa'],
    Repair: ['AC', 'Fridge', 'Washing Machine', 'General']
  };

  const parseSalary = (salaryInput: string): { min?: number, max?: number } => {
    if (!salaryInput) return {};
    const parts = salaryInput.split('-').map(part => parseInt(part.trim(), 10));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { min: parts[0], max: parts[1] };
    }
    if (parts.length === 1 && !isNaN(parts[0])) {
      return { min: parts[0], max: parts[0] };
    }
    return {};
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedCategory || !selectedSubcategory || !user) {
      showError(t('job.postErrorRequired', 'Please fill all required fields.'));
      return;
    }

    setIsSubmitting(true);
    const { min, max } = parseSalary(formData.salary);

    const newJob = {
      employer_id: user.id,
      title: formData.title,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      description: formData.description,
      location: formData.location,
      salary_min: min,
      salary_max: max,
      salary_period: formData.salaryType,
      urgent: isUrgent,
      status: 'open',
    };

    try {
      const { error } = await supabase.from('jobs').insert(newJob);

      if (error) {
        throw error;
      }

      showSuccess(t('job.postSuccess', 'Job posted successfully!'));
      setShowFindWorker(true);
    } catch (error) {
      const err = error as Error;
      console.error("Error posting job:", err);
      showError(t('job.postError', 'Failed to post job. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
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
    setSelectedCategory('');
    setSelectedSubcategory('');
    setIsUrgent(false);
    setShowFindWorker(false);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategory('');
    handleInputChange('category', value);
  };

  const handleSubcategoryChange = (value: string) => {
    setSelectedSubcategory(value);
  };

  const handleSkipWage = () => {
    setFormData(prev => ({ ...prev, salary: '' }));
  };

  const handleFindWorker = () => {
    const category = selectedCategory;
    const subcategory = selectedSubcategory;
    handleClose(); // Reset and close the modal
    navigate(`/search?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
  };

  // Card-style category selection
  const renderCategoryCards = () => (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all focus:outline-none',
            selectedCategory === cat
              ? 'border-blue-600 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-blue-300'
          )}
          onClick={() => handleCategoryChange(cat)}
          aria-label={t(`job.category.${cat}`, cat)}
        >
          <span className="text-lg font-semibold text-gray-900 mb-1">{t(`job.category.${cat}`, cat)}</span>
        </button>
      ))}
    </div>
  );

  // Card-style subcategory selection
  const renderSubcategoryCards = () => (
    <div className="grid grid-cols-2 gap-3">
      {(subcategoriesMap[selectedCategory] || []).map((subcat) => (
        <button
          key={subcat}
          type="button"
          className={cn(
            'flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all focus:outline-none',
            selectedSubcategory === subcat
              ? 'border-blue-600 bg-blue-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-blue-300'
          )}
          onClick={() => handleSubcategoryChange(subcat)}
          aria-label={t(`job.subcategory.${subcat}`, subcat)}
        >
          <span className="text-base font-medium text-gray-900">{t(`job.subcategory.${subcat}`, subcat)}</span>
        </button>
      ))}
    </div>
  );

  // Prominent urgent toggle
  const renderUrgentToggle = () => (
    <div className="flex items-center gap-4 mt-2">
      <span className="text-sm font-semibold text-gray-700">{t('job.urgency', 'Urgency')}</span>
      <button
        type="button"
        className={cn(
          'px-4 py-2 rounded-full font-semibold transition-all',
          isUrgent ? 'bg-red-600 text-white shadow' : 'bg-gray-100 text-gray-700 border border-gray-300'
        )}
        onClick={() => {
          setIsUrgent((prev) => !prev);
          handleInputChange('urgency', !isUrgent ? 'urgent' : 'normal');
        }}
        aria-label={t('job.urgent', 'Urgent')}
      >
        {isUrgent ? t('job.urgent', 'Urgent') : t('job.normal', 'Normal')}
      </button>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm w-full p-4 sm:p-8 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <Briefcase className="w-6 h-6 text-blue-600" />
            {t('job.quickPost', 'Quick Job Post')}
          </DialogTitle>
        </DialogHeader>

        {showFindWorker ? (
          <div className="flex flex-col items-center space-y-6 py-8">
            <div className="text-2xl font-bold text-green-700">{t('job.postedSuccess', 'Job posted!')}</div>
            <Button className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg" onClick={handleFindWorker} aria-label={t('job.findWorker', 'Find Worker')}>
              {t('job.findWorker', 'Find Worker')}
            </Button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-700">{t('job.businessType', 'Business Type')}</Label>
            <RadioGroup value={formData.businessType} onValueChange={(v) => handleInputChange('businessType', v)} className="grid grid-cols-1 gap-3">
              {businessTypes.map((type) => (
                <div key={type.id} className="flex items-center">
                  <RadioGroupItem value={type.id} id={`bt-${type.id}`} className="sr-only" />
                  <Label
                    htmlFor={`bt-${type.id}`}
                    className={cn(
                      'flex items-center space-x-3 w-full p-4 rounded-xl border-2 cursor-pointer transition-all',
                      formData.businessType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-lg',
                      formData.businessType === type.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                    )}>
                      {type.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{t(`job.businessType.${type.id}`, type.label)}</div>
                      <div className="text-sm text-gray-500">{t(`job.businessTypeDesc.${type.id}`, type.description)}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">{t('job.title', 'Job Title')} *</Label>
            <Input
              id="title"
              placeholder={t('job.titlePlaceholder', 'e.g., Construction Worker Needed')}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="h-12 text-base"
              required
            />
          </div>

          {/* Category Cards */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-700">{t('job.category', 'Category')} *</Label>
            {renderCategoryCards()}
          </div>

          {/* Subcategory Cards */}
          {selectedCategory && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">{t('job.subcategory', 'Subcategory')} *</Label>
              {renderSubcategoryCards()}
            </div>
          )}

          {/* Location */}
            <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-semibold text-gray-700">{t('job.location', 'Location')}</Label>
              <Input
                id="location"
              placeholder={t('job.locationPlaceholder', 'e.g., Mumbai, Maharashtra')}
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="h-12 text-base"
              />
          </div>

          {/* Wages (optional) */}
          <div className="space-y-3">
            <Label htmlFor="salary" className="text-sm font-semibold text-gray-700">{t('job.salary', 'Salary (Optional)')}</Label>
            <div className="flex items-center gap-2">
              <Input id="salary" placeholder={t('job.salaryPlaceholder', 'e.g., 500 or 500-700')} value={formData.salary} onChange={(e) => handleInputChange('salary', e.target.value)} />
              <select 
                aria-label={t('job.salaryPeriod', 'Salary Period')}
                value={formData.salaryType} 
                onChange={(e) => handleInputChange('salaryType', e.target.value)} 
                className="border-gray-300 rounded-md p-2 bg-white"
              >
                <option value="daily">{t('job.daily', 'daily')}</option>
                <option value="weekly">{t('job.weekly', 'weekly')}</option>
                <option value="monthly">{t('job.monthly', 'monthly')}</option>
                <option value="hourly">{t('job.hourly', 'hourly')}</option>
              </select>
            </div>
            {!formData.salary && (
              <div className="text-xs text-blue-600 mt-1 flex items-center gap-2">
                {t('job.noWageSet', 'You can discuss wages in chat or call.')}
                <Button type="button" size="sm" variant="outline" className="ml-2 px-2 py-1 h-8 text-xs" onClick={handleSkipWage} aria-label={t('job.skipWage', 'Skip Wage')}>
                  {t('job.skipWage', 'Skip Wage')}
                </Button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">{t('job.description', 'Job Description')}</Label>
            <Textarea
              id="description"
              placeholder={t('job.descriptionPlaceholder', 'Describe the job requirements, timing, and any specific skills needed...')}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="text-base"
            />
          </div>

          {/* Urgency Toggle */}
          {renderUrgentToggle()}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-12 text-base"
            >
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-lg"
              aria-label={t('job.post', 'Post Job')}
              disabled={!formData.title || !selectedCategory || !selectedSubcategory}
            >
              {t('job.post', 'Post Job')}
            </Button>
          </div>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickPostModal;
