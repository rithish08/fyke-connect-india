
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  title: string;
  category: string;
  skills?: string[];
  salary: string;
  urgent?: boolean;
  distance?: string;
  postedTime?: string;
  company?: string;
  description?: string;
  companyRating?: number;
  applicants?: number;
}

const JobCard: React.FC<JobCardProps> = ({ 
  title, 
  category, 
  skills = [], 
  salary,
  urgent = false,
  distance = "2.5km",
  postedTime = "2h ago",
  company = "Local Business",
  description = "Looking for skilled worker for immediate start",
  companyRating = 4.5,
  applicants = 12
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/job/${title.replace(/\s+/g, '-').toLowerCase()}`, {
      state: {
        job: {
          id: title.replace(/\s+/g, '-').toLowerCase(),
          title,
          category,
          skills,
          salary,
          urgent,
          distance,
          postedTime,
          company,
          description,
          companyRating,
          applicants
        }
      }
    });
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Applying for ${title}`);
  };

  return (
    <div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group"
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between mb-3">
        {/* Left Section - Job Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            {urgent && (
              <Badge variant="destructive" className="bg-red-500 text-white text-xs px-2 py-0.5 font-bold">
                <Zap className="w-3 h-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-1">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700 font-medium truncate">{company}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-xs text-gray-600">{companyRating}</span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mb-2 truncate">{category}</p>
          
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3" />
              <span>{distance}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{postedTime}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{applicants} applied</span>
            </div>
          </div>
        </div>
        
        {/* Right Section - Salary + Action */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="text-right">
            <div className="text-xl font-bold text-green-600">₹{salary}</div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
          
          <Button
            size="sm"
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all"
            onClick={handleApplyClick}
          >
            Apply
          </Button>
        </div>
      </div>
      
      {/* Skills - Compact Row */}
      {skills.length > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs">
                +{skills.length - 4}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobCard;
