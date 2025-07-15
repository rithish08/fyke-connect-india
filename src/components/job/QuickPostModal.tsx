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
      label: t('job.businessType.individual', 'Individual'),
      icon: <User className="w-5 h-5" />,
      description: t('job.businessType.individualDesc', 'Personal job posting')
    },
    {
      id: 'commercial',
      label: t('job.businessType.commercial', 'Commercial'),
      icon: <Building2 className="w-5 h-5" />,
      description: t('job.businessType.commercialDesc', 'Small business/shop')
    },
    {
      id: 'business',
      label: t('job.businessType.business', 'Business'),
      icon: <Factory className="w-5 h-5" />,
      description: t('job.businessType.businessDesc', 'Company/organization')
    }
  ];

  const categories = [
    t('job.category.Construction', 'Construction'),
    t('job.category.Delivery', 'Delivery'),
    t('job.category.Cleaning', 'Cleaning'),
    t('job.category.Security', 'Security'),
    t('job.category.Driver', 'Driver'),
    t('job.category.Cooking', 'Cooking'),
    t('job.category.Gardening', 'Gardening'),
    t('job.category.Beauty', 'Beauty'),
    t('job.category.Repair', 'Repair')
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

  // --- UI/UX Redesign ---
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg w-full p-0 rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-0">
          <Card className="p-6 border-0 rounded-none">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold mb-2 text-center">{t('job.quickPost', 'Quick Post a Job')}</DialogTitle>
              <p className="text-gray-500 text-center mb-4">{t('job.quickPostHint', 'Fill the minimum details to post your job fast!')}</p>
            </DialogHeader>

            {/* Step 1: Category */}
            <div className="mb-4">
              <Label className="block mb-2 font-semibold">{t('job.category', 'Category')} <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={cn(
                      'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all focus:outline-none',
                      selectedCategory === cat
                        ? 'border-blue-600 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-blue-300'
                    )}
                    onClick={() => handleCategoryChange(cat)}
                    aria-label={t(`job.category.${cat}`, cat)}
                  >
                    <span className="text-base font-semibold text-gray-900 mb-1">{t(`job.category.${cat}`, cat)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Subcategory */}
            {selectedCategory && (
              <div className="mb-4">
                <Label className="block mb-2 font-semibold">{t('job.subcategory', 'Specialization')} <span className="text-red-500">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(subcategoriesMap[selectedCategory] || []).map((subcat) => (
                    <button
                      key={subcat}
                      type="button"
                      className={cn(
                        'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all focus:outline-none',
                        selectedSubcategory === subcat
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      )}
                      onClick={() => handleSubcategoryChange(subcat)}
                      aria-label={t(`job.subcategory.${subcat}`, subcat)}
                    >
                      <span className="text-sm font-medium text-gray-900">{t(`job.subcategory.${subcat}`, subcat)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Wage (optional) */}
            <div className="mb-4">
              <Label className="block mb-1 font-semibold">{t('job.salary', 'Wage (optional)')}</Label>
              <Input
                type="text"
                placeholder={t('job.salaryPlaceholder', 'e.g. 500 or 500-700')}
                value={formData.salary}
                onChange={e => handleInputChange('salary', e.target.value)}
                className="mb-1"
              />
              <div className="flex gap-2 mt-1">
                <Select value={formData.salaryType} onValueChange={val => handleInputChange('salaryType', val)}>
                  <SelectTrigger className="w-32 h-9 text-sm">
                    <SelectValue placeholder={t('job.salaryPeriod', 'per Day')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">{t('job.perDay', 'per Day')}</SelectItem>
                    <SelectItem value="weekly">{t('job.perWeek', 'per Week')}</SelectItem>
                    <SelectItem value="monthly">{t('job.perMonth', 'per Month')}</SelectItem>
                    <SelectItem value="hourly">{t('job.perHour', 'per Hour')}</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" variant="ghost" size="sm" onClick={handleSkipWage}>{t('job.skip', 'Skip')}</Button>
              </div>
            </div>

            {/* Step 4: Urgency (optional) */}
            <div className="mb-4">
              <Label className="block mb-1 font-semibold">{t('job.urgency', 'Urgency (optional)')}</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={isUrgent ? 'default' : 'outline'}
                  className={isUrgent ? 'bg-red-600 text-white' : ''}
                  onClick={() => {
                    setIsUrgent((prev) => !prev);
                    handleInputChange('urgency', !isUrgent ? 'urgent' : 'normal');
                  }}
                >
                  {isUrgent ? t('job.urgent', 'Urgent') : t('job.normal', 'Normal')}
                </Button>
              </div>
            </div>

            {/* Step 5: Type (optional) */}
            <div className="mb-4">
              <Label className="block mb-1 font-semibold">{t('job.type', 'Type (optional)')}</Label>
              <RadioGroup
                value={formData.businessType}
                onValueChange={val => handleInputChange('businessType', val)}
                className="flex gap-2"
              >
                {businessTypes.map(type => (
                  <RadioGroupItem key={type.id} value={type.id} className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:border-blue-300 cursor-pointer">
                    {type.icon}
                    <span className="ml-1 text-sm font-medium">{type.label}</span>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
            </div>

            {/* Step 6: Title/Description (optional, auto-generated) */}
            <div className="mb-4">
              <Label className="block mb-1 font-semibold">{t('job.title', 'Title (optional)')}</Label>
              <Input
                type="text"
                placeholder={t('job.titlePlaceholder', 'e.g. Urgent Mason Needed')}
                value={formData.title}
                onChange={e => handleInputChange('title', e.target.value)}
              />
              <Label className="block mt-2 mb-1 font-semibold">{t('job.description', 'Description (optional)')}</Label>
              <Textarea
                placeholder={t('job.descriptionPlaceholder', 'Describe job responsibilities...')}
                value={formData.description}
                onChange={e => handleInputChange('description', e.target.value)}
              />
            </div>

            {/* Step 7: Location (optional) */}
            <div className="mb-4">
              <Label className="block mb-1 font-semibold">{t('job.location', 'Location (optional)')}</Label>
              <Input
                type="text"
                placeholder={t('job.locationPlaceholder', 'e.g. Mumbai, India')}
                value={formData.location}
                onChange={e => handleInputChange('location', e.target.value)}
              />
            </div>

            {/* Summary/Confirmation */}
            <div className="mb-4">
              <Card className="p-3 bg-blue-50 border-blue-200">
                <div className="text-sm text-blue-900 font-semibold mb-1">{t('job.summary', 'Summary')}</div>
                <div className="text-xs text-blue-800">
                  {selectedCategory && <div><b>{t('job.category', 'Category')}:</b> {selectedCategory}</div>}
                  {selectedSubcategory && <div><b>{t('job.subcategory', 'Specialization')}:</b> {selectedSubcategory}</div>}
                  {formData.salary && <div><b>{t('job.salary', 'Wage')}:</b> {formData.salary} ({t('job.salaryPeriod', formData.salaryType)})</div>}
                  <div><b>{t('job.urgency', 'Urgency')}:</b> {isUrgent ? t('job.urgent', 'Urgent') : t('job.normal', 'Normal')}</div>
                  <div><b>{t('job.type', 'Type')}:</b> {businessTypes.find(t => t.id === formData.businessType)?.label}</div>
                  {formData.location && <div><b>{t('job.location', 'Location')}:</b> {formData.location}</div>}
                </div>
              </Card>
            </div>

            {/* Post Job Button */}
            <div className="flex flex-col gap-2 mt-4">
              <Button
                type="submit"
                className="w-full h-12 text-lg font-bold"
                disabled={isSubmitting || !selectedCategory || !selectedSubcategory}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t('job.postJob', 'Post Job')}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={handleClose}>{t('common.cancel', 'Cancel')}</Button>
            </div>
          </Card>
        </form>
        {/* Success: Show Find Worker button */}
        {showFindWorker && (
          <div className="p-6 text-center">
            <div className="text-green-600 font-bold mb-2">{t('job.postSuccess', 'Job posted successfully!')}</div>
            <Button className="w-full" onClick={handleFindWorker}>{t('job.findWorkers', 'Find Workers')}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuickPostModal;
