
import React, { useState } from "react";
import { Star, MessageCircle, Phone, MapPin, Shield, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import HireWorkerModal from "@/components/modals/HireWorkerModal";

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
  verificationLevel?: "basic" | "verified" | "premium";
  responseTime?: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  id,
  name,
  category,
  skills = [],
  rating,
  completedJobs = 0,
  distance = "1.2km",
  hourlyRate = 350,
  isOnline = false,
  profileImage = "/placeholder.svg",
  verificationLevel = "basic",
  responseTime = "<30min",
}) => {
  const { translateText, translateCategory } = useTranslation();
  const [showHireModal, setShowHireModal] = useState(false);

  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  // Responsive / compact design:
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow hover:shadow-md transition-all duration-150 w-full min-h-[78px] max-w-full">
        {/* Avatar + online */}
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback className="bg-gray-200 text-blue-700 font-bold rounded-lg text-xs">
              {name?.split(" ").map((n) => n[0]).join("")?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className={`absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full border-2 border-white ${isOnline ? "bg-green-400" : "bg-gray-300"}`} />
        </div>
        {/* Main info */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex gap-1 items-center mb-0.5">
            <span className="font-semibold text-sm text-gray-900 truncate">{name}</span>
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium">{translateCategory(category)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5 text-xs text-gray-500">
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-0.5 text-yellow-400" fill="currentColor" />
              {rating}
            </span>
            {completedJobs > 0 && (
              <span className="ml-1">{completedJobs} {translateText("worker.jobs", "jobs")}</span>
            )}
            <span className="flex items-center ml-1">
              <Shield className="w-3 h-3 mr-0.5 text-blue-400" />
              {verificationLevel === "premium" ? translateText("trust.premium", "Premium") : verificationLevel === "verified" ? translateText("trust.verified", "Verified") : translateText("trust.basic", "Basic")}
            </span>
            <span className="flex items-center ml-1"><MapPin className="w-3 h-3 mr-0.5" />{distance}</span>
            <span className="flex items-center ml-1"><Clock className="w-3 h-3 mr-0.5" />{responseTime}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {displayedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium text-xs"
              >
                {skill}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="text-gray-500 text-xs font-medium">+{moreSkills} {translateText('common.more', 'more')}</span>
            )}
          </div>
        </div>
        {/* Actions */}
        <div className="flex flex-col items-end gap-1">
          <Button
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold min-w-[62px] mb-1"
            onClick={() => setShowHireModal(true)}
          >
            ₹{hourlyRate} <span className="ml-0.5 font-normal text-[10px]">/{translateText("job.per_hire", "Hire")}</span>
          </Button>
          <div className="flex gap-0.5">
            <Button
              variant="outline"
              className="rounded-lg p-1 text-gray-700 border min-w-0"
              size="icon"
            >
              <Phone className="w-3.5 h-3.5" />
            </Button>
            <Button
              variant="outline"
              className="rounded-lg p-1 text-gray-700 border min-w-0"
              size="icon"
            >
              <MessageCircle className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
      <HireWorkerModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
        onHire={() => setShowHireModal(false)}
        workerName={name}
      />
    </>
  );
};

export default WorkerCard;
