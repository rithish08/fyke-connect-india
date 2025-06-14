
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { getResponsiveTextSize, getFlexibleContainerClass, getResponsivePadding } from '@/utils/textSizing';

interface WorkerInfoProps {
  name: string;
  category: string;
  rating: number;
  distance: string;
  skills: string[];
}

const WorkerInfo: React.FC<WorkerInfoProps> = ({
  name,
  category,
  rating,
  distance,
  skills
}) => {
  const { translateCategory } = useTranslation();
  const translatedCategory = translateCategory(category);
  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  // Dynamic sizing for category
  const categoryTextSize = getResponsiveTextSize(translatedCategory, {
    baseSize: 11,
    minSize: 9,
    maxSize: 12
  });
  
  // Dynamic sizing for name
  const nameTextSize = getResponsiveTextSize(name, {
    baseSize: 16,
    minSize: 14,
    maxSize: 17
  });

  return (
    <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
      <div>
        {/* Name */}
        <div className="mb-1.5">
          <span className={`font-semibold text-gray-900 ${nameTextSize} ${getFlexibleContainerClass(name, 'block')}`} style={{ lineHeight: '1.2' }}>
            {name}
          </span>
        </div>
        
        {/* Category */}
        <div className="mb-2">
          <span
            className={`inline-flex items-center font-medium rounded-md bg-blue-100 text-blue-700 ${categoryTextSize} ${getResponsivePadding(translatedCategory)} ${getFlexibleContainerClass(translatedCategory)}`}
            title={translatedCategory}
          >
            {translatedCategory}
          </span>
        </div>
        
        {/* Rating + Distance */}
        <div className="flex items-center gap-3 mb-2 text-gray-600 text-xs">
          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 text-yellow-400 mr-1" fill="currentColor" />
            <span className="font-medium">{rating}</span>
          </div>
          <span className="text-gray-300">|</span>
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
            <span className="text-xs text-gray-500">{distance}</span>
          </div>
        </div>
        
        {/* Skills */}
        <div className="flex flex-wrap items-center gap-1">
          {displayedSkills.map((skill, i) => {
            const skillTextSize = getResponsiveTextSize(skill, {
              baseSize: 10,
              minSize: 8,
              maxSize: 11
            });
            
            return (
              <span
                key={i}
                className={`bg-gray-100 text-gray-700 font-medium rounded-full ${skillTextSize} ${getResponsivePadding(skill)} ${getFlexibleContainerClass(skill, 'inline-flex items-center')}`}
                title={skill}
              >
                {skill}
              </span>
            );
          })}
          {moreSkills > 0 && (
            <span className="text-xs text-gray-400 ml-0.5">
              +{moreSkills}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerInfo;
