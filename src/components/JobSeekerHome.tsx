
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ModernCard } from '@/components/ui/modern-card';
import { FloatingCard } from '@/components/ui/floating-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Clock, TrendingUp, Zap, Star } from 'lucide-react';

const JobSeekerHome = () => {
  const { userProfile } = useAuth();
  const navigate = useNavigate();
  const [availability, setAvailability] = useState(userProfile?.availability || 'available');

  const availabilityOptions = [
    { value: 'available', label: 'Available', color: 'bg-green-500', textColor: 'text-green-700' },
    { value: 'busy', label: 'Busy', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-500', textColor: 'text-gray-700' }
  ];

  const currentAvailability = availabilityOptions.find(opt => opt.value === availability);

  const recentJobs = [
    {
      id: 1,
      title: 'Plumbing Repair',
      location: 'Koramangala',
      distance: '2.3 km',
      rate: '₹500/hr',
      urgent: true,
      rating: 4.8
    },
    {
      id: 2,
      title: 'Home Cleaning',
      location: 'Indiranagar',
      distance: '1.8 km',
      rate: '₹300/hr',
      urgent: false,
      rating: 4.5
    },
    {
      id: 3,
      title: 'AC Repair',
      location: 'BTM Layout',
      distance: '3.1 km',
      rate: '₹600/hr',
      urgent: true,
      rating: 4.9
    }
  ];

  return (
    <div className="space-y-6 px-4 pb-20">
      {/* Availability Status Card */}
      <FloatingCard variant="glow" size="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Status</h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${currentAvailability?.color}`} />
            <span className={`text-sm font-medium ${currentAvailability?.textColor}`}>
              {currentAvailability?.label}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {availabilityOptions.map((option) => (
            <Button
              key={option.value}
              variant={availability === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAvailability(option.value)}
              className={`rounded-xl transition-all duration-200 ${
                availability === option.value 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mr-2 ${option.color}`} />
              {option.label}
            </Button>
          ))}
        </div>
      </FloatingCard>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <ModernCard 
          variant="selection" 
          className="p-4 cursor-pointer"
          onClick={() => navigate('/search')}
        >
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Search className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Find Jobs</h3>
              <p className="text-xs text-gray-600">Search nearby opportunities</p>
            </div>
          </div>
        </ModernCard>

        <ModernCard 
          variant="selection" 
          className="p-4 cursor-pointer"
          onClick={() => navigate('/my-jobs')}
        >
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Jobs</h3>
              <p className="text-xs text-gray-600">View your applications</p>
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Earnings Overview */}
      <FloatingCard variant="gradient" size="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">₹2,400</p>
            <p className="text-xs text-gray-600">Earned</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">6</p>
            <p className="text-xs text-gray-600">Jobs Done</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">4.8</p>
            <p className="text-xs text-gray-600">Rating</p>
          </div>
        </div>
      </FloatingCard>

      {/* Recent Job Opportunities */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Opportunities</h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {recentJobs.map((job) => (
            <ModernCard key={job.id} variant="default" className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    {job.urgent && (
                      <Badge className="bg-red-100 text-red-700 text-xs px-2 py-1">
                        <Zap className="w-3 h-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <span>•</span>
                    <span>{job.distance}</span>
                    <span>•</span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" />
                      {job.rating}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900">{job.rate}</p>
                  <Button size="sm" className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl">
                    Apply
                  </Button>
                </div>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerHome;
