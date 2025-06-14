
import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface WorkerInfoProps {
  name: string;
  category: string;
  rating: number;
  distance: string;
  skills: string[];
}

function getResponsiveFontSize(text: string, base = 13, min = 9) {
  if (!text) return `${base}px`;
  if (text.length <= 12) return `${base}px`;
  if (text.length <= 18) return `${base - 2}px`;
  if (text.length <= 28) return `${base - 4}px`;
  return `${min}px`;
}

const WorkerInfo: React.FC<WorkerInfoProps> = ({
  name,
  category,
  rating,
  distance,
  skills
}) => {
  const { translateCategory } = useTranslation();
  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  return (
    <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
      <div>
        {/* Name */}
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-base text-gray-900 truncate max-w-[160px]" style={{ lineHeight: '1.2' }}>
            {name}
          </span>
        </div>
        
        {/* Category */}
        <div className="mb-1">
          <span
            className="inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700"
            style={{
              fontSize: getResponsiveFontSize(translateCategory(category), 12, 8),
              maxWidth: 85,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {translateCategory(category)}
          </span>
        </div>
        
        {/* Rating + Distance */}
        <div className="flex items-center gap-2 mb-2 text-gray-600 text-[12px]">
          <div className="flex items-center">
            <Star className="w-3.5 h-3.5 text-yellow-400 mr-1" fill="currentColor" />
            <span className="font-medium">{rating}</span>
          </div>
          <span className="mx-1 text-gray-300">|</span>
          <div className="flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
            <span className="text-xs text-gray-500">{distance}</span>
          </div>
        </div>
        
        {/* Skills */}
        <div className="flex flex-row flex-wrap items-center gap-1">
          {displayedSkills.map((skill, i) => (
            <span
              key={i}
              className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700 font-medium"
              style={{
                fontSize: getResponsiveFontSize(skill, 11, 8),
                maxWidth: 85,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {skill}
            </span>
          ))}
          {moreSkills > 0 && (
            <span className="text-xs text-gray-400 ml-1">
              +{moreSkills} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkerInfo;
