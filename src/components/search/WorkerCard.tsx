
import React from "react";
import { Star, MapPin, Clock, Shield, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  // Only open modal if passed, else call onClick (fallback for navigation)
  const handleViewProfile = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (showModal) showModal({ id, name, category, skills, rating, completedJobs, verificationLevel, responseTime, distance, hourlyRate, isOnline, profileImage });
    else if (onClick) onClick({ id, name, category, skills, rating, completedJobs, verificationLevel, responseTime, distance, hourlyRate, isOnline, profileImage });
  };

  return (
    <div
      className="bg-white rounded-2xl px-4 py-3 shadow group border border-gray-100 flex items-center transition hover:shadow-xl hover:scale-[1.01] cursor-pointer min-h-[120px] select-none"
      onClick={handleViewProfile}
      tabIndex={0}
      role="button"
      aria-label={`View profile of ${name}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleViewProfile(); }}
    >
      {/* Avatar & Online status */}
      <div className="mr-4 relative">
        <Avatar className="w-14 h-14 border-2 border-white shadow">
          <AvatarImage src={profileImage} alt={name} />
          <AvatarFallback className="bg-gray-100 text-gray-400 font-bold text-lg">
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" aria-label="Online"></span>
        )}
      </div>
      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-900 text-base truncate">{name}</span>
          {verificationLevel === 'verified' || verificationLevel === 'premium' ? (
            <Check className="w-4 h-4 text-green-500 ml-0.5" aria-label="Verified" />
          ) : null}
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs">
          <div className="flex items-center gap-1 text-gray-700 font-medium">
            <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
            <span>{typeof rating === "number" ? rating.toFixed(1) : rating}</span>
          </div>
          <div className="text-gray-400">·</div>
          <div className="font-medium text-gray-700">{hourlyRate && <span>₹{hourlyRate}/hr</span>}</div>
          <div className="text-gray-400">·</div>
          <span className="flex items-center gap-1 text-gray-700"><Clock className="w-3 h-3" /> {responseTime}</span>
        </div>
        <div className="mt-1 text-xs text-gray-600 font-normal">{completedJobs} jobs completed</div>
        {/* Skills tags limited to three */}
        <div className="mt-1 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-800">{skill}</span>
          ))}
        </div>
      </div>
      {/* Action */}
      <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
        <Button
          size="sm"
          className="rounded-xl min-w-[70px] border border-gray-200 bg-gray-50 text-gray-900 font-bold shadow-none transition hover:bg-gray-100 hover:text-blue-700"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); handleViewProfile(e); }}
        >
          View
        </Button>
      </div>
    </div>
  );
}

export default WorkerCard;
