
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, CheckCircle, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HireWorkerModal from "@/components/modals/HireWorkerModal";

interface WorkerCardProps {
  id: string | number;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs?: number;
  verificationLevel?: "basic" | "verified" | "premium";
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
  verificationLevel = "basic",
  responseTime = "< 1hr",
  distance = "1.2 km",
  hourlyRate = 350,
  isOnline = false,
  profileImage = "/placeholder.svg",
  onClick,
  showModal,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showHireModal, setShowHireModal] = useState(false);

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
    navigate("/messages", {
      state: {
        workerId: id,
        workerName: name,
      },
    });
  };

  const handleHireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowHireModal(true);
  };

  // Get first two skills
  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  const workerData = {
    id,
    name,
    category,
    rating,
    distance,
    hourlyRate,
    profileImage,
    verificationLevel
  };

  return (
    <>
      <div
        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 w-full max-w-2xl transition-all duration-200 cursor-pointer group flex items-start min-h-[120px]"
        tabIndex={0}
        role="button"
        aria-label={`View profile of ${name}`}
        onClick={handleProfileClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleProfileClick();
        }}
      >
        {/* Profile section - wider image */}
        <div className="flex flex-col justify-start items-center pr-4 pt-1">
          <div className="relative">
            <Avatar className="h-20 w-20 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
              <AvatarImage 
                src={profileImage} 
                alt={name} 
                className="object-cover h-20 w-20 rounded-xl" 
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl rounded-xl">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {isOnline && (
              <span className="absolute bottom-1 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white z-10" />
            )}
            {verificationLevel !== "basic" && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center z-10">
                <CheckCircle className="w-4 h-4 text-white" fill="currentColor" />
              </span>
            )}
          </div>
        </div>

        {/* Main info section */}
        <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
          <div>
            {/* Name & main info */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-lg text-gray-900 truncate max-w-[200px]">
                {name}
              </span>
            </div>

            {/* Category */}
            <div className="mb-2">
              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {category}
              </span>
            </div>

            {/* Rating + Distance */}
            <div className="flex items-center gap-3 mb-2 text-gray-600 text-sm">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                <span className="font-medium">{rating}</span>
              </div>
              <span className="text-gray-300">|</span>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-500">{distance}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="flex flex-row flex-wrap items-center gap-1 mb-1">
              {displayedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700 font-medium"
                >
                  {skill}
                </span>
              ))}
              {moreSkills > 0 && (
                <span className="text-xs text-gray-400 ml-1">
                  +{moreSkills} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex flex-col items-end justify-center pl-3 min-w-[90px]">
          <Button
            onClick={handleHireClick}
            className="h-11 w-28 px-4 mb-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-150 border-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400"
            tabIndex={-1}
          >
            ₹{hourlyRate}/Hire
          </Button>
          
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-12 px-0 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300"
              onClick={handleCall}
              tabIndex={-1}
              aria-label="Call worker"
            >
              <Phone className="w-3 h-3" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-12 px-0 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300"
              onClick={handleChat}
              tabIndex={-1}
              aria-label="Chat with worker"
            >
              <MessageCircle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <HireWorkerModal
        isOpen={showHireModal}
        onClose={() => setShowHireModal(false)}
        worker={workerData}
      />
    </>
  );
};

export default WorkerCard;
