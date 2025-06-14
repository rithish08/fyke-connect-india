
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  urgency: 'low' | 'medium' | 'high';
  skills: string[];
  distance: string;
  postedTime: string;
  reason: string;
}

const SmartJobRecommendations = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI matching algorithm
    const generateRecommendations = () => {
      const mockRecommendations: JobRecommendation[] = [
        {
          id: '1',
          title: 'Construction Worker',
          company: 'BuildTech Solutions',
          location: 'Bandra, Mumbai',
          salary: '₹800/day',
          matchScore: 95,
          urgency: 'high',
          skills: ['Construction', 'Manual Labor'],
          distance: '2.3 km',
          postedTime: '2 hours ago',
          reason: 'Perfect skill match + nearby location'
        },
        {
          id: '2',
          title: 'Delivery Partner',
          company: 'QuickDeliver',
          location: 'Andheri, Mumbai',
          salary: '₹600/day',
          matchScore: 88,
          urgency: 'medium',
          skills: ['Driving', 'Customer Service'],
          distance: '4.1 km',
          postedTime: '1 hour ago',
          reason: 'High demand in your area'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setLoading(false);
    };

    setTimeout(generateRecommendations, 1000);
  }, [user]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map(i => (
          <div key={i} className="bg-gray-100 rounded-2xl h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Zap className="w-6 h-6 mr-2 text-yellow-500" />
          Smart Matches
        </h2>
        <Badge className="bg-blue-100 text-blue-800">
          <TrendingUp className="w-4 h-4 mr-1" />
          AI Powered
        </Badge>
      </div>

      {recommendations.map((job) => (
        <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-bold text-lg text-gray-900">{job.title}</h3>
                <Badge className={`px-2 py-1 text-xs ${getUrgencyColor(job.urgency)}`}>
                  {job.urgency} priority
                </Badge>
              </div>
              <p className="text-gray-600 font-medium">{job.company}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 mb-1">
                <Star className="w-4 h-4 text-green-500 fill-current" />
                <span className="font-bold text-green-600">{job.matchScore}%</span>
              </div>
              <span className="text-sm text-gray-500">Match</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location} • {job.distance}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {job.postedTime}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-l-blue-400">
              <p className="text-sm text-blue-800 font-medium">
                💡 {job.reason}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-600">{job.salary}</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm">Save</Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Apply Now
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SmartJobRecommendations;
