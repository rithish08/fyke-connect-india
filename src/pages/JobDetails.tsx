
import React, { useState, useEffect } from 'react';
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

interface JobDetail {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  salaryPeriod: string;
  postedTime: string;
  urgent: boolean;
  category: string;
  description: string;
  requirements: string[];
  benefits: string[];
  workType: string;
  experience: string;
  contactPerson: string;
  contactPhone: string;
  totalPositions: number;
  applicationsReceived: number;
}

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [applied, setApplied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock job data - in real app, this would come from Supabase
  const mockJob: JobDetail = {
    id: id || '1',
    title: 'Construction Worker',
    company: 'ABC Construction Pvt Ltd',
    location: 'Bangalore, Karnataka',
    salary: '800',
    salaryPeriod: 'day',
    postedTime: '2 hours ago',
    urgent: true,
    category: 'Construction',
    description: 'We are looking for experienced construction workers to join our team for a residential project. The ideal candidate should have experience in masonry, concrete work, and basic construction activities.',
    requirements: [
      'Minimum 2 years of construction experience',
      'Knowledge of basic construction tools',
      'Physical fitness and ability to work outdoors',
      'Good communication skills in Hindi/English',
      'Own transportation preferred'
    ],
    benefits: [
      'Daily payment',
      'Free lunch provided',
      'Overtime compensation',
      'Performance bonuses',
      'Medical assistance'
    ],
    workType: 'Full-time',
    experience: '2+ years',
    contactPerson: 'Rajesh Kumar',
    contactPhone: '+91 9876543210',
    totalPositions: 5,
    applicationsReceived: 12
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJob(mockJob);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleApply = () => {
    if (applied) return;
    
    setApplied(true);
    toast({
      title: "Application Requested!",
      description: `Your request for ${job?.title} has been sent to the employer.`,
    });
  };

  const handleChat = () => {
    toast({
      title: "Starting Conversation",
      description: `Opening chat with ${job?.company}...`,
    });
    navigate(`/messages?jobId=${job?.id}&company=${job?.company}`);
  };

  const handleCall = () => {
    if (job?.contactPhone) {
      window.open(`tel:${job.contactPhone}`, '_self');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Job link copied to clipboard",
      });
    }
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast({
      title: bookmarked ? "Removed from Bookmarks" : "Added to Bookmarks",
      description: bookmarked ? "Job removed from your bookmarks" : "Job added to your bookmarks",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-500">The job you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/search')} className="mt-4">
            Browse Jobs
          </Button>
        </div>
      </div>
    );
  }

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
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className="p-2"
            >
              <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current text-blue-500' : ''}`} />
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
                  <span>Posted {job.postedTime}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{job.salary}</div>
              <div className="text-sm text-gray-500">per {job.salaryPeriod}</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
            <Badge variant="outline">{job.category}</Badge>
            <Badge variant="outline">{job.workType}</Badge>
            <Badge variant="outline">{job.experience}</Badge>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span>{job.applicationsReceived} applied</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>{job.totalPositions} positions available</span>
            </div>
          </div>
        </Card>

        {/* Description */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </Card>

        {/* Requirements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h2>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{req}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Benefits */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h2>
          <ul className="space-y-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Contact Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h2>
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {job.contactPerson.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-gray-900">{job.contactPerson}</h3>
              <p className="text-sm text-gray-500">Hiring Manager</p>
              <p className="text-sm text-gray-600">{job.contactPhone}</p>
            </div>
          </div>
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
              {applied ? '✓ Requested' : 'Apply Now'}
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
        </div>
      )}

      <BottomNavigation />
    </div>
  );
};

export default JobDetails;
