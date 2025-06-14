
import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, CheckCircle, MapPin } from "lucide-react";
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

  // Get first two skills
  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  return (
    <div
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 cursor-pointer group flex items-stretch min-h-[110px]"
      tabIndex={0}
      role="button"
      aria-label={`Open profile of ${name}`}
      onClick={handleProfileClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleProfileClick();
      }}
      style={{ minHeight: "110px" }}
    >
      {/* Profile Image - square/rectangle design */}
      <div className="flex flex-col items-center justify-center pr-4 w-[65px]">
        <div className="relative">
          <Avatar className="h-16 w-16 rounded-lg border border-gray-200 overflow-hidden">
            <AvatarImage src={profileImage} alt={name} className="object-cover h-16 w-16 rounded-lg" />
            <AvatarFallback className="bg-blue-300 text-white font-bold text-lg rounded-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-1 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-40" />
          )}
          {verificationLevel !== "basic" && (
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center z-40">
              <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
            </span>
          )}
        </div>
      </div>

      {/* Main info section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-0">
        <div>
          {/* Name */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base text-gray-900 truncate max-w-[170px]" style={{ lineHeight: "1.2" }}>
              {name}
            </span>
          </div>
          {/* Category below name */}
          <div>
            <span className="mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700">
              {category}
            </span>
          </div>
          {/* Rating + Distance */}
          <div className="flex items-center gap-2 mt-1 mb-1 text-gray-600 text-[13px]">
            <Star className="w-4 h-4 text-yellow-400 mr-0.5" fill="currentColor" />
            <span className="font-medium">{rating}</span>
            <span className="mx-2 text-gray-300">|</span>
            <MapPin className="w-4 h-4 mr-0.5 text-gray-400" />
            <span className="text-xs text-gray-500">{distance}</span>
          </div>
          {/* Skills/Subcategories */}
          <div className="flex flex-row flex-wrap items-center gap-1 mb-2">
            {displayedSkills.map((skill, i) => (
              // Only add right margin to first chip if there are more
              <span
                key={i}
                className={
                  "bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700 font-medium"
                }
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
        {/* Longer Hire (Rate) button */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="default"
            className="h-9 px-6 rounded-lg bg-gradient-to-tl from-blue-600 to-blue-400 text-white font-bold shadow-lg w-[140px] max-w-full tracking-tight"
            tabIndex={-1}
            style={{
              borderRadius: "13px",
              boxShadow: "0 2px 16px 0 #2563eb33",
              fontSize: "1.15rem",
            }}
            onClick={e => {
              e.stopPropagation();
              // Optionally show modal or navigate
              if (showModal) showModal({ id, name });
            }}
          >
            ₹{hourlyRate} /Hire
          </Button>
        </div>
      </div>

      {/* Call & Chat buttons stacked vertically at the right end */}
      <div className="flex flex-col items-end justify-center pl-4 min-w-[70px]">
        <Button
          variant="outline"
          className="mb-2 h-9 w-16 px-0 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300"
          onClick={handleCall}
          tabIndex={-1}
        >
          <Phone className="w-4 h-4 mr-1" />
          Call
        </Button>
        <Button
          variant="outline"
          className="h-9 w-16 px-0 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300"
          onClick={handleChat}
          tabIndex={-1}
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Chat
        </Button>
      </div>
    </div>
  );
};

export default WorkerCard;
