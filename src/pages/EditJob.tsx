import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Zap } from 'lucide-react';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useCategories } from '@/hooks/useCategories';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BottomNavigation from '@/components/BottomNavigation';
import { useEmployerJobs } from '@/hooks/useEmployerJobs';
import { useLocalization } from '@/contexts/LocalizationContext';

const EditJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useGlobalToast();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { refreshJobs } = useEmployerJobs();
  const { t } = useLocalization();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [jobNotFound, setJobNotFound] = useState(false);
  const statusOptions = [
    { value: 'active', label: t('job.status.active', 'Active') },
    { value: 'filled', label: t('job.status.filled', 'Filled') },
    { value: 'expired', label: t('job.status.expired', 'Expired') },
    { value: 'draft', label: t('job.status.draft', 'Draft') },
  ];
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    location: '',
    description: '',
    requirements: '',
    salary_min: '',
    salary_max: '',
    salary_period: 'daily',
    urgent: false,
    status: 'active',
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (error || !data) {
        setLoading(false);
        setJobNotFound(true);
        return;
      }
      setFormData({
        title: data.title || '',
        category_id: data.category_id || '',
        location: data.location || '',
        description: data.description || '',
        requirements: (data.requirements || []).join(', '),
        salary_min: data.salary_min ? String(data.salary_min) : '',
        salary_max: data.salary_max ? String(data.salary_max) : '',
        salary_period: data.salary_period || 'daily',
        urgent: !!data.urgent,
        status: data.status || 'active',
      });
      setLoading(false);
    };
    fetchJob();
    // eslint-disable-next-line
  }, [id]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showError(t('job.loginRequired', 'You must be logged in to edit a job.'));
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
        .update({
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id,
          location: formData.location,
          salary_min: Number(formData.salary_min),
          salary_max: formData.salary_max ? Number(formData.salary_max) : null,
          salary_period: formData.salary_period,
          urgent: formData.urgent,
          requirements: formData.requirements.split(',').map(req => req.trim()),
          status: formData.status,
        })
        .eq('id', id);
      if (error) throw error;
      showSuccess(t('job.updateSuccess', 'Job updated successfully!'));
      if (refreshJobs) await refreshJobs();
      if (window.refreshApplications) await window.refreshApplications();
      navigate('/my-jobs');
    } catch (error) {
      showError(t('job.updateError', 'Failed to update job. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'employer') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">Only employers can edit jobs.</p>
          <Button onClick={() => navigate('/home')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">{t('job.loadingDetails', 'Loading job details...')}</p>
        </div>
      </div>
    );
  }

  if (jobNotFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('job.notFoundTitle', 'Job Not Found')}</h2>
          <p className="text-gray-500">{t('job.notFoundDesc', 'The job you\'re looking for doesn\'t exist.')}</p>
          <Button onClick={() => navigate('/my-jobs')} className="mt-4">
            {t('job.backToMyJobs', 'Back to My Jobs')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm p-4 border-b">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full" aria-label="Go back">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Edit Job</h1>
            <p className="text-sm text-gray-500">Update your job post details</p>
          </div>
        </div>
      </div>
      <div className="p-4 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category_id">{t('job.category', 'Category')} *</Label>
                  <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
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
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                </div>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Job Details</h2>
            <div className="space-y-4">
                <div>
                    <Label htmlFor="description">{t('job.description', 'Description')} *</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="requirements">{t('job.requirements', 'Requirements (comma-separated)')}</Label>
                    <Textarea id="requirements" value={formData.requirements} onChange={(e) => handleInputChange('requirements', e.target.value)} />
                </div>
            </div>
          </Card>
          <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Salary</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salary_min">{t('job.salaryMin', 'Minimum Salary')} *</Label>
                      <Input id="salary_min" type="number" value={formData.salary_min} onChange={(e) => handleInputChange('salary_min', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="salary_max">{t('job.salaryMax', 'Maximum Salary')}</Label>
                      <Input id="salary_max" type="number" value={formData.salary_max} onChange={(e) => handleInputChange('salary_max', e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="salary_period">{t('job.salaryPeriod', 'Salary Period')} *</Label>
                      <Select value={formData.salary_period} onValueChange={(value) => handleInputChange('salary_period', value)}>
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
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('job.statusLabel', 'Job Status')}</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">{t('job.status', 'Status')}</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('job.status.select', 'Select status')} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading || categoriesLoading}>
              {loading ? t('job.saving', 'Saving...') : t('job.saveChanges', 'Save Changes')}
            </Button>
          </div>
        </form>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default EditJob; 