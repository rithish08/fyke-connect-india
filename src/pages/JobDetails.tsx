
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { ArrowLeft, MapPin, Clock, DollarSign, User, Star, MessageCircle, Phone } from 'lucide-react';
import { mockJobs } from '@/data/mockData';
import BottomNavigation from '@/components/BottomNavigation';

const JobDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showSuccess, showError } = useGlobalToast();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Find job from mock data
    setTimeout(() => {
      const allJobs = Object.values(mockJobs).flat();
      const foundJob = allJobs.find(j => j?.id === id);
      
      if (foundJob) {
        // Add employer info
        const jobWithEmployer = {
          ...foundJob,
          employer: {
            name: foundJob.company || 'Unknown Company',
            rating: 4.5,
            totalReviews: 23,
            verified: true
          }
        };
        setJob(jobWithEmployer);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApply = async () => {
    if (user?.role !== 'jobseeker') {
      showError('Only job seekers can apply for jobs');
      return;
    }

    if (!job) {
      showError('Job not found');
      return;
    }

    // Store application
    const applications = JSON.parse(localStorage.getItem('fyke_applications') || '[]');
    const newApplication = {
      id: Date.now().toString(),
      jobId: job.id,
      jobTitle: job.title || 'Unknown Job',
      appliedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    applications.push(newApplication);
    localStorage.setItem('fyke_applications', JSON.stringify(applications));
    
    setApplied(true);
    showSuccess('Application submitted successfully!');
  };

  const handleMessage = () => {
    if (!job) return;
    
    const employerId = job.employerId || 'unknown';
    const companyName = job.company || 'Company';
    navigate(`/messages?chatWith=${employerId}&name=${companyName}&type=employer`);
  };

  const handleCall = () => {
    if (!job) return;
    showSuccess('Calling employer...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Job not found</h2>
          <Button onClick={() => navigate('/search')}>Back to Search</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Job Details</h1>
          </div>
        </div>
      </div>

      <div className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Job Header */}
        <Card className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title || 'Job Title'}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{job.company || 'Company'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location || 'Location'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.postedTime || 'Recently'}</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={job.urgent ? "destructive" : "secondary"}>
                  {job.urgent ? 'Urgent' : 'Regular'}
                </Badge>
                <Badge variant="outline">{job.category || 'General'}</Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{job.salary || '0'}</div>
              <div className="text-sm text-gray-500">per {job.salaryPeriod || 'day'}</div>
            </div>
          </div>
        </Card>

        {/* Job Description */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Job Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {job.description || 'Job description not available.'}
          </p>
        </Card>

        {/* Requirements */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">Requirements</h2>
          <ul className="space-y-2 text-gray-700">
            {job.requirements && job.requirements.length > 0 ? (
              job.requirements.map((req: string, index: number) => (
                <li key={index}>• {req}</li>
              ))
            ) : (
              <li>• No specific requirements listed</li>
            )}
          </ul>
        </Card>

        {/* Benefits */}
        {job.benefits && job.benefits.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-3">Benefits</h2>
            <ul className="space-y-2 text-gray-700">
              {job.benefits.map((benefit: string, index: number) => (
                <li key={index}>• {benefit}</li>
              ))}
            </ul>
          </Card>
        )}

        {/* Employer Info */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-3">About Employer</h2>
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold">{job.employer?.name || job.company || 'Employer'}</div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span>{job.employer?.rating || 4.0} rating</span>
                <span>({job.employer?.totalReviews || 0} reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleMessage} className="flex-1">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" size="sm" onClick={handleCall} className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
          </div>
        </Card>

        {/* Apply Button */}
        {user?.role === 'jobseeker' && (
          <div className="fixed bottom-20 left-0 right-0 p-4 bg-white border-t">
            <div className="max-w-2xl mx-auto">
              <Button
                onClick={handleApply}
                disabled={applied}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700"
              >
                {applied ? 'Applied ✓' : 'Apply Now'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default JobDetails;
