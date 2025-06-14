
import React from "react";
import { Clock, MapPin, Zap } from "lucide-react";

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
  description = "Looking for skilled worker for immediate start"
}) => (
  <div
    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all duration-200"
    tabIndex={0}
    role="listitem"
    aria-label={title}
  >
    {/* Header */}
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          {urgent && (
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              URGENT
            </div>
          )}
        </div>
        <p className="text-gray-600 mb-1">{company}</p>
        <p className="text-gray-500 text-sm">{category}</p>
      </div>
      <div className="text-right">
        <div className="text-green-600 font-bold text-lg">₹{salary}</div>
      </div>
    </div>

    {/* Description */}
    <p className="text-gray-700 mb-4 text-sm leading-relaxed">{description}</p>

    {/* Skills */}
    {skills.length > 0 && (
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-sm">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      </div>
    )}

    {/* Footer */}
    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
      <div className="flex items-center space-x-4">
        <span className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {distance}
        </span>
        <span className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {postedTime}
        </span>
      </div>
      
      {urgent && (
        <span className="text-red-600 font-medium text-xs">Quick Response Needed</span>
      )}
    </div>
  </div>
);

export default JobCard;
