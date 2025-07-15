import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MapPin, DollarSign, Clock, AlertCircle, Zap, Loader2, Briefcase } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import BottomNavigation from '@/components/BottomNavigation';
import { useCategories } from '@/hooks/useCategories';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEmployerJobs } from '@/hooks/useEmployerJobs';
import { useLocalization } from '@/contexts/LocalizationContext';
import { getCurrentLocationArea } from '@/utils/locationUtils';
import { notificationService } from '@/services/notificationService';
import QuickPostModal from '@/components/job/QuickPostModal';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import ElegantModal from '@/components/ui/elegant-modal';
import { FloatingCard } from '@/components/ui/floating-card';
import StickyFooterButton from '@/components/ui/StickyFooterButton';
import { useSubcategories } from '@/hooks/useSubcategories';
import { categories as staticCategories } from '@/data/categories';

interface QuickPostTemplate {
  title: string;
  category: string;
  description: string;
  salary: string;
  hiringType: string;
}

// --- Subcategory Chips Component ---
const SubcategoryChips: React.FC<{
  subcategories: string[];
  selected: string[];
  onSelect: (sub: string) => void;
  horizontal?: boolean;
  required?: boolean;
}> = ({ subcategories, selected, onSelect, horizontal = false, required = false }) => (
  <div className={horizontal ? 'flex gap-2 overflow-x-auto py-2 scrollbar-thin scrollbar-thumb-blue-200' : 'flex flex-wrap gap-2'} style={{ maxWidth: '100%' }}>
    {subcategories.map((sub) => (
      <button
        key={sub}
        type="button"
        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 select-none whitespace-nowrap break-words max-w-[140px] ${selected.includes(sub) ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
        onClick={() => onSelect(sub)}
        aria-pressed={!!selected.includes(sub)}
        tabIndex={0}
      >
        <span className="truncate block w-full">{sub}</span>
      </button>
    ))}
    {required && selected.length === 0 && (
      <span className="text-xs text-red-500 mt-1">* Please select at least one</span>
    )}
  </div>
);

// --- Quick Post Stepper ---
const QuickPostStepper: React.FC<{
  formData: any,
  setFormData: any,
  categories: any[],
  categoriesLoading: boolean,
  categoriesError: any,
  onBack: () => void,
  onSubmit: (data: any) => Promise<void>,
  loading: boolean,
}> = ({ formData, setFormData, categories, categoriesLoading, categoriesError, onBack, onSubmit, loading }) => {
  const { t } = useLocalization();
  const [step, setStep] = useState<QuickStep>('category');
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useGlobalToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Fallback to static categories if needed
  const categoryList = (!categoriesLoading && categories && categories.length > 0) ? categories : staticCategories;
  const selectedCategory = categoryList.find(cat => cat.id === formData.category_id);
  // Subcategory logic
  const { subcategories: fetchedSubs, loading: subLoading } = useSubcategories(formData.category_id);
  const staticSubs = selectedCategory?.subcategories || [];
  const subcategories = (fetchedSubs && fetchedSubs.length > 0) ? fetchedSubs.map(s => s.name) : staticSubs;

  // --- Modal/sheet close fix ---
  useEffect(() => {
    if (formData.modalOpen === false) {
      navigate('/my-jobs');
    }
  }, [formData.modalOpen, navigate]);

  // Step 1: Category Selection
  if (step === 'category') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={onBack}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.selectCategory', 'Select a Category')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {categoryList.map((cat: any) => (
            <Button
              key={cat.id}
              variant={formData.category_id === cat.id ? 'default' : 'outline'}
              className="flex flex-col items-center py-6 h-28 w-full justify-center transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              onClick={() => setFormData((prev: any) => ({ ...prev, category_id: cat.id, subcategories: [] }))}
              tabIndex={0}
            >
              <span className="text-3xl mb-2 block w-12 h-12 flex items-center justify-center mx-auto">{cat.icon || '🔧'}</span>
              <span className="text-base font-semibold text-center leading-tight break-words w-full">{cat.name}</span>
            </Button>
          ))}
        </div>
        <StickyFooterButton
          disabled={!formData.category_id}
          onClick={() => setStep('subcategory')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 2: Subcategory (optional)
  if (step === 'subcategory') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('category')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.selectSubcategory', 'Select Specialization (Optional)')}</h2>
        {subLoading ? <div className="text-center w-full">Loading...</div> : (
          <SubcategoryChips
            subcategories={subcategories}
            selected={formData.subcategories || []}
            onSelect={sub => {
              setFormData((prev: any) => {
                const selected = prev.subcategories || [];
                return selected.includes(sub)
                  ? { ...prev, subcategories: selected.filter((s: string) => s !== sub) }
                  : { ...prev, subcategories: [...selected, sub] };
              });
            }}
          />
        )}
        <StickyFooterButton
          onClick={() => setStep('details')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 2: Job Details
  if (step === 'details') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('category')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.jobDetails', 'Job Details')}</h2>
        <div className="flex flex-col gap-4 w-full">
          <Input
            placeholder={t('job.titlePlaceholder', 'Job Title (e.g. Mason, Driver)')}
            value={formData.title}
            onChange={e => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
            maxLength={40}
            required
          />
          <Textarea
            placeholder={t('job.descriptionPlaceholder', 'Short Description (optional)')}
            value={formData.description}
            onChange={e => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            maxLength={120}
          />
          <div className="flex gap-2 items-center w-full">
            <Input
              type="number"
              placeholder={t('job.dailyWage', 'Daily Wage')}
              value={formData.salary_min}
              onChange={e => setFormData((prev: any) => ({ ...prev, salary_min: e.target.value }))}
              min={0}
              className="w-32"
              required
            />
            <span className="text-gray-500">/ {t('job.perDay', 'day')}</span>
          </div>
        </div>
        <StickyFooterButton
          disabled={!formData.title || !formData.salary_min}
          onClick={() => setStep('location')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 3: Location
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);
    try {
      const locationInfo = await getCurrentLocationArea();
      if (locationInfo && locationInfo.area) {
        setFormData((prev: any) => ({ ...prev, location: locationInfo.area }));
      } else {
        setLocationError(t('job.locationDetectFailed', 'Could not detect location. Please enter manually.'));
      }
    } catch (error) {
      setLocationError(t('job.locationDetectFailed', 'Could not detect location. Please enter manually.'));
    } finally {
      setIsDetecting(false);
    }
  };
  if (step === 'location') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('details')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.location', 'Job Location')}</h2>
        <div className="flex flex-col gap-4 w-full">
          <Input
            placeholder={t('job.locationPlaceholder', 'Enter location or area')}
            value={formData.location}
            onChange={e => setFormData((prev: any) => ({ ...prev, location: e.target.value }))}
            maxLength={60}
            required
          />
          <Button
            variant="outline"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full"
          >
            {isDetecting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <MapPin className="w-4 h-4 mr-2" />} {t('job.detectLocation', 'Detect My Location')}
          </Button>
          {locationError && <div className="text-red-500 text-sm">{locationError}</div>}
        </div>
        <StickyFooterButton
          disabled={!formData.location}
          onClick={() => setStep('review')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 4: Review & Confirm
  if (step === 'review') {
    const selectedCategory = categoryList.find(cat => cat.id === formData.category_id);
    const selectedSub = (formData.subcategories && formData.subcategories.length > 0) ? formData.subcategories.join(', ') : '—';
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('location')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.review', 'Review & Confirm')}</h2>
        <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedCategory?.icon || '🔧'}</span>
            <span className="font-semibold truncate max-w-[120px]">{selectedCategory?.name}</span>
          </div>
          <div><span className="font-semibold">{t('job.subcategory', 'Specialization')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{selectedSub}</span></div>
          <div><span className="font-semibold">{t('job.title', 'Title')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.title}</span></div>
          <div><span className="font-semibold">{t('job.description', 'Description')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.description || <span className="text-gray-400">(none)</span>}</span></div>
          <div><span className="font-semibold">{t('job.dailyWage', 'Daily Wage')}:</span> {formData.salary_min ? `₹${formData.salary_min} / ${t('job.perDay', 'day')}` : '—'}</div>
          <div><span className="font-semibold">{t('job.location', 'Location')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.location}</span></div>
        </div>
        <StickyFooterButton
          loading={loading || submitting}
          onClick={async () => {
            setSubmitting(true);
            await onSubmit(formData);
            setSubmitting(false);
            setStep('success');
          }}
        >
          {t('job.confirmAndPost', 'Confirm & Post')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 5: Success
  if (step === 'success') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 items-center justify-center min-h-[60vh] pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-center">{t('job.postedSuccess', 'Job Posted Successfully!')}</h2>
        <div className="text-center text-gray-600 mb-4">{t('job.successDesc', 'Your job is now live. You can view or manage it anytime.')}</div>
        <div className="flex gap-2 w-full">
          <Button className="w-full" onClick={() => navigate('/my-jobs')}>{t('job.goToMyJobs', 'Go to My Jobs')}</Button>
          <Button className="w-full" variant="outline" onClick={() => window.location.reload()}>{t('job.postAnother', 'Post Another')}</Button>
        </div>
      </FloatingCard>
    );
  }
  return null;
};

// --- Detailed Post Stepper ---
const DetailedPostStepper: React.FC<{
  formData: any,
  setFormData: any,
  categories: any[],
  categoriesLoading: boolean,
  categoriesError: any,
  onBack: () => void,
  onSubmit: (data: any) => Promise<void>,
  loading: boolean,
}> = ({ formData, setFormData, categories, categoriesLoading, categoriesError, onBack, onSubmit, loading }) => {
  const { t } = useLocalization();
  const [step, setStep] = useState<DetailedStep>('category');
  const [submitting, setSubmitting] = useState(false);
  const { showError, showSuccess } = useGlobalToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  // Fallback to static categories if needed
  const categoryList = (!categoriesLoading && categories && categories.length > 0) ? categories : staticCategories;
  const selectedCategory = categoryList.find(cat => cat.id === formData.category_id);
  // Subcategory logic
  const { subcategories: fetchedSubs, loading: subLoading } = useSubcategories(formData.category_id);
  const staticSubs = selectedCategory?.subcategories || [];
  const subcategories = (fetchedSubs && fetchedSubs.length > 0) ? fetchedSubs.map(s => s.name) : staticSubs;

  // Step 1: Category Selection
  if (step === 'category') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={onBack}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.selectCategory', 'Select a Category')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {categoryList.map((cat: any) => (
            <Button
              key={cat.id}
              variant={formData.category_id === cat.id ? 'default' : 'outline'}
              className="flex flex-col items-center py-6 h-28 w-full justify-center transition-all duration-200 focus:ring-2 focus:ring-blue-500"
              onClick={() => setFormData((prev: any) => ({ ...prev, category_id: cat.id, subcategories: [] }))}
              tabIndex={0}
            >
              <span className="text-3xl mb-2 block w-12 h-12 flex items-center justify-center mx-auto">{cat.icon || '🔧'}</span>
              <span className="text-base font-semibold text-center leading-tight break-words w-full">{cat.name}</span>
            </Button>
          ))}
        </div>
        <StickyFooterButton
          disabled={!formData.category_id}
          onClick={() => setStep('subcategory')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 2: Subcategory (mandatory, horizontal scroll)
  if (step === 'subcategory') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('category')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.selectSubcategory', 'Select Specialization')}</h2>
        {subLoading ? <div className="text-center w-full">Loading...</div> : (
          <SubcategoryChips
            subcategories={subcategories}
            selected={formData.subcategories || []}
            onSelect={sub => {
              setFormData((prev: any) => {
                const selected = prev.subcategories || [];
                return selected.includes(sub)
                  ? { ...prev, subcategories: selected.filter((s: string) => s !== sub) }
                  : { ...prev, subcategories: [...selected, sub] };
              });
            }}
            horizontal
            required
          />
        )}
        <StickyFooterButton
          disabled={!formData.subcategories || formData.subcategories.length === 0}
          onClick={() => setStep('details')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 2: Job Details (more fields)
  if (step === 'details') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-36 overflow-hidden w-full max-w-lg mx-auto px-2 relative">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('category')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.jobDetails', 'Job Details')}</h2>
        <div className="flex flex-col gap-4 w-full">
          <Input
            placeholder={t('job.titlePlaceholder', 'Job Title (e.g. Mason, Driver)')}
            value={formData.title}
            onChange={e => setFormData((prev: any) => ({ ...prev, title: e.target.value }))}
            maxLength={40}
            required
          />
          <Textarea
            placeholder={t('job.descriptionPlaceholder', 'Short Description (optional)')}
            value={formData.description}
            onChange={e => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
            maxLength={120}
          />
          {/* Salary Section - redesigned for mobile */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4" />{t('job.salary', 'Salary')}</label>
            <div className="flex flex-col sm:flex-row gap-2 items-center w-full">
              <Input
                type="number"
                placeholder={t('job.salaryMin', 'Min Salary')}
                value={formData.salary_min}
                onChange={e => setFormData((prev: any) => ({ ...prev, salary_min: e.target.value }))}
                min={0}
                className="w-full sm:w-32 text-base"
                required
              />
              <span className="text-gray-500 text-lg font-bold">-</span>
              <Input
                type="number"
                placeholder={t('job.salaryMax', 'Max Salary (optional)')}
                value={formData.salary_max}
                onChange={e => setFormData((prev: any) => ({ ...prev, salary_max: e.target.value }))}
                min={0}
                className="w-full sm:w-32 text-base"
              />
              <Select
                value={formData.salary_period}
                onValueChange={val => setFormData((prev: any) => ({ ...prev, salary_period: val }))}
              >
                <SelectTrigger className="w-full sm:w-32 h-12 rounded-xl border-gray-200 text-base">
                  <SelectValue placeholder={t('job.salaryPeriod', 'Period')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">{t('job.perDay', 'Per Day')}</SelectItem>
                  <SelectItem value="hourly">{t('job.perHour', 'Per Hour')}</SelectItem>
                  <SelectItem value="weekly">{t('job.perWeek', 'Per Week')}</SelectItem>
                  <SelectItem value="monthly">{t('job.perMonth', 'Per Month')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="pb-20" /> {/* Extra bottom padding so button never overlaps */}
        <StickyFooterButton
          disabled={!formData.title || !formData.salary_min}
          onClick={() => setStep('requirements')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 3: Requirements
  if (step === 'requirements') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('details')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.requirements', 'Requirements')}</h2>
        <Textarea
          placeholder={t('job.requirementsPlaceholder', 'List requirements, separated by commas (e.g. 2 years experience, driving license)')}
          value={formData.requirements}
          onChange={e => setFormData((prev: any) => ({ ...prev, requirements: e.target.value }))}
          maxLength={200}
        />
        <StickyFooterButton
          onClick={() => setStep('location')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 4: Location (same as quick)
  const handleDetectLocation = async () => {
    setIsDetecting(true);
    setLocationError(null);
    try {
      const locationInfo = await getCurrentLocationArea();
      if (locationInfo && locationInfo.area) {
        setFormData((prev: any) => ({ ...prev, location: locationInfo.area }));
      } else {
        setLocationError(t('job.locationDetectFailed', 'Could not detect location. Please enter manually.'));
      }
    } catch (error) {
      setLocationError(t('job.locationDetectFailed', 'Could not detect location. Please enter manually.'));
    } finally {
      setIsDetecting(false);
    }
  };
  if (step === 'location') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('requirements')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.location', 'Job Location')}</h2>
        <div className="flex flex-col gap-4 w-full">
          <Input
            placeholder={t('job.locationPlaceholder', 'Enter location or area')}
            value={formData.location}
            onChange={e => setFormData((prev: any) => ({ ...prev, location: e.target.value }))}
            maxLength={60}
            required
          />
          <Button
            variant="outline"
            onClick={handleDetectLocation}
            disabled={isDetecting}
            className="w-full"
          >
            {isDetecting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <MapPin className="w-4 h-4 mr-2" />} {t('job.detectLocation', 'Detect My Location')}
          </Button>
          {locationError && <div className="text-red-500 text-sm">{locationError}</div>}
        </div>
        <StickyFooterButton
          disabled={!formData.location}
          onClick={() => setStep('review')}
        >
          {t('common.next', 'Next')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 5: Review & Confirm
  if (step === 'review') {
    const selectedCategory = categoryList.find(cat => cat.id === formData.category_id);
    const selectedSub = (formData.subcategories && formData.subcategories.length > 0) ? formData.subcategories.join(', ') : '—';
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <Button variant="ghost" className="mb-2 self-start flex items-center gap-2" onClick={() => setStep('location')}><ArrowLeft className="w-5 h-5" /> {t('common.back', 'Back')}</Button>
        <h2 className="text-xl font-bold text-center">{t('job.review', 'Review & Confirm')}</h2>
        <div className="flex flex-col gap-2 bg-gray-50 rounded-lg p-4 w-full">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selectedCategory?.icon || '🔧'}</span>
            <span className="font-semibold truncate max-w-[120px]">{selectedCategory?.name}</span>
          </div>
          <div><span className="font-semibold">{t('job.subcategory', 'Specialization')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{selectedSub}</span></div>
          <div><span className="font-semibold">{t('job.title', 'Title')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.title}</span></div>
          <div><span className="font-semibold">{t('job.description', 'Description')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.description || <span className="text-gray-400">(none)</span>}</span></div>
          <div><span className="font-semibold">{t('job.salary', 'Salary')}:</span> ₹{formData.salary_min}{formData.salary_max ? ` - ₹${formData.salary_max}` : ''} / {t('job.salaryPeriod', formData.salary_period)}</div>
          <div><span className="font-semibold">{t('job.requirements', 'Requirements')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.requirements || <span className="text-gray-400">(none)</span>}</span></div>
          <div><span className="font-semibold">{t('job.location', 'Location')}:</span> <span className="truncate max-w-[180px] inline-block align-middle">{formData.location}</span></div>
        </div>
        <StickyFooterButton
          loading={loading || submitting}
          onClick={async () => {
            setSubmitting(true);
            await onSubmit(formData);
            setSubmitting(false);
            setStep('success');
          }}
        >
          {t('job.confirmAndPost', 'Confirm & Post')}
        </StickyFooterButton>
      </FloatingCard>
    );
  }

  // Step 6: Success
  if (step === 'success') {
    return (
      <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 items-center justify-center min-h-[60vh] pb-28 overflow-hidden w-full max-w-lg mx-auto px-2">
        <div className="text-4xl mb-2">🎉</div>
        <h2 className="text-xl font-bold text-center">{t('job.postedSuccess', 'Job Posted Successfully!')}</h2>
        <div className="text-center text-gray-600 mb-4">{t('job.successDesc', 'Your job is now live. You can view or manage it anytime.')}</div>
        <div className="flex gap-2 w-full">
          <Button className="w-full" onClick={() => navigate('/my-jobs')}>{t('job.goToMyJobs', 'Go to My Jobs')}</Button>
          <Button className="w-full" variant="outline" onClick={() => window.location.reload()}>{t('job.postAnother', 'Post Another')}</Button>
        </div>
      </FloatingCard>
    );
  }
  return null;
};

// --- Main Stepper Render Function ---
function renderStepper(step: string, formData: any, setFormData: any, categories: any[], categoriesLoading: boolean, categoriesError: any, handleBack: any, handleSubmit: any, loading: boolean) {
  if (step === 'choice') {
    return (
      <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
        <FloatingCard variant="elevated" size="md" className="flex flex-col gap-6 min-h-[60vh] justify-center items-center">
          <h1 className="text-2xl font-bold mb-2 text-center">Post a Job</h1>
          <p className="text-gray-500 text-center mb-4">How would you like to post your job?</p>
          <div className="flex flex-col gap-4 w-full">
            <Button className="flex items-center gap-3 w-full h-16 text-lg font-semibold justify-center" onClick={() => setFormData((prev: any) => ({ ...prev, step: 'quick' }))} variant="default">
              <Zap className="w-6 h-6 text-yellow-500" />
              Quick Post
            </Button>
            <Button className="flex items-center gap-3 w-full h-16 text-lg font-semibold justify-center" onClick={() => setFormData((prev: any) => ({ ...prev, step: 'detailed' }))} variant="outline">
              <Briefcase className="w-6 h-6 text-blue-600" />
              Detailed Post
            </Button>
          </div>
        </FloatingCard>
      </div>
    );
  }
  if (step === 'quick') {
    return (
      <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
        <QuickPostStepper
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onBack={handleBack}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    );
  }
  if (step === 'detailed') {
    return (
      <div className="w-full max-w-lg mx-auto px-2 sm:px-0">
        <DetailedPostStepper
          formData={formData}
          setFormData={setFormData}
          categories={categories}
          categoriesLoading={categoriesLoading}
          categoriesError={categoriesError}
          onBack={handleBack}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    );
  }
  return null;
}

// --- Main Component ---
const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useGlobalToast();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { refreshJobs } = useEmployerJobs();
  const { t } = useLocalization();
  
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    subcategories: [],
    location: user?.location || '',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
    salary_period: 'daily',
    urgent: false,
    step: 'choice',
    modalOpen: true,
  });

  const [loading, setLoading] = useState(false);

  // Unified close handler for all close actions
  const handleClose = React.useCallback(() => {
    setFormData((prev: any) => ({ ...prev, modalOpen: false }));
    navigate('/my-jobs');
  }, [navigate]);

  // Ensure navigation happens on modal close (for Sheet/ElegantModal)
  useEffect(() => {
    if (formData.modalOpen === false) {
      navigate('/my-jobs');
      }
  }, [formData.modalOpen, navigate]);

  const handleBack = () => setFormData((prev: any) => ({ ...prev, step: 'choice' }));

  const handleSubmit = async (data: any) => {
    if (!user) {
      showError('You must be logged in to post a job.');
        return;
    }
    if (!data.title || !data.category_id || !data.salary_min || !data.location) {
      showError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          title: data.title,
          description: data.description,
          category_id: data.category_id,
          employer_id: user.id,
          location: data.location,
          salary_min: Number(data.salary_min),
          salary_max: data.salary_max ? Number(data.salary_max) : null,
          salary_period: data.salary_period,
          urgent: data.urgent,
          requirements: data.requirements ? data.requirements.split(',').map((req: string) => req.trim()) : [],
          status: 'open',
        });
      if (error) throw error;
      try {
        await notificationService.sendJobPostedNotification();
      } catch (notificationError) {
        console.warn('Could not send job posted notification:', notificationError);
      }
      showSuccess('Job posted successfully!');
      if (refreshJobs) await refreshJobs();
      navigate('/my-jobs');
    } catch (error) {
      console.error('Failed to post job:', error);
      showError('Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isMobile = window.innerWidth <= 600;

  return (
    <>
      {isMobile ? (
        <Sheet open={formData.modalOpen} onOpenChange={open => {
          setFormData((prev: any) => ({ ...prev, modalOpen: open }));
          if (!open) handleClose();
        }}>
          <SheetContent side="bottom" className="p-0 rounded-t-2xl max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{t('job.postAJob', 'Post a Job')}</SheetTitle>
            </SheetHeader>
            <div className="p-4 w-full max-w-lg mx-auto">{renderStepper(formData.step, formData, setFormData, categories, categoriesLoading, categoriesError, handleBack, handleSubmit, loading)}</div>
          </SheetContent>
        </Sheet>
      ) : (
        <ElegantModal isOpen={formData.modalOpen} onClose={handleClose} title={t('job.postAJob', 'Post a Job')}>
          <div className="w-full max-w-lg mx-auto">{renderStepper(formData.step, formData, setFormData, categories, categoriesLoading, categoriesError, handleBack, handleSubmit, loading)}</div>
        </ElegantModal>
      )}
      <BottomNavigation />
    </>
  );
};

export default PostJob;