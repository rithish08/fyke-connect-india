
import React, { useState } from "react";
import { MapPin, Clock, CheckCircle, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import CommunicationButtons from "@/components/communication/CommunicationButtons";

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
  showCommunication?: boolean;
  employerId?: string;
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
  showCommunication = false,
  employerId = "employer1"
}) => {
  const { toast } = useToast();
  const { translateCategory, translateText } = useTranslation();
  const [applicationState, setApplicationState] = useState<'idle' | 'requested'>('idle');

  const displayedSkills = skills.slice(0, 2);
  const moreSkills = skills.length > 2 ? skills.length - 2 : 0;

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    setApplicationState('requested');
    toast({
      title: translateText('job.application_submitted', 'Application Submitted!'),
      description: translateText('job.application_description', `Your application for ${title} has been submitted.`),
    });
  };

  return (
    <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 flex items-start min-h-[96px] gap-3 cursor-pointer hover:shadow-md">
      <div className="relative shrink-0">
        <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center">
          <CheckCircle className={`w-7 h-7 ${urgent ? "text-red-400" : "text-green-400"}`} />
        </div>
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex gap-2 items-center mb-0.5">
          <span className="font-semibold leading-4 text-base text-gray-900 truncate max-w-[145px]">{title}</span>
          <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">{translateCategory(category)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-600">
          <span>{company}</span>
          <span className="mx-1 text-gray-300 font-bold">·</span>
          <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5" />{postedTime}</span>
          <span className="mx-1 text-gray-300 font-bold">·</span>
          <span className="flex items-center"><MapPin className="w-3 h-3 text-gray-400 mr-0.5" />{distance}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-0.5">
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
      <div className="flex flex-col gap-1 items-end justify-between ml-2">
        <Button
          className={`h-8 px-3 rounded-lg text-xs font-semibold shadow border-none outline-none min-w-[60px] text-white transition-all ${
            applicationState === 'requested' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gradient-to-tr from-blue-500 via-sky-400 to-indigo-400 hover:scale-105 hover:bg-blue-600'
          }`}
          onClick={handleApply}
          disabled={applicationState === 'requested'}
        >
          {applicationState === 'requested' 
            ? translateText('common.requested', 'Requested') 
            : `₹${salary}/${translateText("common.apply", "Apply")}`
          }
        </Button>
        
        {showCommunication && (
          <div className="flex gap-1 mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Chat feature coming soon!" });
              }}
              className="p-1.5 rounded-md bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast({ title: "Call feature coming soon!" });
              }}
              className="p-1.5 rounded-md bg-green-50 hover:bg-green-100 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-green-600" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedJobCard;
