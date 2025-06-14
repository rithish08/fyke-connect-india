
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import BottomNavigation from '@/components/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const navigate = useNavigate();
  const { user } = useAuth();

  const jobs = [
    {
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
      description: 'Experience in cement work and basic construction'
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
      description: 'Own vehicle required, flexible timing'
    },
    {
      id: 3,
      title: 'Office Cleaner',
      company: 'CleanSpot Services',
      location: 'Bangalore, Karnataka',
      distance: '1.8 km',
      salary: '₹300-400/day',
      type: 'Full Time',
      urgent: false,
      applications: 15,
      postedTime: '1 day ago',
      description: 'Experience in office cleaning preferred'
    },
    {
      id: 4,
      title: 'Security Guard',
      company: 'SecureMax Solutions',
      location: 'Chennai, Tamil Nadu',
      distance: '3.2 km',
      salary: '₹450-550/day',
      type: 'Night Shift',
      urgent: true,
      applications: 6,
      postedTime: '3 hours ago',
      description: 'Night shift, experience required'
    }
  ];

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Warehouse', 'Manufacturing'
  ];

  const handleJobClick = (jobId: number) => {
    navigate(`/job/${jobId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          {user?.role === 'employer' ? 'Find Workers' : 'Find Jobs'}
        </h1>
        
        {/* Search Bar */}
        <div className="space-y-3">
          <Input
            placeholder={user?.role === 'employer' ? 'Search for workers...' : 'Search for jobs...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-2xl border-gray-200 h-12"
          />
          
          <div className="flex space-x-2">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 rounded-2xl border-gray-200"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32 rounded-2xl border-gray-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 rounded-xl border-gray-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <span className="text-sm text-gray-600">{jobs.length} results</span>
        </div>
      </div>

      {/* Job Listings */}
      <div className="p-4 space-y-4">
        {jobs.map((job) => (
          <ModernCard 
            key={job.id} 
            variant="glass"
            className="cursor-pointer hover:scale-[1.01] transition-all duration-200 relative overflow-hidden"
            onClick={() => handleJobClick(job.id)}
          >
            {job.urgent && (
              <div className="absolute top-0 right-0 w-16 h-16">
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Job Header */}
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
                  <p className="text-sm text-gray-600 font-medium">{job.company}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600 text-lg">{job.salary}</div>
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{job.type}</div>
                </div>
              </div>

              {/* Location and Distance */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
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

              {/* Job Description */}
              <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>

              {/* Job Stats and Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{job.applications} applications</span>
                  <span className="flex items-center space-x-1">
                    <span>⚡</span>
                    <span>Quick apply</span>
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-xs rounded-xl border-gray-200">
                    💾 Save
                  </Button>
                  <Button size="sm" className="text-xs bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-xl">
                    {user?.role === 'employer' ? 'Contact' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Load More */}
      <div className="p-4">
        <Button variant="outline" className="w-full rounded-2xl border-gray-200 h-12">
          Load More Jobs
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default JobSearch;
