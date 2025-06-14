
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, CheckCircle, MapPin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WorkerCardProps {
  id: string | number;
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
  onClick?: (worker: any) => void;
  showModal?: (worker: any) => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  id,
  name,
  category,
  skills = [],
  rating,
  completedJobs = 0,
  verificationLevel = 'basic',
  responseTime = '< 1hr',
  distance = '1.2 km',
  hourlyRate = 350,
  isOnline = false,
  profileImage = "/placeholder.svg",
  onClick,
  showModal,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showModal) {
      showModal({ id, name, category, skills, rating, completedJobs, verificationLevel, responseTime, distance, hourlyRate, isOnline, profileImage });
    } else if (onClick) {
      onClick({ id, name, category, skills, rating, completedJobs, verificationLevel, responseTime, distance, hourlyRate, isOnline, profileImage });
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Calling...",
      description: `Calling ${name}`,
    });
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/messages', { state: { workerId: id, workerName: name } });
  };

  const handleHire = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Hire Request Sent!",
      description: `Your hire request has been sent to ${name}.`,
    });
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 cursor-pointer relative"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${name}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      {/* Main Content Area */}
      <div className="flex">
        {/* Left Side - Profile Info (75% width) */}
        <div className="flex-1 pr-4">
          {/* Profile Section */}
          <div className="flex items-start mb-4">
            {/* Avatar */}
            <div className="relative mr-4">
              <Avatar className="w-16 h-16 border-2 border-gray-100">
                <AvatarImage src={profileImage} alt={name} className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                  {name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              {/* Verification Badge */}
              {verificationLevel !== 'basic' && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
                </div>
              )}
            </div>

            {/* Name and Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                {verificationLevel !== 'basic' && (
                  <CheckCircle className="w-5 h-5 text-green-500" fill="currentColor" />
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="font-bold text-gray-900">{rating}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 font-medium">
                {skill}
              </span>
            ))}
          </div>

          {/* Distance */}
          <div className="flex items-center gap-1 mb-6">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 font-medium">{distance}</span>
          </div>

          {/* Call and Chat Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold text-gray-700"
              onClick={handleCall}
              tabIndex={-1}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call
            </Button>
            <Button
              variant="outline"
              className="h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl font-semibold text-gray-700"
              onClick={handleChat}
              tabIndex={-1}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat
            </Button>
          </div>
        </div>

        {/* Right Side - Hire Button (25% width, positioned at 25% from top) */}
        <div className="w-1/4 flex flex-col justify-start pt-6">
          <Button
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition-all"
            onClick={handleHire}
            tabIndex={-1}
          >
            ₹{hourlyRate}/hr • Hire
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
