
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, MessageCircle, Phone, Building2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalToast } from "@/hooks/useGlobalToast";
import { handleJobApplication, handleEmployerContact } from "@/utils/communicationHandlers";

interface EnhancedJobCardProps {
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
  salaryPeriod?: string;
}

const EnhancedJobCard: React.FC<EnhancedJobCardProps> = ({
  id,
  title,
  category,
  skills = [],
  salary,
  urgent = false,
  distance,
  postedTime,
  company,
  description,
  showCommunication = true,
  employerId,
  salaryPeriod = 'day'
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useGlobalToast();

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id || !title) {
      showError('Job information is incomplete');
      return;
    }

    if (user?.role === 'employer') {
      showError('Employers cannot apply for jobs');
      return;
    }

    try {
      handleJobApplication(id.toString(), title, navigate);
      showSuccess(`Applied for ${title}!`);
    } catch (error) {
      showError('Failed to apply for job');
    }
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!employerId || !company) {
      showError('Employer contact information not available');
      return;
    }

    console.log('Initiating chat with employer:', { employerId, company });
    handleEmployerContact(employerId, company, navigate, `Job: ${title}`);
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    showSuccess('Phone feature coming soon!');
  };

  const handleViewDetails = () => {
    if (id) {
      navigate(`/job/${id}`);
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 border border-gray-100 bg-white rounded-2xl cursor-pointer" onClick={handleViewDetails}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-bold text-gray-900 truncate">{title}</h3>
              {urgent && (
                <Badge variant="destructive" className="text-xs px-2 py-0.5">
                  Urgent
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
              {company && (
                <span className="flex items-center space-x-1">
                  <Building2 className="w-3 h-3" />
                  <span className="truncate">{company}</span>
                </span>
              )}
              {distance && (
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{distance}</span>
                </span>
              )}
            </div>

            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
              {category}
            </Badge>
          </div>
          
          <div className="text-right ml-4">
            <div className="font-bold text-green-600">₹{salary}</div>
            <div className="text-xs text-gray-500">per {salaryPeriod}</div>
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 3).map((skill: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-0.5 bg-gray-50 text-gray-700 border-gray-200"
              >
                {skill}
              </Badge>
            ))}
            {skills.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{skills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            {postedTime && (
              <span className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{postedTime}</span>
              </span>
            )}
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
              <span>4.5</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {showCommunication && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={handleChat}
                >
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={handleCall}
                >
                  <Phone className="w-3 h-3" />
                </Button>
              </>
            )}
            
            {user?.role === 'jobseeker' ? (
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700"
                onClick={handleApply}
              >
                Apply
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewDetails();
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedJobCard;
