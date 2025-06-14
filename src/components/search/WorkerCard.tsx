
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, CheckCircle, Shield } from 'lucide-react';
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
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Navigate to worker profile with worker data
      navigate(`/worker/${name.replace(/\s+/g, '-').toLowerCase()}`, {
        state: {
          worker: {
            id: name.replace(/\s+/g, '-').toLowerCase(),
            name,
            category,
            skills,
            rating,
            completedJobs,
            verificationLevel,
            responseTime,
            distance,
            hourlyRate,
            isOnline,
            profileImage
          }
        }
      });
    }
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Implement apply functionality
    console.log(`Applying to work with ${name}`);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/messages', { state: { workerId: name } });
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
      onClick={handleCardClick}
    >
      {/* Header with profile and online status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-3 border-white shadow-md">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {verificationLevel !== 'basic' && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                <Shield className="w-3 h-3 text-white" fill="currentColor" />
              </div>
            )}
            {isOnline && (
              <div className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{name}</h3>
            <p className="text-gray-600 text-sm mb-2">{category}</p>
            
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="font-semibold text-gray-900">{rating}</span>
                <span className="text-gray-500">({completedJobs})</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{distance}</span>
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{responseTime}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">₹{hourlyRate}</div>
          <div className="text-sm text-gray-500">per hour</div>
          {isOnline && (
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700 text-xs">
              Available
            </Badge>
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-100 hover:bg-blue-100 transition-colors"
            >
              {skill}
            </span>
          ))}
          {skills.length > 4 && (
            <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
              +{skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-medium transition-all"
          onClick={handleMessageClick}
        >
          Message
        </Button>
        <Button
          className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-medium transition-all hover:shadow-lg"
          onClick={handleApplyClick}
        >
          Hire Now
        </Button>
      </div>
    </div>
  );
};

export default WorkerCard;
