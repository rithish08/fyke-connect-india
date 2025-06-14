
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

  const handleProfileClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/worker/${id}`);
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

  // Card: 3 parts width : 1 part height, visually mostly wide, not tall.
  // Left (75%): Profile + info. Right (25%): Rate Button (circle)
  return (
    <div
      className="w-full max-w-2xl h-28 rounded-2xl flex bg-gradient-to-r from-white to-blue-50 border border-gray-200 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer relative group"
      tabIndex={0}
      role="button"
      aria-label={`Open profile of ${name}`}
      onClick={handleProfileClick}
      onKeyDown={(e) => { if (e.key === "Enter") handleProfileClick(); }}
      style={{ aspectRatio: "3/1", minHeight: "5.5rem" }} // 3:1 rectangle
    >
      {/* Left Side: Profile Info (75%) */}
      <div className="flex flex-col justify-between flex-[3] pl-5 py-3">
        <div className="flex items-center gap-4">
          {/* Avatar + Verification */}
          <div className="relative">
            <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
              <AvatarImage src={profileImage} alt={name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-600 text-white font-bold text-lg">
                {name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {verificationLevel !== 'basic' && (
              <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
              </span>
            )}
            {isOnline && (
              <span className="absolute -top-1 -left-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></span>
            )}
          </div>
          {/* Main Info */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-gray-900 truncate">{name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 ml-1 truncate">{category}</span>
            </div>
            {/* Rating and Distance */}
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                <span className="font-medium text-sm text-gray-900">{rating}</span>
              </div>
              <span className="text-xs text-gray-500 px-2 flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                {distance}
              </span>
            </div>
            {/* Skills preview */}
            <div className="flex flex-wrap gap-2 mt-1">
              {skills.slice(0, 2).map((skill, i) => (
                <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700 font-medium">
                  {skill}
                </span>
              ))}
              {skills.length > 2 && (
                <span className="text-xs text-gray-400">+{skills.length - 2} more</span>
              )}
            </div>
          </div>
        </div>
        {/* Call/Chat Rectangular Buttons */}
        <div className="flex gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1 h-8 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-300"
            onClick={handleCall}
            tabIndex={-1}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-8 rounded-lg border border-gray-200 text-gray-700 font-medium text-sm bg-white hover:bg-blue-100 focus-visible:ring-2 focus-visible:ring-blue-300"
            onClick={handleChat}
            tabIndex={-1}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>
      {/* Right Side: Rate Button (circular, centered vertically w/ 25% top pad) */}
      <div className="flex-[1] flex flex-col items-center justify-center relative">
        <div
          className="w-[64px] h-[64px] rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 text-white text-lg font-bold flex flex-col items-center justify-center shadow-md absolute right-4"
          style={{ top: "25%", transform: "translateY(-25%)" }}
        >
          <span className="font-bold text-xl tracking-tight">₹{hourlyRate}</span>
          <span className="text-xs opacity-60 font-medium -mt-1">/hr</span>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
