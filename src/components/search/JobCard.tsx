
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2, Send, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

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

const JobCard: React.FC<JobCardProps> = ({
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

  const handleCardClick = () => {
    navigate(`/job/${id ?? title.replace(/\s+/g, '-').toLowerCase()}`, {
      state: {
        job: {
          id,
          title,
          category,
          skills,
          salary,
          urgent,
          distance,
          postedTime,
          company,
          description
        }
      }
    });
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: "Application Submitted!",
      description: `Your application for ${title} has been submitted.`,
    });
  };

  return (
    <div
      className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`View job: ${title}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-gray-900 text-lg truncate">{title}</h3>
              {urgent && (
                <Badge className="bg-red-500 text-white text-xs px-2.5 py-1 flex items-center gap-1.5 font-semibold">
                  <Zap className="w-3 h-3" />
                  URGENT
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 truncate">{company}</span>
            </div>
          </div>

          {/* Salary Display */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center text-2xl font-bold text-green-600 mb-1">
              <IndianRupee className="w-5 h-5 mr-1" />
              {salary}
            </div>
            <div className="text-xs text-gray-500 font-medium">salary</div>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{distance}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="font-medium">{postedTime}</span>
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-700">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-xs text-gray-500 py-1.5 font-medium">+{skills.length - 3} more</span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>

        {/* Apply Button */}
        <div className="pt-2">
          <Button
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all"
            onClick={handleApply}
            tabIndex={-1}
          >
            <Send className="w-5 h-5 mr-2" />
            Apply Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
