
import React from "react";
import TrustScore from "@/components/trust/TrustScore";
import SkillBadge from "@/components/verification/SkillBadge";
import CommunicationButtons from "@/components/communication/CommunicationButtons";
import { Star, MapPin, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
  profileImage?: string;
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
  profileImage = "/placeholder.svg",
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
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1">
          <div className="relative">
            <Avatar className="w-14 h-14">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-lg">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
              <TrustScore 
                score={rating}
                verificationLevel={verificationLevel}
                completedJobs={completedJobs}
                responseTime={responseTime}
                className="ml-2"
              />
            </div>
            <p className="text-sm text-gray-600 mb-1">{category}</p>
            <div className="flex items-center text-xs text-gray-500 space-x-3">
              <span className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {distance}
              </span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {responseTime}
              </span>
              <span className="text-blue-600 font-medium">{completedJobs} jobs</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center text-yellow-600 font-bold text-lg mb-1">
            <Star className="w-4 h-4 mr-1" fill="currentColor" />
            {rating}
          </div>
          <div className="text-green-600 font-bold text-lg">₹{hourlyRate}/hr</div>
        </div>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {skills.slice(0, 3).map((skill, idx) => (
            <SkillBadge
              key={idx}
              skill={skill}
              level={idx === 0 ? 'expert' : 'intermediate'}
              verified={idx < 2}
            />
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 rounded-full">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={(e) => {
            e.stopPropagation();
            // Apply functionality
          }}
        >
          Apply
        </Button>
        <CommunicationButtons
          targetId={name.toLowerCase().replace(' ', '')}
          targetName={name}
          targetType="worker"
          size="sm"
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default WorkerCard;
