
import React from 'react';
import { CheckCircle, Award, Star } from 'lucide-react';
import { getResponsiveTextSize, getFlexibleContainerClass, getResponsivePadding } from '@/utils/textSizing';

interface DynamicSkillBadgeProps {
  skill: string;
  level: 'beginner' | 'intermediate' | 'expert' | 'certified';
  verified?: boolean;
  rating?: number;
}

const DynamicSkillBadge: React.FC<DynamicSkillBadgeProps> = ({ 
  skill, 
  level, 
  verified = false, 
  rating 
}) => {
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
      case 'certified': return <Award className="w-3 h-3 flex-shrink-0" />;
      case 'expert': return <Star className="w-3 h-3 flex-shrink-0" fill="currentColor" />;
      default: return null;
    }
  };

  const skillTextSize = getResponsiveTextSize(skill, {
    baseSize: 12,
    minSize: 10,
    maxSize: 13
  });

  return (
    <div className={`inline-flex items-center space-x-1 border font-medium rounded-full ${getLevelColor()} ${skillTextSize} ${getResponsivePadding(skill)} ${getFlexibleContainerClass(skill, 'max-w-[200px]')}`}>
      {getLevelIcon()}
      <span className="truncate">{skill}</span>
      {verified && <CheckCircle className="w-3 h-3 text-green-600 flex-shrink-0" />}
      {rating && (
        <span className="text-xs font-bold flex-shrink-0">
          {rating.toFixed(1)}★
        </span>
      )}
    </div>
  );
};

export default DynamicSkillBadge;
