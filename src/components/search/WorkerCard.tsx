
import React from "react";
import { Star, MapPin, Clock, Shield, Zap } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getVerificationColor = () => {
    switch (verificationLevel) {
      case 'premium': return 'bg-purple-500';
      case 'verified': return 'bg-green-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        {/* Left Section - Avatar + Info */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <Avatar className="w-12 h-12 border-2 border-white shadow-md">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Online indicator */}
            {isOnline && (
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            )}
            
            {/* Verification badge */}
            {verificationLevel !== 'basic' && (
              <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 ${getVerificationColor()} rounded-full flex items-center justify-center border-2 border-white`}>
                <Shield className="w-2.5 h-2.5 text-white" fill="currentColor" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {name}
              </h3>
              {isOnline && (
                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
                  <Zap className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 truncate mb-1">{category}</p>
            
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                <span className="font-semibold text-gray-900">{rating}</span>
                <span>({completedJobs})</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{distance}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{responseTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Section - Rate + Action */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">₹{hourlyRate}</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            View
          </Button>
        </div>
      </div>
      
      {/* Skills - Compact Row */}
      {skills.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-100"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                +{skills.length - 3}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerCard;
