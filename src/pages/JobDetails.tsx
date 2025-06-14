import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock job data - in real app, this would be fetched based on id
  const job = {
    id: 1,
    title: 'Construction Worker',
    company: 'BuildPro Construction',
    location: 'Mumbai, Maharashtra',
    distance: '2.3 km',
    salary: '₹500-700/day',
    type: 'Full Time',
    urgent: true,
    applications: 12,
    postedTime: '2 hours ago',
    description: 'We are looking for experienced construction workers to join our team for upcoming residential projects. The ideal candidate should have experience in cement work, basic construction knowledge, and ability to work in a team environment.',
    requirements: [
      'Minimum 1 year experience in construction',
      'Physical fitness required',
      'Basic knowledge of construction tools',
      'Ability to work 8-10 hours daily',
      'Team player with good communication'
    ],
    benefits: [
      'Daily payment available',
      'Free lunch provided',
      'Overtime opportunities',
      'Safety equipment provided',
      'Transportation allowance'
    ],
    workSchedule: {
      days: 'Monday to Saturday',
      hours: '8:00 AM - 6:00 PM',
      overtime: 'Available on Sundays'
    },
    employer: {
      name: 'BuildPro Construction',
      rating: 4.5,
      totalReviews: 89,
      verified: true,
      responseTime: '2 hours',
      hiredWorkers: 156
    }
  };

  const handleApply = () => {
    toast({
      title: "Application Submitted!",
      description: "Your application has been sent to the employer. You'll be notified of updates.",
    });
  };

  const handleSave = () => {
    toast({
      title: "Job Saved",
      description: "This job has been saved to your favorites.",
    });
  };

  const handleContact = () => {
    navigate('/messages');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            ←
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Job Details</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Job Header Card */}
        <Card className="p-6 shadow border border-gray-100 bg-white">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{job.title}</h2>
                  {job.urgent && (
                    <Badge variant="destructive">Urgent</Badge>
                  )}
                </div>
                <h3 className="text-lg text-gray-700 mb-1">{job.company}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>📍 {job.location}</span>
                  <span>🚶 {job.distance}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{job.salary}</div>
                <div className="text-sm text-gray-600">{job.type}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>🕐 Posted {job.postedTime}</span>
              <span>👥 {job.applications} applications</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow border border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
        </Card>
        <Card className="p-6 shadow border border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-700">
                <span className="text-green-500 mt-1">✓</span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 shadow border border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
          <ul className="space-y-2">
            {job.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-2 text-gray-700">
                <span className="text-blue-500 mt-1">💎</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-6 shadow border border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Work Schedule</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Working Days:</span>
              <span className="font-medium">{job.workSchedule.days}</span>
            </div>
            <div className="flex justify-between">
              <span>Working Hours:</span>
              <span className="font-medium">{job.workSchedule.hours}</span>
            </div>
            <div className="flex justify-between">
              <span>Overtime:</span>
              <span className="font-medium">{job.workSchedule.overtime}</span>
            </div>
          </div>
        </Card>
        <Card className="p-6 shadow border border-gray-100 bg-white">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Employer</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">{job.employer.name}</span>
                {job.employer.verified && (
                  <Badge variant="secondary" className="text-xs">
                    ✓ Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-500">⭐</span>
                <span className="font-medium">{job.employer.rating}</span>
                <span className="text-sm text-gray-500">({job.employer.totalReviews})</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Response Time:</span>
                <div className="font-medium">{job.employer.responseTime}</div>
              </div>
              <div>
                <span className="text-gray-600">Workers Hired:</span>
                <div className="font-medium">{job.employer.hiredWorkers}+</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="flex space-x-3 max-w-md mx-auto">
          <Button
            variant="outline"
            onClick={handleSave}
            className="flex items-center space-x-2"
          >
            <span>💾</span>
            <span>Save</span>
          </Button>
          
          <Button
            variant="outline"
            onClick={handleContact}
            className="flex items-center space-x-2"
          >
            <span>💬</span>
            <span>Message</span>
          </Button>
          
          <Button
            onClick={handleApply}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-2xl"
          >
            {user?.role === 'employer' ? 'Contact Worker' : 'Apply Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
