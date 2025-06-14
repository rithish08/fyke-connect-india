import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, CheckCircle, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import HireWorkerModal from "@/components/modals/HireWorkerModal";
import { useTranslation } from "@/hooks/useTranslation";

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

function getResponsiveFontSize(text: string, base = 13, min = 9) {
  if (!text) return `${base}px`;
  if (text.length <= 12) return `${base}px`;
  if (text.length <= 18) return `${base - 2}px`;
  if (text.length <= 28) return `${base - 4}px`;
  return `${min}px`;
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
  const { translateCategory } = useTranslation();
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

  return (
    <>
      <div
        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 cursor-pointer group flex items-start min-h-[110px]"
        tabIndex={0}
        role="button"
        aria-label={`Open profile of ${name}`}
        onClick={e => {
          if (e) e.stopPropagation();
          navigate(`/worker/${id}`);
        }}
        onKeyDown={e => {
          if (e.key === "Enter") {
            navigate(`/worker/${id}`);
          }
        }}
        style={{ minHeight: "110px" }}
      >
        {/* Profile Section */}
        <div className="flex flex-col justify-start items-center pr-2 pt-1">
          <div className="relative">
            <Avatar className="h-20 w-20 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <AvatarImage src={profileImage} alt={name} className="object-cover h-20 w-20 rounded-lg" />
              <AvatarFallback className="bg-blue-300 text-white font-bold text-xl rounded-lg">
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

        <div className="flex-1 min-w-0 flex flex-col justify-between gap-0">
          <div>
            {/* Name & main info (inline with profile image) */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base text-gray-900 truncate max-w-[170px]" style={{ lineHeight: "1.2" }}>
                {name}
              </span>
            </div>
            {/* Category below name */}
            <div>
              <span
                className="mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded bg-blue-100 text-blue-700"
                style={{
                  fontSize: getResponsiveFontSize(translateCategory(category), 13, 8),
                  maxWidth: 92,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {translateCategory(category)}
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
            {/* Skills/Subcategories and +more */}
            <div className="flex flex-row flex-wrap items-center gap-1 mb-2">
              {displayedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-700 font-medium"
                  style={{
                    fontSize: getResponsiveFontSize(skill, 12, 8),
                    maxWidth: 90,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
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

        {/* Actions column */}
        <div className="flex flex-col items-end justify-center pl-4 min-w-[80px] w-full max-w-[150px]">
          {/* Helper text above the button, intentionally with poor grammar, no punctuation */}
          <div className="mb-1 w-full text-[11px] text-left text-gray-400 font-medium leading-tight truncate" style={{lineHeight: 1.1, marginBottom: 2}}>
            to hire click the bluebutton to hire with rate
          </div>
          <Button
            variant={hireRequested ? "secondary" : "default"}
            className={`h-7 w-[40%] min-w-[66px] max-w-[120px] px-2 py-1 mb-1 rounded-lg font-semibold shadow transition-all duration-150 border-none outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400
              ${hireRequested
                ? "bg-green-100 text-green-700 cursor-default"
                : "bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-400 text-white hover:scale-105 hover:bg-blue-600"
              }`}
            tabIndex={-1}
            disabled={hireRequested}
            style={{
              letterSpacing: "0.01em",
              boxShadow: "0 4px 16px 0 #2563eb20",
              fontSize: !hireRequested && String(hourlyRate).length > 10 ? "11px" : "13px",
              minHeight: "28px",
              minWidth: "68px"
            }}
            onClick={e => {
              e.stopPropagation();
              if (!hireRequested) setHireRequested(true);
            }}
          >
            {hireRequested ? "Requested" : `₹${hourlyRate}`}
          </Button>
          <Button
            variant="outline"
            className="mb-1 h-8 min-w-0 px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 flex items-center justify-center"
            onClick={e => {
              e.stopPropagation();
              toast({ title: "Calling...", description: `Calling ${name}` });
            }}
            tabIndex={-1}
            style={{ width: "fit-content" }}
          >
            <Phone className="w-4 h-4 mr-1" />
            Call
          </Button>
          <Button
            variant="outline"
            className="h-8 min-w-0 px-2 rounded-lg border border-gray-200 text-gray-700 font-medium text-xs bg-white hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-300 flex items-center justify-center"
            onClick={e => {
              e.stopPropagation();
              navigate("/messages", {
                state: {
                  workerId: id,
                  workerName: name,
                },
              });
            }}
            tabIndex={-1}
            style={{ width: "fit-content" }}
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Chat
          </Button>
        </div>
      </div>
    </>
  );
};

export default WorkerCard;
