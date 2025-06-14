
import React from "react";
import TrustScore from "@/components/trust/TrustScore";
import CommunicationButtons from "@/components/communication/CommunicationButtons";
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';
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
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200"
      onClick={onClick}
    >
      {/* Header with name, rating and hourly rate */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-lg font-semibold">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {verificationLevel !== 'basic' && (
              <div className="absolute -top-1 -right-1">
                <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" fill="currentColor" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-gray-900 mr-1" fill="currentColor" />
                <span className="text-lg font-semibold text-gray-900">{rating}</span>
              </div>
              <span className="text-gray-600">{hourlyRate}/hr</span>
              <div className="flex items-center text-gray-600">
                <Clock className="w-3 h-3 mr-1" />
                <span className="text-sm">{responseTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs completed */}
      <div className="mb-4">
        <span className="text-gray-900 text-lg font-medium">{completedJobs} jobs completed</span>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Apply button */}
      <Button 
        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl text-lg font-medium"
        onClick={(e) => {
          e.stopPropagation();
          // Apply functionality
        }}
      >
        Apply
      </Button>
    </div>
  );
};

export default WorkerCard;
