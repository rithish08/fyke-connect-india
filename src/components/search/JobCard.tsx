
import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MapPin, Zap, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div
      className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow flex items-center transition hover:shadow-xl hover:scale-[1.01] cursor-pointer min-h-[100px] select-none"
      onClick={handleCardClick}
      tabIndex={0}
      aria-label={`View job: ${title}`}
      onKeyDown={(e) => { if (e.key === "Enter") handleCardClick(); }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900 text-base truncate">{title}</h3>
          {urgent && (
            <Badge variant="destructive" className="bg-red-500 text-white font-bold text-xs flex items-center gap-1 px-1.5 py-0.5">
              <Zap className="w-3 h-3" />
              URGENT
            </Badge>
          )}
        </div>
        <div className="flex gap-1.5 items-center mt-0.5 text-xs text-gray-700 font-medium">
          <Building2 className="w-4 h-4 text-gray-300" />
          <span className="truncate">{company}</span>
        </div>
        <div className="flex gap-3 items-center mt-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {distance}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {postedTime}
          </span>
        </div>
        {skills.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {skills.slice(0, 3).map((skill, i) => (
              <span key={i} className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium text-gray-800">{skill}</span>
            ))}
          </div>
        )}
      </div>
      <div className="ml-5 flex flex-col justify-between items-end shrink-0 h-full">
        <div className="font-bold text-green-600 text-lg mb-1">₹{salary}</div>
        <Button
          size="sm"
          className="rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-bold shadow-none transition hover:bg-blue-50 hover:text-blue-700"
          tabIndex={-1}
          // On click, navigate (handled by card click) - could trigger apply here if needed
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

export default JobCard;
