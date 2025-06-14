
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Shield, MessageCircle, Phone, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  distance = '2km',
  hourlyRate = 300,
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
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${name}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="flex gap-4">
        {/* Profile Photo - More rectangular/portrait */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-16 h-20 rounded-xl border-2 border-gray-100">
            <AvatarImage src={profileImage} alt={name} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status */}
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
          )}
          
          {/* Verification Badge */}
          {verificationLevel !== 'basic' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Shield className="w-2.5 h-2.5 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header with name and rate */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
                {isOnline && (
                  <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5 font-medium">
                    Online
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 text-sm font-medium">{category}</p>
            </div>
            <div className="text-right ml-3">
              <div className="text-lg font-bold text-green-600">₹{hourlyRate}</div>
              <div className="text-xs text-gray-500">per hour</div>
            </div>
          </div>
          
          {/* Rating & Stats */}
          <div className="flex items-center gap-4 text-sm mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="font-semibold text-gray-900">{rating}</span>
              <span className="text-gray-500">({completedJobs})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{distance}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs">{responseTime}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-blue-50 border border-blue-200 px-2 py-1 rounded-full text-xs font-medium text-blue-700">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs text-gray-500 py-1">+{skills.length - 3} more</span>
            )}
          </div>
          
          {/* Action Buttons - Hire button on the left */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold rounded-lg"
              onClick={handleHire}
              tabIndex={-1}
            >
              <UserPlus className="w-3.5 h-3.5 mr-1.5" />
              Hire
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-2 text-xs font-medium rounded-lg"
              onClick={handleCall}
              tabIndex={-1}
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-2 text-xs font-medium rounded-lg"
              onClick={handleChat}
              tabIndex={-1}
            >
              <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
              Chat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
