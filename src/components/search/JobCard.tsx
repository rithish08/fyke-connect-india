
import React from "react";

interface JobCardProps {
  title: string;
  category: string;
  skills?: string[];
  salary: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, category, skills = [], salary }) => (
  <div
    className="mb-4 bg-white border border-gray-100 rounded-xl shadow p-4 animate-fade-in hover-scale transition-all group"
    tabIndex={0}
    role="listitem"
    aria-label={title}
  >
    <div className="font-bold text-base text-gray-900">{title}</div>
    <div className="text-xs text-gray-500 mt-0.5">
      <span className="font-semibold">{category}</span>
      {skills.length > 0 && (
        <span className="ml-2">
          {skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="inline-block px-1 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px] mr-1">
              {skill}
            </span>
          ))}
        </span>
      )}
      <span className="ml-2 px-1.5 py-0.5 bg-green-50 text-green-700 font-semibold rounded-full text-[11px]">{salary} ₹</span>
    </div>
  </div>
);

export default JobCard;
