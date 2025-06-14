
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Send, IndianRupee, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";

interface JobCardProps {
  id?: string | number;
  title: string;
  category: string;
  skills?: string[];
  salary: string;
  urgent?: boolean;
  distance?: string;
  postedTime?: string;
  company?: string;
  description?: string;
}

const EnhancedJobCard: React.FC<JobCardProps> = ({
  id,
  title,
  category,
  skills = [],
  salary,
  urgent = false,
  distance = "2.5km",
  postedTime = "2h ago",
  company = "Local Business",
  description = "Looking for skilled worker for immediate start"
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translateCategory, translateText } = useTranslation();

  const handleCardClick = () => {
    navigate(`/job/${id ?? title.replace(/\s+/g, '-').toLowerCase()}`, {
      state: {
        job: {
          id, title, category, skills, salary, urgent, distance, postedTime, company, description
        }
      }
    });
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: translateText('job.application_submitted', 'Application Submitted!'),
      description: translateText('job.application_description', `Your application for ${title} has been submitted.`),
    });
  };

  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  return (
    <div
      className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md w-full transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {/* Status indicator */}
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${urgent ? 'bg-red-400' : 'bg-green-400'}`} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm truncate mb-1">{title}</h3>
            <p className="text-blue-600 text-xs font-medium mb-1">{translateCategory(category)}</p>
            
            {/* Company and time */}
            <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
              <span className="truncate">{company}</span>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{postedTime}</span>
              </div>
            </div>
            
            {/* Distance */}
            <div className="flex items-center text-xs text-gray-500">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{distance}</span>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex flex-col items-end space-y-2 flex-shrink-0">
          <div className="flex items-center text-blue-600 font-bold text-sm">
            <IndianRupee className="w-4 h-4 mr-1" />
            {salary}
          </div>
          
          <Button
            onClick={handleApply}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-xs font-medium"
            size="sm"
          >
            {translateText('common.apply', 'Apply')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
