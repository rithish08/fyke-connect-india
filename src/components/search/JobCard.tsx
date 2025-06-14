
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2, Star } from "lucide-react";
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
    // Navigate to job details with job data
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
    // TODO: Implement apply functionality
    console.log(`Applying for ${title}`);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Saving job: ${title}`);
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group"
      onClick={handleCardClick}
      tabIndex={0}
      role="listitem"
      aria-label={title}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{title}</h3>
            {urgent && (
              <Badge variant="destructive" className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                <Zap className="w-3 h-3 mr-1" />
                URGENT
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2 mb-2">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700 font-medium">{company}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span className="text-sm text-gray-600">{companyRating}</span>
            </div>
          </div>
          
          <p className="text-gray-500 text-sm">{category}</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">₹{salary}</div>
          <div className="text-sm text-gray-500">{applicants} applied</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 mb-4 text-sm leading-relaxed line-clamp-2">{description}</p>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-full text-sm">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500 border-t pt-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{distance}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{postedTime}</span>
          </span>
        </div>
        
        {urgent && (
          <span className="text-red-600 font-medium text-xs flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            Quick Response Needed
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1 h-11 rounded-2xl border-2 border-gray-200 hover:border-gray-300 font-medium transition-all"
          onClick={handleSaveClick}
        >
          Save
        </Button>
        <Button
          className="flex-1 h-11 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-medium transition-all hover:shadow-lg"
          onClick={handleApplyClick}
        >
          Apply Now
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
