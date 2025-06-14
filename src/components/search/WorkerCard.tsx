
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, MessageCircle, Shield } from 'lucide-react';
import WorkerProfileModal from '@/components/modals/WorkerProfileModal';

interface WorkerCardProps {
  worker: any;
  onHire?: (worker: any) => void;
  onMessage?: (worker: any) => void;
}

const WorkerCard = ({ worker, onHire, onMessage }: WorkerCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleQuickHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    onHire?.(worker);
  };

  const handleQuickMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMessage?.(worker);
  };

  return (
    <>
      <ModernCard 
        className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 bg-white rounded-2xl"
        onClick={handleCardClick}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start space-x-3">
            <div className="relative">
              <Avatar className="w-12 h-12 border-2 border-gray-100">
                <AvatarImage src="/placeholder.svg" alt={worker.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                  {worker.name?.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {worker.verificationLevel && worker.verificationLevel !== 'basic' && (
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

          {/* Status */}
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
                onClick={handleQuickMessage}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                Chat
              </Button>
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                onClick={handleQuickHire}
              >
                Hire
              </Button>
            </div>
          </div>
        </div>
      </ModernCard>

      <WorkerProfileModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        worker={worker}
      />
    </>
  );
};

export default WorkerCard;
