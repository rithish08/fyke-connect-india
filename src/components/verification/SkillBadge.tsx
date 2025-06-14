
import React from 'react';
import { CheckCircle, Award, Star } from 'lucide-react';

interface SkillBadgeProps {
  skill: string;
  level: 'beginner' | 'intermediate' | 'expert' | 'certified';
  verified?: boolean;
  rating?: number;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ skill, level, verified = false, rating }) => {
  const getLevelColor = () => {
    switch (level) {
      case 'certified': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'expert': return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getLevelIcon = () => {
    switch (level) {
      case 'certified': return <Award className="w-3 h-3" />;
      case 'expert': return <Star className="w-3 h-3" fill="currentColor" />;
      default: return null;
    }
  };

  return (
    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-xs font-medium ${getLevelColor()}`}>
      {getLevelIcon()}
      <span>{skill}</span>
      {verified && <CheckCircle className="w-3 h-3 text-green-600" />}
      {rating && (
        <span className="text-xs font-bold">
          {rating.toFixed(1)}★
        </span>
      )}
    </div>
  );
};

export default SkillBadge;
