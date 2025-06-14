
import React, { useState } from 'react';
import { Clock, MapPin, Star, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ModernCard } from '@/components/ui/modern-card';

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
  profilePhoto?: string;
}

interface QuickHireCardProps {
  worker: Worker;
  onHire: (workerId: string) => void;
  onMessage: (workerId: string) => void;
}

const QuickHireCard: React.FC<QuickHireCardProps> = ({ worker, onHire, onMessage }) => {
  const [isHiring, setIsHiring] = useState(false);

  const handleQuickHire = async () => {
    setIsHiring(true);
    
    // Simulate hiring process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onHire(worker.id);
    setIsHiring(false);
  };

  return (
    <ModernCard className="p-4 hover:shadow-lg transition-all duration-300">
      <div className="space-y-4">
        {/* Header with worker info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                {worker.name[0]}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{worker.name}</h3>
              <p className="text-sm text-gray-600">{worker.category}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl text-green-600">₹{worker.hourlyRate}/hr</div>
            <div className="text-xs text-gray-500">{worker.distance} away</div>
          </div>
        </div>

        {/* Rating and basic info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span className="font-medium">{worker.rating}</span>
            <span className="text-sm text-gray-500">• {worker.completedJobs} jobs</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{worker.responseTime}</span>
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {worker.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
              +{worker.skills.length - 3}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleQuickHire}
            disabled={isHiring || !worker.isOnline}
            className="flex-1 bg-green-600 hover:bg-green-700 h-10 rounded-lg font-medium text-white"
          >
            {isHiring ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Hiring...
              </div>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Hire
              </>
            )}
          </Button>
          <Button
            onClick={() => onMessage(worker.id)}
            variant="outline"
            className="px-4 h-10 rounded-lg border-gray-200 hover:bg-gray-50"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Status */}
        <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
          {worker.isOnline ? (
            <span className="text-green-600 font-medium">Available now</span>
          ) : (
            <span>Offline</span>
          )}
        </div>
      </div>
    </ModernCard>
  );
};

export default QuickHireCard;
