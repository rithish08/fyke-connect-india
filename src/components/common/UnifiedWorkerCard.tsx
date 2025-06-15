
import React from 'react';
import { Star, MapPin, Clock, MessageCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AestheticCard } from '@/components/ui/aesthetic-card';

interface Worker {
  id: string;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  distance: string;
  responseTime: string;
  hourlyRate: number;
  isOnline: boolean;
  completedJobs: number;
  verificationLevel: 'basic' | 'verified' | 'premium';
}

interface UnifiedWorkerCardProps {
  worker: Worker;
  onHire?: () => void;
  onMessage?: () => void;
  onViewProfile?: () => void;
  compact?: boolean;
}

const UnifiedWorkerCard: React.FC<UnifiedWorkerCardProps> = ({ 
  worker, 
  onHire, 
  onMessage, 
  onViewProfile,
  compact = false 
}) => {
  return (
    <AestheticCard 
      variant="elevated" 
      className={`cursor-pointer transition-all duration-300 ${compact ? 'p-4' : 'p-6'}`}
      onClick={onViewProfile}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start space-x-3">
          <div className="relative">
            <Avatar className={`border-2 border-gray-100 ${compact ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <AvatarImage src="/placeholder.svg" alt={worker.name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                {worker.name?.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {worker.verificationLevel !== 'basic' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Shield className="w-2.5 h-2.5 text-white" fill="currentColor" />
              </div>
            )}
            {worker.isOnline && (
              <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className={`font-bold text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'}`}>
                {worker.name}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="font-bold text-sm">{worker.rating}</span>
              </div>
            </div>
            
            <div className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'} mb-1`}>
              {worker.category}
            </div>
            
            <div className={`flex items-center space-x-3 text-gray-500 ${compact ? 'text-xs' : 'text-xs'}`}>
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
            <div className={`font-bold text-green-600 ${compact ? 'text-sm' : 'text-base'}`}>
              ₹{worker.hourlyRate}
            </div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {worker.skills?.slice(0, compact ? 2 : 3).map((skill: string, index: number) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className={`bg-blue-50 text-blue-700 border-blue-200 ${compact ? 'text-xs px-1 py-0' : 'text-xs px-2 py-0.5'}`}
            >
              {skill}
            </Badge>
          ))}
          {worker.skills?.length > (compact ? 2 : 3) && (
            <Badge variant="outline" className={compact ? 'text-xs px-1 py-0' : 'text-xs px-2 py-0.5'}>
              +{worker.skills.length - (compact ? 2 : 3)}
            </Badge>
          )}
        </div>

        {/* Status & Actions */}
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
              className={`${compact ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-xs'}`}
              onClick={(e) => {
                e.stopPropagation();
                onMessage?.();
              }}
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button
              size="sm"
              className={`bg-blue-600 hover:bg-blue-700 ${compact ? 'h-7 px-2 text-xs' : 'h-8 px-3 text-xs'}`}
              onClick={(e) => {
                e.stopPropagation();
                onHire?.();
              }}
            >
              Hire
            </Button>
          </div>
        </div>
      </div>
    </AestheticCard>
  );
};

export default UnifiedWorkerCard;
