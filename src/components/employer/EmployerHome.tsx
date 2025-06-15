
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalization } from '@/contexts/LocalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NearbyWorkersSection from './NearbyWorkersSection';
import QuickActions from './QuickActions';
import { MapPin, Clock, TrendingUp, Users, Briefcase, Star } from 'lucide-react';

const EmployerHome = () => {
  const { user } = useAuth();
  const { t } = useLocalization();
  const [stats, setStats] = useState({
    activeJobs: 5,
    totalApplications: 28,
    hiredWorkers: 12
  });

  return (
    <div className="space-y-6 px-4">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold">
            {t('home.welcome', 'Welcome back')}, {user?.name}!
          </h1>
          <p className="text-green-100">
            {t('home.employer_subtitle', 'Manage your hiring needs')}
          </p>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{user?.location || 'Mumbai, Maharashtra'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{t('home.hiring_now', 'Hiring now')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.activeJobs}</div>
          <div className="text-xs text-gray-600">{t('home.active_jobs', 'Active Jobs')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalApplications}</div>
          <div className="text-xs text-gray-600">{t('home.applications', 'Applications')}</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.hiredWorkers}</div>
          <div className="text-xs text-gray-600">{t('home.hired', 'Hired')}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Nearby Workers */}
      <NearbyWorkersSection />

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>{t('home.recent_activity', 'Recent Activity')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'New application for Construction Worker', time: '2h ago', type: 'application' },
              { action: 'Worker completed job in Plumbing', time: '4h ago', type: 'completion' },
              { action: 'Posted new job: Electrician needed', time: '6h ago', type: 'posting' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  activity.type === 'application' ? 'bg-blue-100' :
                  activity.type === 'completion' ? 'bg-green-100' : 'bg-purple-100'
                }`}>
                  {activity.type === 'application' ? <Users className="w-4 h-4 text-blue-600" /> :
                   activity.type === 'completion' ? <Star className="w-4 h-4 text-green-600" /> :
                   <Briefcase className="w-4 h-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployerHome;
