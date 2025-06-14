
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
        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md w-full max-w-2xl transition-all duration-200 cursor-pointer"
        tabIndex={0}
        role="button"
        aria-label={`View profile of ${name}`}
        onClick={handleProfileClick}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleProfileClick();
        }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12 rounded-full">
                  <AvatarImage src={profileImage} alt={name} />
                  <AvatarFallback className="bg-blue-500 text-white font-bold">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                )}
                {verificationLevel !== "basic" && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
                  </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
                <p className="text-sm text-gray-600 mb-1">{category}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{rating}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {distance}
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600 mb-2">₹{hourlyRate}/hr</div>
              <Button
                onClick={handleHireClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                tabIndex={-1}
              >
                Hire Now
              </Button>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2">
            {displayedSkills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
              >
                {skill}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="text-xs text-gray-400">
                +{moreSkills} more
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-xs text-gray-500">{completedJobs} jobs completed</span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCall}
                tabIndex={-1}
              >
                <Phone className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleChat}
                tabIndex={-1}
              >
                <MessageCircle className="w-4 h-4" />
              </Button>
            </div>
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
