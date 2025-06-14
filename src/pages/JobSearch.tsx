
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
  const [salaryFilter, setSalaryFilter] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  // Different data for job seekers vs employers
  const jobSeekerJobs = [
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
      description: 'Experience in cement work and basic construction required'
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
    }
  ];

  const availableWorkers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      category: 'Construction',
      location: 'Mumbai, Maharashtra',
      distance: '2.3 km',
      experience: '5 years',
      rating: 4.8,
      availability: 'available',
      skills: ['Cement Work', 'Brick Laying'],
      salaryExpectation: '₹500-800/day',
      completedJobs: 89,
      verified: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      category: 'Cleaning',
      location: 'Mumbai, Maharashtra',
      distance: '1.8 km',
      experience: '3 years',
      rating: 4.9,
      availability: 'available',
      skills: ['Office Cleaning', 'Deep Cleaning'],
      salaryExpectation: '₹300-500/day',
      completedJobs: 67,
      verified: true
    }
  ];

  const categories = [
    'Construction', 'Delivery', 'Cleaning', 'Security', 'Warehouse', 'Manufacturing'
  ];

  const data = user?.role === 'jobseeker' ? jobSeekerJobs : availableWorkers;
  const isJobSeeker = user?.role === 'jobseeker';

  const handleItemClick = (id: number) => {
    if (isJobSeeker) {
      navigate(`/job/${id}`);
    } else {
      navigate(`/worker/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          {isJobSeeker ? 'Find Jobs' : 'Find Workers'}
        </h1>
        <div className="space-y-3">
          <Input
            placeholder={isJobSeeker ? 'Search for jobs...' : 'Search for workers...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 h-12 bg-gray-50"
          />
          <div className="flex space-x-2">
            <Input
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 bg-gray-50"
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-32 rounded-lg border border-gray-200 bg-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat.toLowerCase()}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Additional filters */}
          <div className="flex space-x-2">
            <Select value={salaryFilter} onValueChange={setSalaryFilter}>
              <SelectTrigger className="flex-1 rounded-lg border border-gray-200 bg-white">
                <SelectValue placeholder="Salary Range" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="0-300">₹0-300/day</SelectItem>
                <SelectItem value="300-500">₹300-500/day</SelectItem>
                <SelectItem value="500-800">₹500-800/day</SelectItem>
                <SelectItem value="800+">₹800+/day</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 rounded-lg border border-gray-200 bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Latest</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                {!isJobSeeker && <SelectItem value="rating">Rating</SelectItem>}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="bg-white p-4 border-b border-gray-100">
        <span className="text-sm text-gray-400">{data.length} results found</span>
      </div>

      {/* Listings */}
      <div className="p-4 space-y-4">
        {isJobSeeker ? (
          // Job listings for job seekers
          jobSeekerJobs.map((job) => (
            <ModernCard 
              key={job.id} 
              className="cursor-pointer hover:scale-[1.01] transition-all duration-200 relative overflow-hidden bg-white shadow border border-gray-100 rounded-2xl"
              onClick={() => handleItemClick(job.id)}
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
          ))
        ) : (
          // Worker listings for employers
          availableWorkers.map((worker) => (
            <ModernCard 
              key={worker.id} 
              className="cursor-pointer hover:scale-[1.01] transition-all duration-200 bg-white shadow border border-gray-100 rounded-2xl"
              onClick={() => handleItemClick(worker.id)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{worker.name}</h3>
                        {worker.verified && (
                          <Badge className="bg-green-100 text-green-700 text-xs">✓</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{worker.category} • {worker.experience}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-700">{worker.salaryExpectation}</div>
                    <div className="text-xs text-gray-500">⭐ {worker.rating}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span className="flex items-center space-x-1">
                    <span>📍</span>
                    <span>{worker.distance}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💼</span>
                    <span>{worker.completedJobs} jobs</span>
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    worker.availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {worker.availability}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {worker.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      {skill}
                    </Badge>
                  ))}
                  {worker.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600">
                      +{worker.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-400">
                    Available now
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-xs rounded-xl border-gray-200">
                      📞 Contact
                    </Button>
                    <Button size="sm" className="text-xs bg-gray-900 hover:bg-gray-800 text-white rounded-xl">
                      Hire Now
                    </Button>
                  </div>
                </div>
              </div>
            </ModernCard>
          ))
        )}
      </div>

      {/* Load More */}
      <div className="p-4">
        <Button variant="outline" className="w-full rounded-2xl border-gray-200 h-12">
          Load More {isJobSeeker ? 'Jobs' : 'Workers'}
        </Button>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default JobSearch;
