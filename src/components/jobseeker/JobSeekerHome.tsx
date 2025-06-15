
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JobSeekerJobCard from './JobSeekerJobCard';
import { Search, MapPin, Clock, TrendingUp, Star, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockJobs } from '@/data/mockData';

const JobSeekerHome = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const navigate = useNavigate();
  const [nearbyJobs, setNearbyJobs] = useState<any[]>([]);
  const [stats, setStats] = useState({
    applications: 12,
    interviews: 3,
    rating: 4.8
  });

  useEffect(() => {
    // Load jobs based on user's categories
    const userCategories = user?.categories || (user?.primaryCategory ? [user.primaryCategory] : []);
    let jobs: any[] = [];
    
    if (userCategories.length > 0) {
      userCategories.forEach(category => {
        const categoryKey = category.toLowerCase();
        if (categoryKey in mockJobs) {
          jobs = [...jobs, ...mockJobs[categoryKey as keyof typeof mockJobs]];
        }
      });
    } else {
      // Show a sample of all jobs if no categories set
      jobs = Object.values(mockJobs).flat();
    }
    
    setNearbyJobs(jobs.slice(0, 5));
  }, [user]);

  return (
    <div className="space-y-6 px-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">
            {t('home.welcome', 'Welcome back')}, {user?.name}!
          </h1>
          <p className="text-blue-100">
            {t('home.jobseeker_subtitle', 'Find your next opportunity')}
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{user?.location || 'Mumbai, Maharashtra'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{t('home.available', 'Available now')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.applications}</div>
          <div className="text-xs text-gray-600">{t('home.applications', 'Applications')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.interviews}</div>
          <div className="text-xs text-gray-600">{t('home.interviews', 'Interviews')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="flex items-center justify-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="text-2xl font-bold text-yellow-600">{stats.rating}</span>
          </div>
          <div className="text-xs text-gray-600">{t('home.rating', 'Rating')}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={() => navigate('/search')}
          className="h-16 bg-blue-600 hover:bg-blue-700 rounded-xl flex flex-col items-center justify-center space-y-1"
        >
          <Search className="w-6 h-6" />
          <span className="text-sm">{t('home.find_jobs', 'Find Jobs')}</span>
        </Button>
        <Button
          onClick={() => navigate('/my-jobs')}
          variant="outline"
          className="h-16 rounded-xl flex flex-col items-center justify-center space-y-1"
        >
          <Users className="w-6 h-6" />
          <span className="text-sm">{t('home.my_applications', 'My Applications')}</span>
        </Button>
      </div>

      {/* Categories */}
      {user?.categories && user.categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('home.your_categories', 'Your Categories')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.categories.map((category, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-900">
            {t('home.recommended_jobs', 'Recommended Jobs')}
          </h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
            {t('home.view_all', 'View All')}
          </Button>
        </div>
        
        {nearbyJobs.length > 0 ? (
          <div className="space-y-3">
            {nearbyJobs.map((job) => (
              <JobSeekerJobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <div className="space-y-2">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-semibold text-gray-900">
                {t('home.no_jobs', 'No jobs found')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('home.complete_profile', 'Complete your profile to see personalized job recommendations')}
              </p>
              <Button
                onClick={() => navigate('/profile-setup')}
                className="mt-4"
              >
                {t('home.complete_profile_button', 'Complete Profile')}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobSeekerHome;
