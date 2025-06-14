
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
}

const JobCard: React.FC<JobCardProps> = ({ 
  title, 
  category, 
  skills = [], 
  salary,
  urgent = false,
  distance = "2.5km",
  postedTime = "2h ago"
}) => (
  <div
    className={`mb-4 bg-white border rounded-xl shadow p-4 animate-fade-in hover-scale transition-all group relative ${
      urgent ? 'border-orange-300 bg-gradient-to-r from-orange-50 to-yellow-50' : 'border-gray-100'
    }`}
    tabIndex={0}
    role="listitem"
    aria-label={title}
  >
    {urgent && (
      <div className="absolute top-2 right-2">
        <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
          <Zap className="w-3 h-3 mr-1" />
          URGENT
        </div>
      </div>
    )}

    <div className="font-bold text-base text-gray-900 pr-16">{title}</div>
    
    <div className="flex items-center justify-between mt-2">
      <div className="text-xs text-gray-500">
        <span className="font-semibold">{category}</span>
        
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="inline-block px-1 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px]">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-right">
        <div className="px-1.5 py-0.5 bg-green-50 text-green-700 font-semibold rounded-full text-[11px]">
          {salary} ₹
        </div>
      </div>
    </div>

    <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
      <div className="flex items-center space-x-3">
        <span className="flex items-center">
          <MapPin className="w-3 h-3 mr-1" />
          {distance}
        </span>
        <span className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          {postedTime}
        </span>
      </div>
      
      {urgent && (
        <span className="text-orange-600 font-medium">Quick Response Needed</span>
      )}
    </div>
  </div>
);

export default JobCard;
