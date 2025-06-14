
import React, { useState } from "react";
import { MapPin, Clock, IndianRupee, CheckCircle } from "lucide-react";
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
  const { toast } = useToast();
  const { translateCategory, translateText } = useTranslation();
  const [showApplied, setShowApplied] = useState(false);

  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowApplied(true);
    toast({
      title: translateText('job.application_submitted', 'Application Submitted!'),
      description: translateText('job.application_description', `Your application for ${title} has been submitted.`),
    });
    setTimeout(() => setShowApplied(false), 1500);
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl flex flex-row items-center px-3 py-3 shadow-sm min-h-[90px] max-w-full md:max-w-2xl gap-4 hover:shadow-lg transition-all duration-150 mb-3 w-full">
      {/* Avatar/status */}
      <div className="relative">
        <div className="h-14 w-14 bg-gray-100 rounded-xl flex items-center justify-center">
          <CheckCircle className={`w-8 h-8 ${urgent ? "text-red-400" : "text-green-400"}`} />
        </div>
        <span className={`absolute bottom-1 left-1 w-3 h-3 rounded-full border-2 border-white ${
          urgent ? "bg-red-400" : "bg-green-400"
        }`} />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="font-semibold text-gray-900 text-base leading-tight">
            {title}
          </span>
          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium w-max">
            {translateCategory(category)}
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
          <span>{company}</span>
          <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5" />{postedTime}</span>
          <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5" />{distance}</span>
        </div>
        {/* Skill tags */}
        <div className="flex flex-wrap mt-1 gap-1">
          {displayedSkills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium text-xs"
            >
              {skill}
            </span>
          ))}
          {moreSkills > 0 && (
            <span className="text-gray-500 text-xs font-medium">+{moreSkills} {translateText('common.more', 'more')}</span>
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="flex flex-col justify-between items-end gap-2 h-full min-w-[120px]">
        <Button
          className="font-semibold text-[15px] px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl text-white hover:from-blue-600 hover:to-blue-500 shadow-md w-full mb-2 disabled:bg-gray-200 disabled:text-gray-500"
          onClick={handleApply}
          disabled={showApplied}
        >
          <IndianRupee className="w-4 h-4 mr-1 inline" />
          {salary}
          <span className="ml-1 font-normal text-xs">
            /{translateText("common.apply", "Apply")}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
