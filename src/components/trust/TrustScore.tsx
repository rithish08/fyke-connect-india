
import React from 'react';
import { Star, Shield, CheckCircle, Clock } from 'lucide-react';

interface TrustScoreProps {
  score: number;
  verificationLevel: 'basic' | 'verified' | 'premium';
  completedJobs: number;
  responseTime: string;
  className?: string;
}

const TrustScore: React.FC<TrustScoreProps> = ({ 
  score, 
  verificationLevel, 
  completedJobs, 
  responseTime, 
  className = "" 
}) => {
  const getVerificationColor = () => {
    switch (verificationLevel) {
      case 'premium': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'verified': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getScoreColor = () => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="flex items-center space-x-1">
        <Star className={`w-4 h-4 ${getScoreColor()}`} fill="currentColor" />
        <span className={`font-bold text-sm ${getScoreColor()}`}>{score.toFixed(1)}</span>
      </div>
      
      <div className={`px-2 py-1 rounded-full border text-xs font-medium ${getVerificationColor()}`}>
        <Shield className="w-3 h-3 inline mr-1" />
        {verificationLevel === 'premium' ? 'Premium' : verificationLevel === 'verified' ? 'Verified' : 'Basic'}
      </div>
      
      <div className="flex items-center text-xs text-gray-500 space-x-2">
        <span className="flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" />
          {completedJobs} jobs
        </span>
        <span className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {responseTime}
        </span>
      </div>
    </div>
  );
};

export default TrustScore;
