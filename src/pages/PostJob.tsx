import React, { useState } from 'react';
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
import { ArrowLeft, MapPin, DollarSign, Clock, AlertCircle, Zap, Loader2 } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import BottomNavigation from '@/components/BottomNavigation';
import { useCategories } from '@/hooks/useCategories';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useEmployerJobs } from '@/hooks/useEmployerJobs';
import { useLocalization } from '@/contexts/LocalizationContext';
import { getCurrentLocationArea } from '@/utils/locationUtils';
import { notificationService } from '@/services/notificationService';

interface QuickPostTemplate {
  title: string;
  category: string;
  description: string;
  salary: string;
  hiringType: string;
}

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
    location: user?.location || '',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
    salary_period: 'daily',
    urgent: false,
  });

  const [loading, setLoading] = useState(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetectLocation = async () => {
    setIsDetectingLocation(true);
    try {
      const locationInfo = await getCurrentLocationArea();
      if (locationInfo) {
        handleInputChange('location', locationInfo.area);
      } else {
        showError(t('job.locationDetectFailed', 'Could not detect location. Please enter manually.'));
      }
    } catch (error) {
      showError(t('job.locationDetectFailed', 'Could not detect location. Please enter manually.'));
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
        showError(t('job.loginRequired', 'You must be logged in to post a job.'));
        return;
    }

    if (!formData.title || !formData.category_id || !formData.description || !formData.salary_min) {
      showError(t('job.requiredFields', 'Please fill in all required fields.'));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id,
          employer_id: user.id,
          location: formData.location,
          salary_min: Number(formData.salary_min),
          salary_max: formData.salary_max ? Number(formData.salary_max) : null,
          salary_period: formData.salary_period,
          urgent: formData.urgent,
          requirements: formData.requirements.split(',').map(req => req.trim()),
          status: 'open'
        });

      if (error) throw error;

      // Send notification for successful job posting
      try {
        await notificationService.sendJobPostedNotification();
      } catch (notificationError) {
        console.warn('Could not send job posted notification:', notificationError);
      }

      showSuccess(t('job.postSuccess', 'Job posted successfully!'));
      if (refreshJobs) await refreshJobs();
      navigate('/my-jobs');

    } catch (error) {
      console.error('Failed to post job:', error);
      showError(t('job.postError', 'Failed to post job. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">{t('common.accessDenied', 'Access Denied')}</h2>
          <p className="text-gray-600 mb-4">{t('job.employerOnly', 'Only employers can post jobs.')}</p>
          <Button onClick={() => navigate('/home')}>{t('common.goToHome', 'Go to Home')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm p-4 border-b sticky top-0 z-10">
        <div className="flex items-center space-x-3 max-w-2xl mx-auto">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full" aria-label={t('common.goBack', 'Go back')}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{t('job.postAJob', 'Post a Job')}</h1>
            <p className="text-sm text-gray-500">{t('job.findWorkersHint', 'Find the right workers for your job')}</p>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('job.jobInformation', 'Job Information')}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">{t('job.jobTitle', 'Job Title')} *</Label>
                <Input id="title" placeholder={t('job.titlePlaceholder', 'e.g., Construction Worker')} value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_id">{t('job.category', 'Category')} *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder={categoriesLoading ? t('common.loading', 'Loading...') : t('job.selectCategory', 'Select category')} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <LoadingSpinner />
                          <span className="ml-2">{t('job.loadingCategories', 'Loading categories...')}</span>
                        </div>
                      ) : categoriesError ? (
                        <div className="p-4 text-red-500 text-center">
                          {t('job.errorLoadingCategories', 'Error loading categories')}
                        </div>
                      ) : (
                        categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="location">{t('job.location', 'Location')}</Label>
                  <div className="relative">
                    <Input id="location" placeholder={t('job.locationPlaceholder', 'e.g., Mumbai, India')} value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" 
                      onClick={handleDetectLocation} 
                      disabled={isDetectingLocation}
                      aria-label={t('job.detectLocation', 'Detect location')}
                    >
                      {isDetectingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('job.jobDetails', 'Job Details')}</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="description">{t('job.description', 'Description')} *</Label>
                    <Textarea id="description" placeholder={t('job.descriptionPlaceholder', 'Describe job responsibilities...')} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="requirements">{t('job.requirements', 'Requirements (comma-separated)')}</Label>
                    <Textarea id="requirements" placeholder={t('job.requirementsPlaceholder', 'e.g., Own vehicle, 2 years experience')} value={formData.requirements} onChange={(e) => handleInputChange('requirements', e.target.value)} />
                </div>
            </div>
          </Card>
          
          <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">{t('job.salary', 'Salary')}</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salary_min">{t('job.salaryMin', 'Minimum Salary')} *</Label>
                      <Input id="salary_min" type="number" placeholder="500" value={formData.salary_min} onChange={(e) => handleInputChange('salary_min', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="salary_max">{t('job.salaryMax', 'Maximum Salary')}</Label>
                      <Input id="salary_max" type="number" placeholder="700" value={formData.salary_max} onChange={(e) => handleInputChange('salary_max', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="salary_period">{t('job.salaryPeriod', 'Salary Period')} *</Label>
                      <Select value={formData.salary_period} onValueChange={(value) => handleInputChange('salary_period', value)} required>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">{t('job.perDay', 'per Day')}</SelectItem>
                          <SelectItem value="weekly">{t('job.perWeek', 'per Week')}</SelectItem>
                          <SelectItem value="monthly">{t('job.perMonth', 'per Month')}</SelectItem>
                          <SelectItem value="hourly">{t('job.perHour', 'per Hour')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="urgent" checked={formData.urgent} onCheckedChange={(checked) => handleInputChange('urgent', checked)} />
                    <Label htmlFor="urgent" className="flex items-center gap-2">{t('job.urgentHiring', 'Urgent Hiring')} <Zap className="w-4 h-4 text-yellow-500" /></Label>
                  </div>
                </div>
              </Card>

          <div className="pt-4 sticky bottom-20">
            <Button type="submit" className="w-full h-12 text-lg" disabled={loading || categoriesLoading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('job.postingJob', 'Posting Job...')}</> : t('job.postNow', 'Post Job Now')}
            </Button>
          </div>
        </form>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default PostJob;