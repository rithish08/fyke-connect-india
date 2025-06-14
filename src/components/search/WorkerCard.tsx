
import React, { useState } from "react";
import { Star, MessageCircle, Phone, MapPin } from "lucide-react";
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
}) => {
  const { translateText, translateCategory } = useTranslation();
  const [showHireModal, setShowHireModal] = useState(false);

  // Skills logic (up to 2 shown)
  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Call logic here
  };
  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Chat logic here
  };

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl flex flex-row items-center px-3 py-3 shadow-sm min-h-[90px] max-w-full md:max-w-2xl gap-4 hover:shadow-lg transition-all duration-150 mb-3 w-full">
        {/* Avatar and status */}
        <div className="relative">
          <Avatar className="h-14 w-14 rounded-xl">
            <AvatarImage src={profileImage} alt={name} />
            <AvatarFallback className="bg-gray-200 text-blue-700 font-bold rounded-xl">
              {name?.split(" ").map((n) => n[0]).join("")?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-1 left-1 w-3 h-3 rounded-full border-2 border-white ${
              isOnline ? "bg-green-400" : "bg-gray-300"
            }`}
          />
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="font-semibold text-gray-900 text-base leading-tight">
              {name}
            </span>
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium w-max">
              {translateCategory(category)}
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
            <span className="flex items-center">
              <Star className="w-3 h-3 mr-0.5 text-yellow-400" fill="currentColor" />
              {rating}
            </span>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5" />{distance}</span>
          </div>
          {/* Skill tags */}
          <div className="flex flex-wrap mt-1 gap-1">
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
        <div className="flex flex-col justify-between items-end gap-2 h-full min-w-[120px]">
          <Button
            className="font-semibold text-[15px] px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl text-white hover:from-blue-600 hover:to-blue-500 shadow-md w-full mb-2"
            onClick={() => setShowHireModal(true)}
          >
            ₹{hourlyRate}
            <span className="ml-1 font-normal text-xs">
              /{translateText("job.per_hire", "Hire")}
            </span>
          </Button>
          <div className="flex flex-col w-full gap-2">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-xl px-0 py-2 text-gray-800 border"
              onClick={handleCall}
            >
              <Phone className="w-4 h-4 mr-1" />
              <span className="text-sm">{translateText("common.call", "Call")}</span>
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 rounded-xl px-0 py-2 text-gray-800 border"
              onClick={handleChat}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              <span className="text-sm">{translateText("common.chat", "Chat")}</span>
            </Button>
          </div>
        </div>
      </div>
      <HireWorkerModal
        open={showHireModal}
        onClose={() => setShowHireModal(false)}
        onHire={() => {
          // TODO: connect hire logic
          setShowHireModal(false);
        }}
        workerName={name}
      />
    </>
  );
};

export default WorkerCard;
