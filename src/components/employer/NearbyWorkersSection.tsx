
import { useNavigate } from 'react-router-dom';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SkeletonWorkerCard } from '@/components/ui/skeleton-cards';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import CommunicationButtons from '@/components/communication/CommunicationButtons';
import { Star, MapPin, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockWorkers } from '@/data/mockData';

interface Worker {
  id: string;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs: number;
  hourlyRate: number;
  distance: string;
  responseTime: string;
  isOnline: boolean;
  verificationLevel: string;
  profilePhoto: string | null;
}

const NearbyWorkersSection = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      // Get workers from all categories and mix them for nearby display
      const allWorkers = Object.values(mockWorkers).flat();
      const nearbyWorkers = allWorkers.slice(0, 3).map(worker => ({
        ...worker,
        profilePhoto: null
      }));
      setWorkers(nearbyWorkers);
    }, 1000);
  }, []);

  return (
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
              <AestheticCard key={worker.id} variant="elevated" className="p-4 hover:shadow-lg transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center">
                          <span className="text-lg font-bold text-white">
                            {worker.name[0]}
                          </span>
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
              </AestheticCard>
            ))}
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default NearbyWorkersSection;
