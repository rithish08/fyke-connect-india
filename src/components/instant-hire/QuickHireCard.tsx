
import React, { useState } from 'react';
import { Clock, MapPin, Star, Phone, MessageCircle, Shield, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ModernCard } from '@/components/ui/modern-card';
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
  successRate?: number;
  lastActive?: string;
}

interface QuickHireCardProps {
  worker: Worker;
  onHire: (workerId: string) => void;
  onMessage: (workerId: string) => void;
}

const QuickHireCard: React.FC<QuickHireCardProps> = ({ worker, onHire, onMessage }) => {
  const [isHiring, setIsHiring] = useState(false);
  const [connectionStep, setConnectionStep] = useState(0);

  const handleQuickHire = async () => {
    setIsHiring(true);
    
    // Simulate multi-step hiring process
    const steps = ['Verifying availability...', 'Sending request...', 'Connecting...'];
    
    for (let i = 0; i < steps.length; i++) {
      setConnectionStep(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    onHire(worker.id);
    setIsHiring(false);
    setConnectionStep(0);
  };

  const getVerificationBadge = () => {
    switch (worker.verificationLevel) {
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">Premium</Badge>;
      case 'verified':
        return <Badge className="bg-blue-100 text-blue-700 text-xs">Verified</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 text-xs">Basic</Badge>;
    }
  };

  const trustPercentage = Math.min(100, (worker.rating / 5) * 100);

  return (
    <ModernCard className="p-4 hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-r from-white to-green-50/30">
      <div className="space-y-4">
        {/* Header with enhanced worker info */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center font-bold text-white text-lg shadow-lg">
                {worker.name[0]}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                {worker.verificationLevel === 'premium' && <Award className="w-3 h-3 text-white" />}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900">{worker.name}</h3>
                {getVerificationBadge()}
              </div>
              <p className="text-sm text-gray-600">{worker.category}</p>
              {worker.lastActive && (
                <p className="text-xs text-gray-500">Active {worker.lastActive}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl text-green-600">₹{worker.hourlyRate}/hr</div>
            <div className="text-xs text-gray-500">{worker.distance} away</div>
          </div>
        </div>

        {/* Enhanced trust indicators */}
        <div className="space-y-3">
          <TrustScore
            score={worker.rating}
            verificationLevel={worker.verificationLevel}
            completedJobs={worker.completedJobs}
            responseTime={worker.responseTime}
            className="mb-2"
          />
          
          {/* Success rate indicator */}
          {worker.successRate && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Success Rate</span>
              <div className="flex items-center gap-2">
                <Progress value={worker.successRate} className="w-16 h-2" />
                <span className="font-medium text-green-600">{worker.successRate}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Skills with better presentation */}
        <div className="flex flex-wrap gap-1">
          {worker.skills.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 font-medium"
            >
              {skill}
            </span>
          ))}
          {worker.skills.length > 4 && (
            <span className="px-3 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
              +{worker.skills.length - 4}
            </span>
          )}
        </div>

        {/* Enhanced action buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleQuickHire}
            disabled={isHiring || !worker.isOnline}
            className="flex-1 bg-green-600 hover:bg-green-700 h-12 rounded-xl font-medium text-white shadow-lg transition-all duration-200"
          >
            {isHiring ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                {connectionStep < 3 ? ['Verifying...', 'Sending...', 'Connecting...'][connectionStep] : 'Connected!'}
              </div>
            ) : (
              <>
                <Phone className="w-4 h-4 mr-2" />
                Quick Hire
              </>
            )}
          </Button>
          <Button
            onClick={() => onMessage(worker.id)}
            variant="outline"
            className="px-4 h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Status and response time */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
          {worker.isOnline ? (
            <div className="flex items-center text-green-600 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
              Available now • Responds in {worker.responseTime}
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <div className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
              Last seen {worker.lastActive || '2 hours ago'}
            </div>
          )}
          
          <div className="flex items-center gap-1 text-gray-500">
            <TrendingUp className="w-3 h-3" />
            <span>Top performer</span>
          </div>
        </div>
      </div>
    </ModernCard>
  );
};

export default QuickHireCard;
