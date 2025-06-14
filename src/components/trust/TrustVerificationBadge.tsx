
import React from 'react';
import { Shield, CheckCircle, Star, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TrustVerificationBadgeProps {
  verificationLevel: 'basic' | 'verified' | 'premium' | 'trusted';
  score: number;
  completedJobs: number;
  responseTime: string;
}

const TrustVerificationBadge = ({ 
  verificationLevel, 
  score, 
  completedJobs, 
  responseTime 
}: TrustVerificationBadgeProps) => {
  const getBadgeConfig = () => {
    switch (verificationLevel) {
      case 'trusted':
        return {
          color: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
          icon: Shield,
          text: 'Trusted Pro',
          textColor: 'text-yellow-800'
        };
      case 'premium':
        return {
          color: 'bg-gradient-to-r from-purple-500 to-purple-700',
          icon: Star,
          text: 'Premium',
          textColor: 'text-purple-800'
        };
      case 'verified':
        return {
          color: 'bg-gradient-to-r from-green-500 to-green-700',
          icon: CheckCircle,
          text: 'Verified',
          textColor: 'text-green-800'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-blue-500 to-blue-700',
          icon: Shield,
          text: 'Basic',
          textColor: 'text-blue-800'
        };
    }
  };

  const config = getBadgeConfig();
  const IconComponent = config.icon;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <Badge className={`${config.color} text-white px-3 py-1 rounded-full`}>
          <IconComponent className="w-4 h-4 mr-1" />
          {config.text}
        </Badge>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="font-bold text-gray-900">{score}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-bold text-lg text-gray-900">{completedJobs}</div>
          <div className="text-gray-500">Jobs Done</div>
        </div>
        <div className="text-center">
          <div className="font-bold text-lg text-gray-900 flex items-center justify-center">
            <Clock className="w-4 h-4 mr-1" />
            {responseTime}
          </div>
          <div className="text-gray-500">Response</div>
        </div>
      </div>
    </div>
  );
};

export default TrustVerificationBadge;
