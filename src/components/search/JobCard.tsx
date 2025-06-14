
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2, Send } from "lucide-react";
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
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`View job: ${title}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="flex items-center justify-between">
        {/* Main Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 text-base truncate">{title}</h3>
            {urgent && (
              <Badge className="bg-red-500 text-white text-xs px-2 py-0.5 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                URGENT
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 truncate">{company}</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{postedTime}</span>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 2).map((skill, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                  {skill}
                </span>
              ))}
              {skills.length > 2 && (
                <span className="text-xs text-gray-500 py-1">+{skills.length - 2} more</span>
              )}
            </div>
          )}
        </div>

        {/* Salary & Apply Button */}
        <div className="flex flex-col items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">₹{salary}</div>
            <div className="text-xs text-gray-500">salary</div>
          </div>
          
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2"
            onClick={handleApply}
            tabIndex={-1}
          >
            <Send className="w-4 h-4" />
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
