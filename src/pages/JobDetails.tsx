import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Users, 
  Phone, MessageCircle, Share2, Bookmark, 
  Calendar, Briefcase, CheckCircle 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import BottomNavigation from '@/components/BottomNavigation';
import { useLocalization } from '@/contexts/LocalizationContext';
import { notificationService } from '@/services/notificationService';
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/hooks/useJobSeekerJobs';
import { useApplications } from '@/hooks/useApplications';
import { formatDistanceToNow } from 'date-fns';
import WagesPopup from '@/components/profile/setup/WagesPopup';

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateProfile } = useAuth();
  const { t } = useLocalization();
  const { applyToJob, hasApplied } = useApplications();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(() => {
    const bookmarks = JSON.parse(localStorage.getItem('fyke_bookmarks') || '[]');
    return bookmarks.includes(job?.id);
  });
  const [showWagesPopup, setShowWagesPopup] = useState(false);
  
  const fetchJobDetails = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          employer:profiles ( name )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        const fetchedJob: Job = {
          id: data.id,
          title: data.title,
          // @ts-ignore
          company: data.employer?.name || 'A Reputed Company',
          category: data.category_id ? { name: 'General Category' } : { name: 'General Category' },
          salary_min: data.salary_min,
          salary_max: data.salary_max,
          salary_period: (data.salary_period as "hour" | "day" | "week" | "month" | "project") || 'hour',
          location: data.location,
          urgent: data.urgent,
          posted_at: data.created_at,
          created_at: data.created_at,
          requirements: data.requirements || [],
          description: data.description,
          employer_id: data.employer_id,
        };
        setJob(fetchedJob);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
      toast({
        variant: 'destructive',
        title: t('job.loadErrorTitle', 'Error'),
        description: t('job.loadErrorDesc', 'Failed to load job details.'),
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast, t]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleApply = async () => {
    if (!job || !user) return;
    if (hasApplied(job.id)) return;

    await applyToJob(job.id, job.employer_id);
    
    // Send notification for job application
    try {
      await notificationService.sendApplicationNotification();
    } catch (notificationError) {
      console.warn('Could not send application notification:', notificationError);
    }
    
    toast({
      title: t('job.applyRequestedTitle', 'Application Requested!'),
      description: t('job.applyRequestedDesc', 'Your request for {0} has been sent to the employer.', [job.title]),
    });
  };

  const handleChat = () => {
    if (!job) return;
    navigate(`/requests?conversationId=new&participantId=${job.employer_id}`);
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('fyke_bookmarks') || '[]');
    let updated;
    if (bookmarked) {
      updated = bookmarks.filter((id: string) => id !== job.id);
      toast({ title: t('job.bookmarkRemoved', 'Job removed from bookmarks') });
    } else {
      updated = [...bookmarks, job.id];
      toast({ title: t('job.bookmarkAdded', 'Job added to bookmarks') });
    }
    localStorage.setItem('fyke_bookmarks', JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  const handleCall = () => {
    if (job?.employer_phone) {
      window.location.href = `tel:${job.employer_phone}`;
    } else {
      toast({
        title: t('job.phoneNotAvailable', 'Phone number not available'),
        description: t('job.contactViaChat', 'Please contact through chat first.'),
        variant: 'destructive'
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && job) {
      navigator.share({
        title: job.title,
        text: t('job.shareText', 'Check out this job: {0} at {1}', [job.title, job.company]),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: t('job.linkCopiedTitle', 'Link Copied'),
        description: t('job.linkCopiedDesc', 'Job link copied to clipboard'),
      });
    }
  };

  const handleSetWages = () => {
    setShowWagesPopup(true);
  };
  const handleWagesPopupClose = async (wagesData) => {
    setShowWagesPopup(false);
    if (wagesData) {
      await updateProfile({ wages: wagesData });
      toast({ title: t('profile.wagesUpdated', 'Wages updated!') });
    }
  };

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

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('job.notFoundTitle', 'Job Not Found')}</h2>
          <p className="text-gray-500">{t('job.notFoundDesc', 'The job you\'re looking for doesn\'t exist.')}</p>
          <Button onClick={() => navigate('/search')} className="mt-4">
            {t('job.browseJobs', 'Browse Jobs')}
          </Button>
        </div>
      </div>
    );
  }
  
  const applied = hasApplied(job.id);
  
  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white p-4 border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <h1 className="text-lg font-semibold text-gray-900">Job Details</h1>
          
          <div className="flex space-x-2">
            <Button
              variant={bookmarked ? 'default' : 'ghost'}
              size="sm"
              onClick={handleBookmark}
              className="p-2"
            >
              <Bookmark className={'w-5 h-5'} fill={bookmarked ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="p-2"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Job Header Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
                {job.urgent && (
                  <Badge variant="destructive" className="text-xs">
                    Urgent
                  </Badge>
                )}
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Posted {formatDistanceToNow(new Date(job.posted_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{job.salary_max || job.salary_min}</div>
              <div className="text-sm text-gray-500">per {job.salary_period}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <Badge variant="outline">{typeof job.category === 'string' ? job.category : job.category?.name || 'General Category'}</Badge>
            {job.requirements && job.requirements.map((skill: string) => <Badge key={skill} variant="secondary">{skill}</Badge>)}
          </div>
        </Card>

        {/* Job Description */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {job.description}
          </p>
        </Card>

      </div>

      {/* Sticky Bottom Actions */}
      {user?.role === 'jobseeker' && (
        <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-lg">
          <div className="flex space-x-3">
            <Button
              onClick={handleApply}
              disabled={applied}
              className={`flex-1 h-12 ${applied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {applied ? (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Requested
                </>
              ) : 'Apply Now'}
            </Button>
            <Button
              variant="outline"
              onClick={handleSetWages}
              className="h-12 px-4"
            >
              Set Wages
            </Button>
            <Button
              variant="outline"
              onClick={handleChat}
              className="h-12 px-4"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              onClick={handleCall}
              className="h-12 px-4"
            >
              <Phone className="w-5 h-5" />
            </Button>
          </div>
          {/* WagesPopup Modal */}
          {showWagesPopup && (
            <WagesPopup
              categories={user.categories || []}
              onClose={handleWagesPopupClose}
            />
          )}
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default JobDetails;
