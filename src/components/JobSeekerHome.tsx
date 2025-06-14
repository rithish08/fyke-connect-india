
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonJobCard } from '@/components/ui/skeleton-cards';
import { useAuth } from '@/contexts/AuthContext';
import { MapPin, Clock, Zap } from 'lucide-react';

const JobSeekerHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      // Example jobs with more details
      const allJobs = [
        { 
          id: 1, 
          title: "Construction Worker Needed", 
          company: "BuildPro Construction",
          category: "Construction", 
          salary: "₹500-700/day",
          location: "Mumbai",
          urgent: true,
          distance: "2.5km",
          postedTime: "2h ago",
          skills: ["Cement Work", "Building"]
        },
        { 
          id: 2, 
          title: "Delivery Executive", 
          company: "QuickDelivery Services",
          category: "Driver", 
          salary: "₹400-600/day",
          location: "Pune",
          urgent: false,
          distance: "1.8km",
          postedTime: "4h ago",
          skills: ["Two Wheeler", "Navigation"]
        },
        { 
          id: 3, 
          title: "Security Guard", 
          company: "SecureMax",
          category: "Security", 
          salary: "₹350-450/day",
          location: "Chennai",
          urgent: false,
          distance: "3.2km",
          postedTime: "6h ago",
          skills: ["Night Shift", "CCTV"]
        },
      ];
      if (user?.categories?.length) {
        setJobs(allJobs.filter(j => user.categories.includes(j.category)));
      } else {
        setJobs(allJobs);
      }
    }, 1200); // fake load
  }, [user]);

  if (!jobs) {
    return (
      <div className="space-y-4 px-4">
        <SkeletonJobCard />
        <SkeletonJobCard />
        <SkeletonJobCard />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Jobs for You</h2>
        <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
          View All
        </Button>
      </div>
      
      {jobs.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
          <p className="text-sm">Try updating your categories in profile settings</p>
        </div>
      )}
      
      {jobs.map(job => (
        <ModernCard key={job.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-bold text-gray-900">{job.title}</h3>
                  {job.urgent && (
                    <Badge variant="destructive" className="text-xs flex items-center">
                      <Zap className="w-3 h-3 mr-1" />
                      URGENT
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{job.company}</p>
                <p className="text-sm text-gray-500 flex items-center mt-1">
                  <MapPin className="w-3 h-3 mr-1" />
                  {job.location}
                </p>
              </div>
              <div className="text-right">
                <div className="font-semibold text-green-600">{job.salary}</div>
                <div className="text-xs text-gray-500 flex items-center mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  {job.postedTime}
                </div>
              </div>
            </div>

            {job.skills && (
              <div className="flex flex-wrap gap-1">
                {job.skills.map((skill, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-xs text-gray-500">{job.distance} away</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button size="sm">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </ModernCard>
      ))}
    </div>
  );
};

export default JobSeekerHome;
