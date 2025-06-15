
import React, { useState } from 'react';
import { Clock, MapPin, Star, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AestheticCard } from '@/components/ui/aesthetic-card';
import TrustScore from '@/components/trust/TrustScore';

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
    // Simulate API call
    setTimeout(() => {
      onHire(worker.id);
      setIsHiring(false);
    }, 1500);
  };

  return (
    <AestheticCard variant="elevated" className="p-4 hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
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
          <div className="font-bold text-lg text-green-600">₹{worker.hourlyRate}/hr</div>
          <div className="text-xs text-gray-500">{worker.distance} away</div>
        </div>
      </div>

      <TrustScore
        score={worker.rating}
        verificationLevel={worker.verificationLevel}
        completedJobs={worker.completedJobs}
        responseTime={worker.responseTime}
        className="mb-3"
      />

      <div className="flex flex-wrap gap-1 mb-3">
        {worker.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleQuickHire}
          disabled={isHiring || !worker.isOnline}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isHiring ? (
            <Clock className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Phone className="w-4 h-4 mr-2" />
          )}
          {isHiring ? 'Connecting...' : 'Quick Hire'}
        </Button>
        <Button
          onClick={() => onMessage(worker.id)}
          variant="outline"
          size="icon"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>

      {worker.isOnline && (
        <div className="mt-2 text-xs text-green-600 font-medium flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
          Available now • Responds in {worker.responseTime}
        </div>
      )}
    </AestheticCard>
  );
};

export default QuickHireCard;
