
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2, Send, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
      className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md w-full max-w-2xl transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`View job: ${title}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
              {urgent && (
                <Badge className="bg-red-500 text-white text-xs flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  {translateText('common.urgent', 'URGENT')}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Building2 className="w-4 h-4" />
              <span>{company}</span>
              <span className="text-gray-300">|</span>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {translateCategory(category)}
              </span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {distance}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {postedTime}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-xl font-bold text-green-600 mb-2">
              <IndianRupee className="w-5 h-5 mr-1" />
              {salary}
            </div>
            <Button
              onClick={handleApply}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              tabIndex={-1}
            >
              <Send className="w-4 h-4 mr-1" />
              {translateText('common.apply', 'Apply')}
            </Button>
          </div>
        </div>

        {/* Skills */}
        {displayedSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayedSkills.map((skill, i) => (
              <span
                key={i}
                className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700"
              >
                {translateCategory(skill)}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="text-xs text-gray-400">
                +{moreSkills} {translateText('common.more', 'more')}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
