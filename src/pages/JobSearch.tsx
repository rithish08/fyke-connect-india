
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          {user?.role === 'employer' ? 'Find Workers' : 'Find Jobs'}
        </h1>
        
        {/* Search Bar */}
        <div className="space-y-3">
          <Input
            placeholder={user?.role === 'employer' ? 'Search for workers...' : 'Search for jobs...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
          
          <div className="flex space-x-2">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
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
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
          <Card 
            key={job.id} 
            className="p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleJobClick(job.id)}
          >
            <div className="space-y-3">
              {/* Job Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{job.title}</h3>
                    {job.urgent && (
                      <Badge variant="destructive" className="text-xs">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600">{job.salary}</div>
                  <div className="text-xs text-gray-500">{job.type}</div>
                </div>
              </div>

              {/* Location and Distance */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📍 {job.location}</span>
                <span>🚶 {job.distance}</span>
                <span>🕐 {job.postedTime}</span>
              </div>

              {/* Job Description */}
              <p className="text-sm text-gray-700">{job.description}</p>

              {/* Job Stats and Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>{job.applications} applications</span>
                  <span>⚡ Quick apply</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="text-xs">
                    💾 Save
                  </Button>
                  <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700">
                    {user?.role === 'employer' ? 'Contact' : 'Apply Now'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="p-4">
        <Button variant="outline" className="w-full">
          Load More Jobs
        </Button>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default JobSearch;
