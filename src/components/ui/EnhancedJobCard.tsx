
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
    setTimeout(() => setShowApplied(false), 1000);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-3 shadow hover:shadow-md transition-all duration-150 w-full min-h-[78px] max-w-full">
      {/* Avatar/status */}
      <div className="relative shrink-0">
        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <CheckCircle className={`w-7 h-7 ${urgent ? "text-red-400" : "text-green-400"}`} />
        </div>
        <span className={`absolute bottom-1 left-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
          urgent ? "bg-red-400" : "bg-green-400"
        }`} />
      </div>
      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex gap-1 items-center mb-0.5">
          <span className="font-semibold text-sm text-gray-900 truncate">
            {title}
          </span>
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[11px] font-medium">
            {translateCategory(category)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
          <span>{company}</span>
          <span className="flex items-center ml-1"><Clock className="w-3 h-3 mr-0.5" />{postedTime}</span>
          <span className="flex items-center ml-1"><MapPin className="w-3 h-3 mr-0.5" />{distance}</span>
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
      <div className="flex flex-col items-end gap-1">
        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-semibold min-w-[62px] mb-1 disabled:bg-gray-200 disabled:text-gray-500"
          onClick={handleApply}
          disabled={showApplied}
        >
          <IndianRupee className="w-3 h-3 mr-0.5 inline" />
          {salary}
          <span className="ml-0.5 font-normal text-[10px]">/{translateText("common.apply", "Apply")}</span>
        </Button>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
