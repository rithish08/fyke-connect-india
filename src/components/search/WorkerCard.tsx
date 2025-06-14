
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, CheckCircle, MapPin } from 'lucide-react';
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  showModal
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
      description: `Calling ${name}`
    });
  };
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/messages', {
      state: {
        workerId: id,
        workerName: name
      }
    });
  };

  return (
    <div
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-2xl flex items-stretch h-[122px] min-h-[122px] relative"
      tabIndex={0}
      role="button"
      aria-label={`Open profile of ${name}`}
      onClick={handleProfileClick}
      onKeyDown={e => {
        if (e.key === "Enter") handleProfileClick();
      }}
      style={{
        boxSizing: 'border-box',
      }}
    >
      {/* Profile Rectangle Image: left-aligned, vertical rectangle */}
      <div className="flex flex-col items-center justify-center pr-4">
        <div className="relative">
          <div className="w-[60px] h-[90px] rounded-xl overflow-hidden border border-gray-200 relative">
            <AvatarImage src={profileImage} alt={name}
              className="object-cover w-full h-full" />
            <AvatarFallback className="bg-blue-300 text-white font-bold text-lg flex items-center justify-center w-full h-full">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
            {isOnline && (
              <span className="absolute bottom-2 right-2 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-40" />
            )}
            {verificationLevel !== 'basic' && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-green-400 border-2 border-white flex items-center justify-center z-50">
                <CheckCircle className="w-3.5 h-3.5 text-white" fill="currentColor" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Central Info - takes most of horizontal space */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Name, Category, Rating + Distance */}
        <div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold text-base text-gray-900 truncate max-w-[160px]" style={{ lineHeight: '1.2' }}>
              {name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 truncate max-w-[80px]">
              {category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 mb-1 text-gray-600 text-[13px]">
            <Star className="w-4 h-4 text-yellow-400 mr-0.5" fill="currentColor" />
            <span className="font-medium">{rating}</span>
            <span className="mx-2 text-gray-300">|</span>
            <MapPin className="w-4 h-4 mr-0.5 text-gray-400" />
            <span className="text-xs text-gray-500">{distance}</span>
          </div>
        </div>
        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-1">
          {skills.slice(0, 2).map((skill, i) =>
            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700 font-medium">
              {skill}
            </span>
          )}
          {skills.length > 2 && <span className="text-xs text-gray-400">+{skills.length - 2} more</span>}
        </div>
      </div>

      {/* Action/Side Column: Rate & Buttons */}
      <div className="flex flex-col items-end justify-between pl-3 h-full">
        {/* Hire Button-like Rate: Long rectangle, 50% card height */}
        <div
          className="flex flex-col items-center justify-center bg-gradient-to-tl from-blue-600 to-blue-400 text-white font-bold shadow-lg mt-1"
          style={{
            width: "74px",
            height: "60px",
            borderRadius: "15px",
            boxShadow: "0 2px 16px 0 #2563eb33",
          }}
        >
          <span className="font-bold text-base tracking-tight">₹{hourlyRate}</span>
        </div>
        {/* Call & Chat Buttons: vertically stacked, to right end, below the rate */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <Button
            variant="outline"
            className="w-[74px] h-8 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300"
            onClick={handleCall}
            tabIndex={-1}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            className="w-[74px] h-8 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300"
            onClick={handleChat}
            tabIndex={-1}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
