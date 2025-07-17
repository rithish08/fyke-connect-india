
import { useNavigate } from 'react-router-dom';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkeletonWorkerCard } from '@/components/ui/skeleton-cards';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { Star, MapPin, Clock, MessageCircle, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { mockWorkers } from '@/data/mockData';
import { useCommunication } from '@/contexts/CommunicationContext';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { handleHireRequest } from '@/utils/communicationHandlers';

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
  const { addHireRequest, addSentRequest } = useCommunication();
  const { showSuccess, showError } = useGlobalToast();
  const [hiredWorkers, setHiredWorkers] = useState<Set<string>>(new Set());

  useEffect(() => {
    setTimeout(() => {
      const allWorkers = Object.values(mockWorkers).flat();
      const nearbyWorkers = allWorkers.slice(0, 3).map(worker => ({
        id: worker.id,
        name: worker.name,
        category: worker.category,
        skills: worker.skills,
        rating: worker.rating,
        completedJobs: Math.floor(Math.random() * 100) + 10, // Mock completed jobs
        hourlyRate: worker.hourlyRate,
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)}km`, // Mock distance
        responseTime: `< ${Math.floor(Math.random() * 20) + 5}min`, // Mock response time
        isOnline: Math.random() > 0.3, // Random online status
        verificationLevel: 'verified',
        profilePhoto: null
      }));
      setWorkers(nearbyWorkers);
    }, 1000);
  }, []);

  const handleHire = (worker: Worker) => {
    setHiredWorkers(prev => new Set([...prev, worker.id]));
    handleHireRequest(worker.id, worker.name);
    addHireRequest(worker.id);
    addSentRequest(worker.id);
    showSuccess(`Hire request sent to ${worker.name}!`);
  };

  const handleCommunication = (type: 'chat' | 'call', worker: Worker) => {
    if (!hiredWorkers.has(worker.id)) {
      showError('Please send a hire request first to start communication');
      return;
    }

    if (type === 'chat') {
      navigate(`/messages?chatWith=${worker.id}&name=${worker.name}&type=worker`);
    } else {
      showSuccess('Calling feature available after hire request!');
    }
  };

  return (
    <AnimatedWrapper variant="slide" direction="up" delay={250}>
      <div className="space-y-4 px-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-xl">Top Workers Nearby</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/search')}>
            {t('common.view_all', 'View All')}
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
              <ModernCard key={worker.id} className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white rounded-2xl">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12 border-2 border-gray-100">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                          {worker.name?.split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {worker.isOnline && (
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 truncate">{worker.name}</h3>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          <span className="font-bold text-sm">{worker.rating}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-1">{worker.category}</div>
                      
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{worker.distance}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{worker.responseTime}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-green-600">₹{worker.hourlyRate}</div>
                      <div className="text-xs text-gray-500">per hour</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1">
                    {worker.skills?.slice(0, 3).map((skill: string, index: number) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {skill}
                      </Badge>
                    ))}
                    {worker.skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{worker.skills.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${worker.isOnline ? 'bg-green-400' : 'bg-gray-300'}`}></div>
                      <span className={`text-sm font-medium ${worker.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        {worker.isOnline ? 'Available' : 'Offline'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => handleCommunication('chat', worker)}
                        disabled={!hiredWorkers.has(worker.id)}
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-3 text-xs"
                        onClick={() => handleCommunication('call', worker)}
                        disabled={!hiredWorkers.has(worker.id)}
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleHire(worker)}
                        disabled={hiredWorkers.has(worker.id)}
                      >
                        {hiredWorkers.has(worker.id) ? 'Sent' : 'Hire'}
                      </Button>
                    </div>
                  </div>
                </div>
              </ModernCard>
            ))}
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default NearbyWorkersSection;
