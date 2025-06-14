
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2, Send, IndianRupee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  companyImage?: string;
  rating?: number;
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
  description = "Looking for skilled worker for immediate start",
  companyImage = "/placeholder.svg",
  rating = 4.5
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
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 w-full max-w-2xl transition-all duration-200 cursor-pointer group flex items-start min-h-[120px]"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`View job: ${title}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      {/* Company Logo section */}
      <div className="flex flex-col justify-start items-center pr-4 pt-1">
        <div className="relative">
          <Avatar className="h-20 w-20 rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
            <AvatarImage 
              src={companyImage} 
              alt={company} 
              className="object-cover h-20 w-20 rounded-xl" 
            />
            <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white font-bold text-xl rounded-xl">
              {company
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {urgent && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center z-10">
              <Zap className="w-3 h-3 text-white" fill="currentColor" />
            </span>
          )}
        </div>
      </div>

      {/* Main info section */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-1">
        <div>
          {/* Job Title & Urgent Badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-lg text-gray-900 truncate max-w-[200px]">
              {title}
            </span>
            {urgent && (
              <Badge className="bg-red-500 text-white text-xs px-2.5 py-1 flex items-center gap-1.5 font-semibold">
                <Zap className="w-3 h-3" />
                {translateText('common.urgent', 'URGENT')}
              </Badge>
            )}
          </div>

          {/* Company & Category */}
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 truncate">{company}</span>
            <span className="text-gray-300">|</span>
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {translateCategory(category)}
            </span>
          </div>

          {/* Rating + Distance + Time */}
          <div className="flex items-center gap-3 mb-2 text-gray-600 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
              <span className="font-medium">{rating}</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-500">{distance}</span>
            </div>
            <span className="text-gray-300">|</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-gray-400" />
              <span className="text-sm text-gray-500">{postedTime}</span>
            </div>
          </div>

          {/* Skills */}
          {displayedSkills.length > 0 && (
            <div className="flex flex-row flex-wrap items-center gap-1 mb-1">
              {displayedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700 font-medium"
                >
                  {translateCategory(skill)}
                </span>
              ))}
              {moreSkills > 0 && (
                <span className="text-xs text-gray-400 ml-1">
                  +{moreSkills} {translateText('common.more', 'more')}
                </span>
              )}
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
        </div>
      </div>

      {/* Right side - Salary & Apply */}
      <div className="flex flex-col items-end justify-center pl-3 min-w-[90px]">
        <div className="text-right mb-3">
          <div className="flex items-center text-2xl font-bold text-green-600 mb-1">
            <IndianRupee className="w-5 h-5 mr-1" />
            {salary}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {translateText('common.salary', 'salary')}
          </div>
        </div>
        
        <Button
          onClick={handleApply}
          className="h-11 w-28 px-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-150 border-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-400"
          tabIndex={-1}
        >
          <Send className="w-4 h-4 mr-1" />
          {translateText('common.apply', 'Apply')}
        </Button>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
