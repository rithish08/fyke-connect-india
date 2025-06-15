
import React, { useState } from 'react';
import { Star, MapPin, Clock, Shield, MessageCircle, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { useScreenNavigation } from '@/hooks/useScreenNavigation';

interface Worker {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  rating: number;
  hourlyRate?: number;
  responseTime?: string;
  skills: string[];
  verified?: boolean;
  availability?: 'available' | 'busy' | 'offline';
  profilePhoto?: string;
  completedJobs?: number;
  isOnline?: boolean;
}

interface UnifiedWorkerCardProps {
  worker: Worker;
  onHire?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  showQuickActions?: boolean;
}

const UnifiedWorkerCard: React.FC<UnifiedWorkerCardProps> = ({ 
  worker, 
  onHire, 
  onMessage, 
  onViewProfile,
  showQuickActions = true
}) => {
  const { user, isAuthenticated, getCurrentUserRole } = useAuth();
  const { showSuccess, showError } = useGlobalToast();
  const { goTo } = useScreenNavigation();
  const [requestState, setRequestState] = useState<'idle' | 'requested'>('idle');

  const currentRole = getCurrentUserRole();

  const handleHire = () => {
    if (!isAuthenticated) {
      localStorage.setItem('fyke_return_intent', `/worker/${worker.id}`);
      showError('Please login to hire workers');
      goTo('/login');
      return;
    }

    if (currentRole !== 'employer') {
      showError('Switch to employer mode to hire workers');
      return;
    }

    setRequestState('requested');
    showSuccess(`Hire request sent to ${worker.name}!`);
    if (onHire) onHire();
  };

  const handleMessage = () => {
    if (!isAuthenticated) {
      showError('Please login to message workers');
      goTo('/login');
      return;
    }
    
    if (onMessage) {
      onMessage();
    } else {
      goTo(`/messages?workerId=${worker.id}&name=${worker.name}`);
    }
  };

  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile();
    } else {
      goTo(`/worker/${worker.id}`, { state: { worker } });
    }
  };

  const handleCall = () => {
    showSuccess('Call feature coming soon!');
  };

  const getAvailabilityColor = (availability?: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'busy': return 'bg-yellow-100 text-yellow-700';
      case 'offline': return 'bg-gray-100 text-gray-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <ModernCard className="p-4 mb-3 hover:shadow-lg transition-all duration-200">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
              <AvatarImage src={worker.profilePhoto || "/placeholder.svg"} alt={worker.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {worker.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {worker.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Shield className="w-3 h-3 text-white" fill="currentColor" />
              </div>
            )}
            {worker.isOnline && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-900 text-lg truncate">{worker.name}</h3>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-yellow-700 font-medium text-sm">{worker.rating}</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-1">{worker.category}</p>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {worker.distance}
              </span>
              {worker.responseTime && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {worker.responseTime}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Skills & Rate */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {worker.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                {skill}
              </Badge>
            ))}
            {worker.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{worker.skills.length - 3} more
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {worker.hourlyRate && (
                <span className="font-semibold text-green-600">₹{worker.hourlyRate}/hr</span>
              )}
              {worker.completedJobs && (
                <span className="text-sm text-gray-500">{worker.completedJobs} jobs completed</span>
              )}
            </div>
            
            {worker.availability && (
              <Badge className={`text-xs ${getAvailabilityColor(worker.availability)}`}>
                {worker.availability}
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        {showQuickActions && currentRole === 'employer' && (
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <Button
                onClick={handleHire}
                disabled={requestState === 'requested'}
                className={`flex-1 h-10 rounded-xl font-medium transition-all ${
                  requestState === 'requested'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {requestState === 'requested' ? 'Request Sent ✓' : 'Hire Now'}
              </Button>
              <Button
                onClick={handleViewProfile}
                variant="outline"
                className="px-4 h-10 rounded-xl border-gray-200"
              >
                View Profile
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleMessage}
                variant="outline"
                size="sm"
                className="flex-1 h-8 rounded-lg"
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Chat
              </Button>
              <Button
                onClick={handleCall}
                variant="outline"
                size="sm"
                className="flex-1 h-8 rounded-lg"
              >
                <Phone className="w-3 h-3 mr-1" />
                Call
              </Button>
            </div>
          </div>
        )}
      </div>
    </ModernCard>
  );
};

export default UnifiedWorkerCard;
