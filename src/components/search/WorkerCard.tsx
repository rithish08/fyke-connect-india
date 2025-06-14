
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

  // Card aspect ratio 3:1, compact height
  return (
    <div
      className="w-full max-w-2xl rounded-2xl flex bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer relative group"
      tabIndex={0}
      role="button"
      aria-label={`Open profile of ${name}`}
      onClick={handleProfileClick}
      onKeyDown={(e) => { if (e.key === "Enter") handleProfileClick(); }}
      style={{
        aspectRatio: "3/1",
        minHeight: "5.5rem",
        height: "110px", // compact
        maxHeight: "120px"
      }}
    >
      {/* Profile Image Column */}
      <div className="flex flex-col justify-center items-center h-full pl-3 pr-2">
        <div
          className="rounded-xl overflow-hidden shadow-md border border-gray-100"
          style={{
            width: "60px",
            height: "77px", // 70% of card height (110px)
            minWidth: "60px",
            minHeight: "77px",
            background: "#f1f5f9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Avatar className="w-full h-full rounded-xl">
            <AvatarImage src={profileImage} alt={name} className="object-cover w-full h-full" />
            <AvatarFallback className="bg-blue-300 text-white font-bold text-lg w-full h-full rounded-xl">
              {name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {/* Online Status Dot */}
          {isOnline && (
            <span className="absolute top-2 left-8 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-40" />
          )}
          {/* Verification Badge */}
          {verificationLevel !== 'basic' && (
            <span className="absolute bottom-0 right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center z-40">
              <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
            </span>
          )}
        </div>
      </div>
      {/* Main info column */}
      <div className="flex flex-col justify-center flex-[2] min-w-0 pt-2 pb-2 pr-2">
        {/* Name and Category+Rating+Distance */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-base text-gray-900 truncate">{name}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 ml-1 truncate">
              {category}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1 mb-1">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
              <span className="font-medium">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-4 h-4 mr-0.5 text-gray-400" />
              <span>{distance}</span>
            </div>
          </div>
        </div>
        {/* Compact skill chips */}
        <div className="flex flex-wrap gap-1 mb-1">
          {skills.slice(0, 2).map((skill, i) => (
            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700 font-medium">
              {skill}
            </span>
          ))}
          {skills.length > 2 && (
            <span className="text-xs text-gray-400">+{skills.length - 2} more</span>
          )}
        </div>
        {/* Call and Chat Buttons */}
        <div className="flex flex-col items-start gap-2 pt-1">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1 h-7 px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 min-w-[60px]"
              onClick={handleCall}
              tabIndex={-1}
            >
              <Phone className="w-4 h-4 mr-1" />
              Call
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-7 px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 min-w-[60px]"
              onClick={handleChat}
              tabIndex={-1}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </div>
        </div>
      </div>
      {/* Rate Button Square */}
      <div className="flex flex-col items-center justify-center flex-[1] relative">
        <div
          className="absolute right-5 bg-gradient-to-tl from-blue-600 to-blue-400 text-white font-bold shadow-lg flex flex-col items-center justify-center select-none"
          style={{
            width: "55px",
            height: "55px", // 50% of card height (110px)
            borderRadius: "16px",
            top: "25%", // visually aligns 25% down from top
            zIndex: 10,
            boxShadow: "0 2px 16px 0 #2563eb33"
          }}
        >
          <span className="font-bold text-lg tracking-tight">₹{hourlyRate}</span>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;
