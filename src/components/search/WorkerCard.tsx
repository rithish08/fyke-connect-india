
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, MessageCircle, Phone, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { translateText, translateCategory } = useTranslation();
  const [showHireModal, setShowHireModal] = useState(false);

  const handleProfileClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/worker/${id}`);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: translateText('common.call', 'Calling...'),
      description: translateText('hire.calling_worker', `Calling ${name}`),
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
        className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md w-full transition-all duration-200 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="flex items-center justify-between">
          {/* Left section with avatar and info */}
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Status indicator */}
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
            
            {/* Avatar */}
            <Avatar className="h-12 w-12 rounded-xl flex-shrink-0">
              <AvatarImage src={profileImage} alt={name} />
              <AvatarFallback className="bg-blue-500 text-white font-bold rounded-xl">
                {name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">{name}</h3>
              <p className="text-blue-600 text-xs font-medium mb-1">{translateCategory(category)}</p>
              
              {/* Rating and distance */}
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                  <span className="font-medium">{rating}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  <span>{distance}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right section with price and actions */}
          <div className="flex flex-col items-end space-y-2 flex-shrink-0">
            <div className="text-blue-600 font-bold text-sm">₹{hourlyRate}/{translateText('hire.per_hour', 'hr')}</div>
            
            {/* Action buttons */}
            <div className="flex flex-col space-y-1">
              <Button
                onClick={handleHireClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
                size="sm"
              >
                {translateText('common.hire', 'Hire')}
              </Button>
              
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCall}
                  className="p-1 rounded-lg border border-gray-200 w-8 h-8"
                >
                  <Phone className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleChat}
                  className="p-1 rounded-lg border border-gray-200 w-8 h-8"
                >
                  <MessageCircle className="w-3 h-3" />
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
