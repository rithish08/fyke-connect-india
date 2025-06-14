
import React from "react";
import TrustScore from "@/components/trust/TrustScore";
import SkillBadge from "@/components/verification/SkillBadge";
import { Star, MapPin, Clock } from 'lucide-react';

interface WorkerCardProps {
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs?: number;
  verificationLevel?: 'basic' | 'verified' | 'premium';
  responseTime?: string;
  distance?: string;
  hourlyRate?: number;
  isOnline?: boolean;
  onClick?: () => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ 
  name, 
  category, 
  skills = [], 
  rating,
  completedJobs = 0,
  verificationLevel = 'basic',
  responseTime = '< 1hr',
  distance = '2km',
  hourlyRate = 300,
  isOnline = false,
  onClick
}) => {
  return (
    <div
      className="mb-3 bg-white border border-gray-100 rounded-xl shadow-sm p-4 animate-fade-in hover-scale transition-all group cursor-pointer"
      tabIndex={0}
      role="listitem"
      aria-label={`${name}, ${category}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <div className="font-bold text-gray-900 text-base">{name}</div>
            {isOnline && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          <div className="text-xs text-gray-500">{category}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-yellow-600 font-bold text-sm">
            <Star className="w-3 h-3 mr-1" fill="currentColor" />
            {rating}
          </div>
          <div className="text-xs text-green-600 font-medium">₹{hourlyRate}/hr</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {distance}
          </span>
          <span className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {responseTime}
          </span>
        </div>
        <span className="text-blue-600 font-medium">{completedJobs} jobs</span>
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 2).map((skill, idx) => (
            <SkillBadge
              key={idx}
              skill={skill}
              level={idx === 0 ? 'expert' : 'intermediate'}
              verified={idx < 1}
            />
          ))}
          {skills.length > 2 && (
            <span className="text-xs text-gray-400 px-2 py-1">
              +{skills.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerCard;
