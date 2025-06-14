import { useEffect, useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";

const JobSeekerHome = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const { user } = useAuth();

  // Mock job data
  const allJobs = [
    {
      id: 1,
      title: 'Construction Worker Needed',
      company: 'BuildPro Construction',
      location: 'Mumbai, Maharashtra',
      distance: '2.3 km',
      salary: '₹500-700/day',
      type: 'Full Time',
      urgent: true,
      applications: 12,
      postedTime: '2 hours ago',
      description: 'Experience in cement work and basic construction required',
      category: 'Construction'
    },
    {
      id: 2,
      title: 'Delivery Executive',
      company: 'QuickDelivery Services',
      location: 'Pune, Maharashtra',
      distance: '5.1 km',
      salary: '₹400-600/day',
      type: 'Part Time',
      urgent: false,
      applications: 8,
      postedTime: '4 hours ago',
      description: 'Own vehicle required, flexible timing',
      category: 'Delivery'
    },
    {
      id: 3,
      title: 'Office Cleaner',
      company: 'CleanSweep Solutions',
      location: 'Thane, Maharashtra',
      distance: '3.5 km',
      salary: '₹300-500/day',
      type: 'Part Time',
      urgent: false,
      applications: 5,
      postedTime: '6 hours ago',
      description: 'Experience in office cleaning preferred',
      category: 'Cleaning'
    },
    {
      id: 4,
      title: 'Security Guard',
      company: 'SecureGuard Services',
      location: 'Mumbai, Maharashtra',
      distance: '1.8 km',
      salary: '₹400-600/day',
      type: 'Full Time',
      urgent: true,
      applications: 15,
      postedTime: '1 hour ago',
      description: 'Valid security license required',
      category: 'Security'
    },
    {
      id: 5,
      title: 'Warehouse Worker',
      company: 'Swift Logistics',
      location: 'Navi Mumbai, Maharashtra',
      distance: '6.2 km',
      salary: '₹450-650/day',
      type: 'Full Time',
      urgent: false,
      applications: 10,
      postedTime: '3 hours ago',
      description: 'Experience in warehouse operations preferred',
      category: 'Warehouse'
    },
    {
      id: 6,
      title: 'Construction Helper',
      company: 'BuildPro Construction',
      location: 'Mumbai, Maharashtra',
      distance: '2.3 km',
      salary: '₹400-600/day',
      type: 'Full Time',
      urgent: false,
      applications: 7,
      postedTime: '5 hours ago',
      description: 'Assisting skilled workers in construction projects',
      category: 'Construction'
    },
    {
      id: 7,
      title: 'Delivery Driver',
      company: 'QuickDelivery Services',
      location: 'Pune, Maharashtra',
      distance: '5.1 km',
      salary: '₹500-700/day',
      type: 'Part Time',
      urgent: true,
      applications: 18,
      postedTime: '30 minutes ago',
      description: 'Delivering packages to customers',
      category: 'Delivery'
    },
    {
      id: 8,
      title: 'Home Cleaner',
      company: 'CleanSweep Solutions',
      location: 'Thane, Maharashtra',
      distance: '3.5 km',
      salary: '₹350-550/day',
      type: 'Part Time',
      urgent: false,
      applications: 6,
      postedTime: '7 hours ago',
      description: 'Cleaning homes and apartments',
      category: 'Cleaning'
    },
    {
      id: 9,
      title: 'Night Security Guard',
      company: 'SecureGuard Services',
      location: 'Mumbai, Maharashtra',
      distance: '1.8 km',
      salary: '₹450-650/day',
      type: 'Full Time',
      urgent: true,
      applications: 20,
      postedTime: '45 minutes ago',
      description: 'Ensuring security during night hours',
      category: 'Security'
    },
    {
      id: 10,
      title: 'Warehouse Assistant',
      company: 'Swift Logistics',
      location: 'Navi Mumbai, Maharashtra',
      distance: '6.2 km',
      salary: '₹400-600/day',
      type: 'Full Time',
      urgent: false,
      applications: 9,
      postedTime: '4 hours ago',
      description: 'Assisting in warehouse operations',
      category: 'Warehouse'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setJobs(allJobs);
    }, 500);
  }, []);

  // Filter jobs only by user's selected categories
  const activeCategories = (user?.categories || []);
  const jobsToShow = jobs.filter(job => activeCategories.length === 0 || activeCategories.includes(job.category));

  // Shimmer loader
  if (jobs.length === 0) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-100 rounded-2xl h-36 animate-pulse w-full max-w-2xl mx-auto" />
        ))}
      </div>
    );
  }

  const handleJobClick = (id: number) => {
    navigate(`/job/${id}`);
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Simple banner ad placeholder */}
      <div className="rounded-xl bg-yellow-100 p-3 text-center text-xs font-semibold text-yellow-700 my-2">Ad: Get 5% off your first hire. <button className="ml-2 underline text-yellow-800">Learn more</button></div>
      {jobsToShow.map((job) => (
        <ModernCard
          key={job.id}
          className="cursor-pointer hover:scale-[1.01] transition-all duration-200 relative overflow-hidden bg-white shadow border border-gray-100 rounded-2xl"
          onClick={() => handleJobClick(job.id)}
        >
          {job.urgent && (
            <div className="absolute top-0 right-0 w-16 h-16">
              <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          )}
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-lg">{job.title}</h3>
                  {job.urgent && (
                    <Badge variant="destructive" className="text-xs rounded-full">
                      Urgent
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-medium">{job.company}</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-700 text-lg">{job.salary}</div>
                <div className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{job.type}</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span className="flex items-center space-x-1">
                <span>📍</span>
                <span>{job.location}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🚶</span>
                <span>{job.distance}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>🕐</span>
                <span>{job.postedTime}</span>
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{job.applications} applications</span>
                <span className="flex items-center space-x-1">
                  <span>⚡</span>
                  <span>Quick apply</span>
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="text-xs rounded-xl border-gray-200">
                  💾 Save
                </Button>
                <Button size="sm" className="text-xs bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </ModernCard>
      ))}
      {jobsToShow.length === 0 && (
        <div className="text-center text-gray-400 py-12">No jobs available in your selected categories.</div>
      )}
    </div>
  );
};

export default JobSeekerHome;
