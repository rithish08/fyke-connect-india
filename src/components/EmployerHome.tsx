
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonWorkerCard } from '@/components/ui/skeleton-cards';
import TrustIndicators from './TrustIndicators';
import AnimatedWrapper from './AnimatedWrapper';
import CommunicationButtons from '@/components/communication/CommunicationButtons';
import { Star, MapPin, Clock, Users, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

const EmployerHome = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setWorkers([
        {
          id: 'worker-1',
          name: 'Raj Kumar',
          category: 'Construction',
          skills: ['Cement Work', 'Painting', 'Plumbing'],
          rating: 4.8,
          completedJobs: 45,
          hourlyRate: 500,
          distance: '2.1km',
          responseTime: '< 30min',
          isOnline: true,
          verificationLevel: 'verified',
          profilePhoto: null
        },
        {
          id: 'worker-2',
          name: 'Amit Singh',
          category: 'Delivery',
          skills: ['Two Wheeler', 'Navigation', 'Fast Delivery'],
          rating: 4.6,
          completedJobs: 32,
          hourlyRate: 400,
          distance: '1.5km',
          responseTime: '< 1hr',
          isOnline: false,
          verificationLevel: 'basic',
          profilePhoto: null
        }
      ]);
    }, 1000);
  }, []);

  const recentJobs = [
    { title: 'Construction Worker needed', applications: 12, status: 'Active', time: '2 hours ago', type: 'urgent' },
    { title: 'Delivery Executive', applications: 8, status: 'Hiring', time: '4 hours ago', type: 'normal' },
    { title: 'Office Cleaner', applications: 15, status: 'Closed', time: '1 day ago', type: 'completed' }
  ];

  return (
    <div className="space-y-6 px-0 md:px-4">
      {/* Easy Redirect to Workers - Prominent Button */}
      <AnimatedWrapper variant="slide" direction="up" delay={100}>
        <ModernCard 
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105"
          onClick={() => navigate('/search')}
        >
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Find Workers</h3>
                <p className="text-blue-100 text-sm">Browse by category & skills</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">156+</span>
              <div className="text-xs">
                <div>Available</div>
                <div className="text-blue-200">Workers</div>
              </div>
            </div>
          </div>
        </ModernCard>
      </AnimatedWrapper>

      {/* Primary Actions */}
      <AnimatedWrapper variant="slide" direction="up" delay={200}>
        <div className="grid grid-cols-2 gap-4">
          <ModernCard 
            className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
            onClick={() => navigate('/post-job')}
          >
            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Post Job</h4>
                <p className="text-sm text-gray-400">Quick hire</p>
              </div>
            </div>
          </ModernCard>
          
          <ModernCard 
            className="bg-white border shadow rounded-2xl cursor-pointer hover:shadow-lg transition-transform duration-200"
            onClick={() => navigate('/my-jobs')}
          >
            <div className="text-center space-y-3 p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-xl">📋</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">My Posts</h4>
                <p className="text-sm text-gray-400">8 active</p>
              </div>
            </div>
          </ModernCard>
        </div>
      </AnimatedWrapper>

      {/* Available Workers */}
      <AnimatedWrapper variant="slide" direction="up" delay={250}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-xl px-2">Top Workers Nearby</h3>
            <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
              View All
            </Button>
          </div>
          
          {!workers ? (
            <div className="space-y-3">
              <SkeletonWorkerCard />
              <SkeletonWorkerCard />
            </div>
          ) : (
            <div className="space-y-3">
              {workers.map((worker) => (
                <ModernCard key={worker.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                            {worker.profilePhoto ? (
                              <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-600">
                                  {worker.name[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          {worker.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{worker.name}</h4>
                          <p className="text-sm text-gray-600">{worker.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-yellow-600 font-bold text-sm">
                          <Star className="w-3 h-3 mr-1" fill="currentColor" />
                          {worker.rating}
                        </div>
                        <div className="text-xs text-green-600 font-medium">₹{worker.hourlyRate}/hr</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {worker.distance}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {worker.responseTime}
                        </span>
                      </div>
                      <span className="text-blue-600 font-medium">{worker.completedJobs} jobs</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {worker.skills.slice(0, 2).map((skill, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {worker.skills.length > 2 && (
                        <span className="text-xs text-gray-400 px-2 py-1">
                          +{worker.skills.length - 2} more
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <CommunicationButtons
                        targetId={worker.id}
                        targetName={worker.name}
                        targetType="worker"
                        size="sm"
                      />
                    </div>
                  </div>
                </ModernCard>
              ))}
            </div>
          )}
        </div>
      </AnimatedWrapper>

      {/* Recent Activity */}
      <AnimatedWrapper variant="slide" direction="up" delay={300}>
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 text-xl px-2">Recent Activity</h3>
          <div className="space-y-3">
            {recentJobs.map((job, index) => (
              <ModernCard key={index} className="bg-white border shadow rounded-2xl hover:shadow-lg transition-transform duration-200">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      job.type === 'urgent' ? 'bg-red-500 animate-pulse' :
                      job.type === 'normal' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-sm text-gray-500">{job.applications} applications • {job.time}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Active' ? 'bg-green-100 text-green-700' :
                    job.status === 'Hiring' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {job.status}
                  </div>
                </div>
                
                <TrustIndicators className="mt-4" />
              </ModernCard>
            ))}
          </div>
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default EmployerHome;
