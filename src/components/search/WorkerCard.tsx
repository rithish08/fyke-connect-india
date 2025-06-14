import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, CheckCircle, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HireWorkerModal from "./HireWorkerModal";

interface WorkerCardProps {
  id: string | number;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs?: number;
  distance?: string;
  hourlyRate?: number;
  isOnline?: boolean;
  profileImage?: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  id,
  name,
  category,
  skills = [],
  rating,
  completedJobs = 0,
  distance = "1.2 km",
  hourlyRate = 350,
  isOnline = false,
  profileImage = "/placeholder.svg",
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

  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  return (
    <>
      <div
        className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 cursor-pointer flex items-start min-h-[96px] gap-3"
        tabIndex={0}
        role="button"
        aria-label={`Open profile of ${name}`}
        onClick={handleProfileClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleProfileClick();
        }}
      >
        <div className="relative shrink-0">
          <Avatar className="h-14 w-14 rounded-lg border border-gray-200 overflow-hidden">
            <AvatarImage src={profileImage} alt={name} className="object-cover h-14 w-14 rounded-lg" />
            <AvatarFallback className="bg-blue-300 text-white font-bold text-lg rounded-lg">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white z-40" />
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex gap-2 items-center mb-0.5">
            <span className="font-semibold leading-4 text-base text-gray-900 truncate max-w-[145px]">{name}</span>
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{category}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-600">
            <span className="flex items-center"><Star className="w-4 h-4 text-yellow-400 mr-0.5" fill="currentColor" />{rating}</span>
            <span className="mx-1 text-gray-300 font-bold">·</span>
            {completedJobs > 0 && (
              <span>{completedJobs} jobs</span>
            )}
            <span className="mx-1 text-gray-300 font-bold">·</span>
            <span className="flex items-center"><MapPin className="w-3 h-3 text-gray-400 mr-0.5" />{distance}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-0.5">
            {displayedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium text-xs"
              >
                {skill}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="text-gray-500 text-xs font-medium">+{moreSkills} more</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 items-end justify-between ml-2">
          <Button
            variant={hireRequested ? "secondary" : "default"}
            className={`h-8 px-3 rounded-lg text-xs font-semibold shadow border-none outline-none min-w-[66px]
              ${hireRequested
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-400 text-white hover:scale-105 hover:bg-blue-600"
              }`}
            disabled={hireRequested}
            onClick={e => {
              e.stopPropagation();
              if (!hireRequested) setHireOpen(true);
            }}
          >
            {hireRequested ? "Requested" : `₹${hourlyRate} /Hire`}
          </Button>
          <div className="flex gap-1">
            <Button
              variant="outline"
              className="rounded-lg p-1 text-gray-700 border min-w-0"
              size="icon"
              onClick={handleCall}
              tabIndex={-1}
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="rounded-lg p-1 text-gray-700 border min-w-0"
              size="icon"
              onClick={handleChat}
              tabIndex={-1}
            >
              <MessageCircle className="w-4 h-4" />
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
