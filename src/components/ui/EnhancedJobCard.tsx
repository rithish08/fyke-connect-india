
import React, { useState } from "react";
import { MapPin, Clock, CheckCircle, MessageCircle, Phone } from "lucide-react";
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
  showCommunication = true,
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

  const handleCommunication = (type: 'chat' | 'call', e: React.MouseEvent) => {
    e.stopPropagation();
    toast({ 
      title: `${type === 'chat' ? 'Chat' : 'Call'} feature coming soon!`,
      description: `${type === 'chat' ? 'Messaging' : 'Calling'} ${company} will be available soon.`
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 hover:shadow-md cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center">
            <CheckCircle className={`w-7 h-7 ${urgent ? "text-red-400" : "text-green-400"}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 items-center mb-1">
            <span className="font-semibold leading-5 text-base text-gray-900 truncate">{title}</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium whitespace-nowrap">
              {translateCategory(category)}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600 mb-2">
            <span>{company}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" />{postedTime}</span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" />{distance}</span>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {displayedSkills.map((skill) => (
              <span
                key={skill}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {moreSkills > 0 && (
              <span className="text-gray-500 text-xs font-medium">+{moreSkills} more</span>
            )}
          </div>
          
          <div className="flex items-center justify-between gap-3">
            <Button
              className={`h-9 px-4 rounded-lg text-sm font-semibold transition-all ${
                applicationState === 'requested' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
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
              <div className="flex gap-2">
                <button
                  onClick={(e) => handleCommunication('chat', e)}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  title="Chat"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                </button>
                <button
                  onClick={(e) => handleCommunication('call', e)}
                  className="p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                  title="Call"
                >
                  <Phone className="w-4 h-4 text-green-600" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedJobCard;
