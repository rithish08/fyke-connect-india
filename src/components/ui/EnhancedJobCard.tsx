
import React from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Star, Send, IndianRupee } from "lucide-react";
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

  const displayedSkills = skills.slice(0, 3);
  const moreSkills = skills.length > 3 ? skills.length - 3 : 0;

  return (
    <div
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md w-full transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        {/* Left section */}
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          {/* Status indicator */}
          <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate mb-1">{title}</h3>
            <p className="text-blue-600 text-sm font-medium mb-2">{translateCategory(category)}</p>
            
            {/* Skills and info */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {displayedSkills.map((skill, i) => (
                <span key={i} className="text-gray-600 text-sm">
                  {translateCategory(skill)}
                </span>
              ))}
              {moreSkills > 0 && (
                <span className="text-gray-400 text-sm">
                  +{moreSkills} {translateText('common.more', 'more')}
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

        {/* Right section */}
        <div className="flex flex-col items-end space-y-2 flex-shrink-0 ml-4">
          <div className="flex items-center text-blue-600 font-bold text-lg">
            <IndianRupee className="w-5 h-5 mr-1" />
            {salary}
          </div>
          
          <div className="flex flex-col space-y-1 w-full">
            <Button
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium w-full sm:w-auto"
              size="sm"
            >
              {translateText('common.apply', 'Apply')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
