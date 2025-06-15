import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const JobSeekerJobCard = ({ job }: { job: any }) => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden shadow border border-gray-100 transition-transform hover:scale-[1.01] group cursor-pointer"
      onClick={() => navigate(`/job-details/${job.id}`)}
    >
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{job.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">{job.company}</p>
      </div>
      <div className="flex items-center justify-between pt-4 px-4 pb-2">
        <div>
          <span className="text-xs text-gray-600">₹{job.salary}</span>
        </div>
        <Button
          size="sm"
          className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium px-4 ml-2"
          onClick={e => {
            e.stopPropagation();
            navigate(`/job-details/${job.id}`);
          }}
        >
          View Details
        </Button>
      </div>
    </div>
  );
};
export default JobSeekerJobCard;
