
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, MapPin } from "lucide-react";
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

  const displayedSkills = skills.slice(0, 3);
  const moreSkills = skills.length > 3 ? skills.length - 3 : 0;

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
        className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md w-full transition-all duration-200 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="flex items-start justify-between">
          {/* Left section */}
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
            
            {/* Avatar and content */}
            <div className="flex space-x-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12 rounded-full flex-shrink-0">
                <AvatarImage src={profileImage} alt={name} />
                <AvatarFallback className="bg-blue-500 text-white font-bold">
                  {name.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-base truncate mb-1">{name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-2">{category}</p>
                
                {/* Rating and skills */}
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span className="text-sm font-medium text-gray-900">{rating}</span>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {displayedSkills.map((skill, i) => (
                    <span key={i} className="text-gray-600 text-sm">
                      {skill}
                    </span>
                  ))}
                  {moreSkills > 0 && (
                    <span className="text-gray-400 text-sm">
                      +{moreSkills} more
                    </span>
                  )}
                </div>
                
                {/* Distance */}
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{distance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right section */}
          <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
            <div className="text-blue-600 font-bold text-lg">₹{hourlyRate}/Hire</div>
            
            <div className="flex flex-col space-y-1 w-full">
              <Button
                onClick={handleHireClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
                size="sm"
              >
                Hire
              </Button>
              
              <div className="flex space-x-1 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="p-2 rounded-lg border border-gray-200"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChat}
                  className="p-2 rounded-lg border border-gray-200"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
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
