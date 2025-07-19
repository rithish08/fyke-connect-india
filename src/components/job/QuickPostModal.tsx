import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
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
import { motion, AnimatePresence } from 'framer-motion';

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

  // Onboarding step state
  const [step, setStep] = useState(0);
  const steps = ['Category', 'Subcategory', 'Details'];

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

  // Example categories and subcategories (replace with real data as needed)
  const categoriesList = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Driver', 'Cooking', 'Gardening', 'Beauty', 'Repair'
  ];
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

    console.log('Posting new job:', newJob);
    try {
      const { error } = await supabase.from('jobs').insert(newJob);

      if (error) {
        console.error('Error posting job:', error);
        throw error;
      }

      showSuccess(t('job.postSuccess', 'Job posted successfully!'));
      setShowFindWorker(true);
    } catch (error) {
      const err = error as Error;
      console.error('Error posting job (catch):', err);
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            {/* Blurred, semi-transparent overlay */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-md" />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative bg-white rounded-3xl shadow-2xl flex flex-col items-center p-0"
              style={{ width: '50vw', height: '70vh', maxWidth: '420px', maxHeight: '90vh', minWidth: '320px', minHeight: '340px', overflow: 'hidden' }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {/* Stepper header */}
              <div className="w-full flex justify-center items-center py-4 border-b border-gray-100 bg-white rounded-t-3xl">
                <div className="flex gap-2">
                  {steps.map((s, i) => (
                    <div key={s} className={`w-3 h-3 rounded-full ${i === step ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
                  ))}
                </div>
              </div>
              {/* Card content, scrollable if needed */}
              <div className="flex-1 w-full overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {step === 0 && (
                  <>
                    <div className="text-lg font-semibold text-center mb-2">Select Category</div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {categoriesList.map(cat => (
                        <button
                          key={cat}
                          className={`flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-150 ${selectedCategory === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                          onClick={() => { setSelectedCategory(cat); setStep(1); }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 1 && (
                  <>
                    <div className="text-lg font-semibold text-center mb-2">Select Subcategory</div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {(subcategoriesMap[selectedCategory] || []).map(sub => (
                        <button
                          key={sub}
                          className={`flex-shrink-0 px-4 py-2 rounded-xl border text-sm font-medium whitespace-nowrap transition-all duration-150 ${selectedSubcategory === sub ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
                          onClick={() => { setSelectedSubcategory(sub); setStep(2); }}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {step === 2 && (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                    <div className="text-lg font-semibold text-center mb-2">Job Details</div>
                    {/* Step 1: Category */}
                    <div className="mb-4">
                      <Label className="block mb-2 font-semibold">{t('job.category', 'Category')} <span className="text-red-500">*</span></Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categoriesList.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            className={cn(
                              'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all focus:outline-none min-h-[60px] min-w-0',
                              selectedCategory === cat
                                ? 'border-blue-600 bg-blue-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-blue-300'
                            )}
                            onClick={() => handleCategoryChange(cat)}
                            aria-label={t(`job.category.${cat}`, cat)}
                          >
                            <span className="text-base font-semibold text-gray-900 mb-1 break-words text-center w-full max-w-[90px]">{t(`job.category.${cat}`, cat)}</span>
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
                                'flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all focus:outline-none min-h-[48px] min-w-0',
                                selectedSubcategory === subcat
                                  ? 'border-blue-600 bg-blue-50 shadow-md'
                                  : 'border-gray-200 bg-white hover:border-blue-300'
                              )}
                              onClick={() => handleSubcategoryChange(subcat)}
                              aria-label={t(`job.subcategory.${subcat}`, subcat)}
                            >
                              <span className="text-sm font-medium text-gray-900 break-words text-center w-full max-w-[90px]">{t(`job.subcategory.${subcat}`, subcat)}</span>
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
                        className="w-full h-14 text-lg font-semibold rounded-xl bg-orange-400 hover:bg-orange-500 transition-all duration-200 shadow-md border-0" style={{ color: '#fff' }} disabled={isSubmitting}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5 mr-2 inline" /> : null}
                        {t('job.post', 'Post')}
                      </Button>
                      <Button type="button" variant="outline" className="w-full h-12 rounded-xl" onClick={handleClose}>
                        {t('common.cancel', 'Cancel')}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default QuickPostModal;
