
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

  // Card aspect ratio 3:1, compact height (~110px)
  return (
    <div
      className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer relative group flex items-stretch"
      tabIndex={0}
      role="button"
      aria-label={`Open profile of ${name}`}
      onClick={handleProfileClick}
      onKeyDown={(e) => { if (e.key === "Enter") handleProfileClick(); }}
      style={{
        aspectRatio: "3/1",
        minHeight: "100px",
        height: "110px", // compact height
        maxHeight: "120px",
        overflow: "hidden",
      }}
    >
      {/* Profile Image (rectangular, 70% of card height) */}
      <div className="flex items-center pl-3 pr-1" style={{height: "100%", minWidth: '62px'}}>
        <div
          className="relative rounded-xl overflow-hidden shadow-md bg-gray-100 border border-gray-100 flex items-center justify-center"
          style={{
            width: "56px",
            height: "77px", // 70% of 110px
            minWidth: "56px",
            minHeight: "77px",
            background: "#f1f5f9",
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
            <span className="absolute top-2 left-10 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-40" />
          )}
          {/* Verification Badge */}
          {verificationLevel !== 'basic' && (
            <span className="absolute bottom-1 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center z-40">
              <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
            </span>
          )}
        </div>
      </div>

      {/* Main Info Column */}
      <div className="flex flex-col flex-grow min-w-0 pt-2 pb-1 pr-1 justify-between">
        {/* Name, Category, Rating+Distance */}
        <div>
          <div className="flex flex-wrap items-center gap-1 max-w-full">
            <span className="font-semibold text-base text-gray-900 truncate max-w-[140px]" style={{lineHeight: '1.2'}}>
              {name}
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 ml-1 truncate max-w-[70px]">
              {category}
            </span>
          </div>
          {/* Ratings and kilometer in one row */}
          <div className="flex items-center gap-2 mt-0.5 mb-1 text-gray-600 text-[13px]">
            <Star className="w-4 h-4 text-yellow-400 mr-0.5" fill="currentColor" />
            <span className="font-medium">{rating}</span>
            <span className="mx-2 text-gray-300">|</span>
            <MapPin className="w-4 h-4 mr-0.5 text-gray-400" />
            <span className="text-xs text-gray-500">{distance}</span>
          </div>
        </div>

        {/* Skill chips */}
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

        {/* Call and Chat buttons, inside the card and below the data, between photo and rate */}
        <div className="flex gap-2 mt-auto relative" style={{width: "calc(100% - 12px)"}}>
          <Button
            variant="outline"
            className="flex-1 h-7 px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 min-w-[55px] overflow-hidden"
            onClick={handleCall}
            tabIndex={-1}
            style={{minWidth: "60px"}}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-7 px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 min-w-[55px] overflow-hidden"
            onClick={handleChat}
            tabIndex={-1}
            style={{minWidth: "60px"}}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>

      {/* Rate Button Square (50% of card height, right-aligned and vertically ~25% from top) */}
      <div className="flex flex-col justify-center items-end w-[72px] h-full pr-4">
        <div
          className="bg-gradient-to-tl from-blue-600 to-blue-400 text-white font-bold shadow-lg flex flex-col items-center justify-center select-none"
          style={{
            width: "55px",
            height: "55px", // 50% of 110px
            borderRadius: "16px",
            marginTop: "calc(27.5px)", // 25% of 110px
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
