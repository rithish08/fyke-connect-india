
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
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hireOpen, setHireOpen] = useState(false);
  const [hireRequested, setHireRequested] = useState(false);

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

  const handleHire = () => {
    setHireRequested(true);
    setHireOpen(false);
    toast({
      title: "Hire request sent",
      description: `You requested to hire ${name}.`,
      duration: 3000,
    });
  };

  // Get first two skills
  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  // Dynamic text size based on text length
  const getTextSize = (text: string, maxLength: number = 15) => {
    if (text.length > maxLength) return "text-xs";
    if (text.length > 12) return "text-sm";
    return "text-base";
  };

  return (
    <>
      <div
        className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 cursor-pointer group flex items-start min-h-[96px] gap-3"
        tabIndex={0}
        role="button"
        aria-label={`Open profile of ${name}`}
        onClick={handleProfileClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleProfileClick();
        }}
      >
        {/* Profile image */}
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <AvatarImage src={profileImage} alt={name} className="object-cover h-14 w-14 rounded-lg" />
            <AvatarFallback className="bg-blue-300 text-white font-bold text-sm rounded-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-10" />
          )}
          {verificationLevel !== "basic" && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center z-10">
              <CheckCircle className="w-2.5 h-2.5 text-white" fill="currentColor" />
            </span>
          )}
        </div>

        {/* Main info section */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex gap-2 items-center mb-0.5">
            <span className={`font-semibold leading-4 text-gray-900 truncate max-w-[145px] ${getTextSize(name)}`}>
              {name}
            </span>
            <span className={`px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium ${getTextSize(category, 12)} whitespace-nowrap`}>
              {category}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mb-1 text-gray-600 text-xs">
            <Star className="w-3 h-3 text-yellow-400 mr-0.5" fill="currentColor" />
            <span className="font-medium">{rating}</span>
            <span className="mx-1 text-gray-300">·</span>
            <MapPin className="w-3 h-3 text-gray-400 mr-0.5" />
            <span className="text-gray-500">{distance}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-1">
            {displayedSkills.map((skill, i) => (
              <span
                key={i}
                className={`bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium ${getTextSize(skill, 10)} whitespace-nowrap`}
              >
                {skill}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="text-gray-500 text-xs font-medium">+{moreSkills} more</span>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex flex-col gap-1 items-end justify-between ml-2">
          <div className="text-right mb-1">
            <div className="text-xs text-gray-500 mb-0.5">tap blue button hire</div>
            <Button
              variant={hireRequested ? "secondary" : "default"}
              className={`h-7 px-2 rounded-lg text-xs font-semibold shadow border-none outline-none min-w-[50px] transition-all duration-150 ${
                hireRequested
                  ? "bg-green-100 text-green-700 cursor-default"
                  : "bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-400 text-white hover:scale-105 hover:bg-blue-600"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (!hireRequested) setHireOpen(true);
              }}
              disabled={hireRequested}
            >
              {hireRequested ? "Requested" : `₹${hourlyRate}`}
            </Button>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="h-6 w-12 px-1 rounded border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50"
              onClick={handleCall}
            >
              <Phone className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              className="h-6 w-12 px-1 rounded border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50"
              onClick={handleChat}
            >
              <MessageCircle className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      <HireWorkerModal
        open={hireOpen}
        onClose={() => setHireOpen(false)}
        onHire={handleHire}
        workerName={name}
      />
    </>
  );
};

export default WorkerCard;
