
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Clock, Shield, Check, MessageCircle, Phone, UserPlus } from 'lucide-react';
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
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${name}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar & Status */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-16 h-16 border-3 border-white shadow-lg ring-2 ring-gray-100">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Online Status */}
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-3 border-white rounded-full shadow-sm" />
          )}
          
          {/* Verification Badge */}
          {verificationLevel !== 'basic' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-3 border-white shadow-sm">
              <Shield className="w-3 h-3 text-white" fill="currentColor" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
              {isOnline && (
                <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1 font-medium">
                  Online
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-green-600">₹{hourlyRate}</div>
              <div className="text-xs text-gray-500 font-medium">per hour</div>
            </div>
          </div>
          
          <p className="text-gray-600 font-medium mb-3">{category}</p>
          
          {/* Rating & Stats */}
          <div className="flex items-center gap-6 text-sm mb-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="font-bold text-gray-900">{rating}</span>
              <span className="text-gray-500">({completedJobs})</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{distance}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="font-medium">{responseTime}</span>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs text-gray-500 py-1.5 font-medium">+{skills.length - 3} more</span>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-10 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 font-semibold transition-all"
              onClick={handleCall}
              tabIndex={-1}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-10 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 font-semibold transition-all"
              onClick={handleChat}
              tabIndex={-1}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat
            </Button>
            <Button
              size="sm"
              className="flex-1 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleHire}
              tabIndex={-1}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Hire
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
