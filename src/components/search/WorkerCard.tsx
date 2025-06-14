
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
  ...props
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
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${name}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="flex items-center space-x-4">
        {/* Avatar & Status */}
        <div className="relative flex-shrink-0">
          <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />
          )}
          {verificationLevel !== 'basic' && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
              <Check className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-base truncate">{name}</h3>
            {isOnline && <Badge className="bg-green-100 text-green-700 text-xs px-2 py-0.5">Online</Badge>}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">{category}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="font-medium text-gray-700">{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{responseTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 2).map((skill, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                {skill}
              </span>
            ))}
            {skills.length > 2 && (
              <span className="text-xs text-gray-500 py-1">+{skills.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Rate & Actions */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">₹{hourlyRate}</div>
            <div className="text-xs text-gray-500">per hour</div>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 rounded-full hover:bg-blue-50 hover:border-blue-200"
              onClick={handleCall}
              tabIndex={-1}
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-8 h-8 p-0 rounded-full hover:bg-blue-50 hover:border-blue-200"
              onClick={handleChat}
              tabIndex={-1}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              className="w-8 h-8 p-0 rounded-full bg-blue-600 hover:bg-blue-700"
              onClick={handleHire}
              tabIndex={-1}
            >
              <UserPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
