
import React from "react";
import EnhancedJobCard from "@/components/ui/EnhancedJobCard";

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

const JobCard: React.FC<JobCardProps> = (props) => {
  return <EnhancedJobCard {...props} />;
};

export default JobCard;
