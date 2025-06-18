
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Clock, DollarSign, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { applyToJob, chatWithEmployer, callEmployer } from '@/utils/jobActions';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  postedTime: string;
  urgent?: boolean;
}

const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Delivery Partner',
    company: 'QuickDeliver',
    location: 'Bangalore, KA',
    salary: '₹15,000 - ₹25,000/month',
    type: 'Full-time',
    description: 'Deliver packages across Bangalore city. Must have own vehicle.',
    requirements: ['Own bike/scooter', 'Valid driving license', 'Android phone'],
    postedTime: '2 hours ago',
    urgent: true
  },
  {
    id: '2',
    title: 'Construction Worker',
    company: 'BuildRight Constructions',
    location: 'Mumbai, MH',
    salary: '₹500 - ₹800/day',
    type: 'Contract',
    description: 'General construction work for residential project.',
    requirements: ['Physical fitness', 'Construction experience', 'Local resident'],
    postedTime: '5 hours ago'
  },
  {
    id: '3',
    title: 'House Cleaning',
    company: 'CleanHome Services',
    location: 'Delhi, DL',
    salary: '₹200 - ₹300/hour',
    type: 'Part-time',
    description: 'Professional house cleaning services for residential clients.',
    requirements: ['Experience preferred', 'Reliable', 'Own cleaning supplies'],
    postedTime: '1 day ago'
  }
];

const JobSearchPage = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const handleApply = async (jobId: string) => {
    try {
      await applyToJob(jobId);
      setAppliedJobs(prev => new Set([...prev, jobId]));
      toast({
        title: "Application Sent!",
        description: "Your application has been submitted successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChat = async (jobId: string) => {
    try {
      await chatWithEmployer(jobId);
      toast({
        title: "Chat Started",
        description: "Opening chat with employer..."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start chat. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCall = async (jobId: string) => {
    try {
      await callEmployer(jobId);
      toast({
        title: "Calling...",
        description: "Connecting you with the employer."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to make call. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search jobs, companies, locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Available Jobs</h2>
          <span className="text-sm text-gray-500">{filteredJobs.length} jobs found</span>
        </div>

        {filteredJobs.map((job) => (
          <Card key={job.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {job.urgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{job.company}</p>
                </div>
                <span className="text-xs text-gray-500">{job.postedTime}</span>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  <span>{job.salary}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{job.type}</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm">{job.description}</p>

              <div className="flex flex-wrap gap-2">
                {job.requirements.map((req, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded">
                    {req}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleApply(job.id)}
                  disabled={appliedJobs.has(job.id)}
                  className={`flex-1 ${
                    appliedJobs.has(job.id)
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {appliedJobs.has(job.id) ? 'Applied ✓' : 'Apply Now'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleChat(job.id)}
                  className="px-6"
                >
                  Chat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCall(job.id)}
                  className="px-6"
                >
                  Call
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchPage;
