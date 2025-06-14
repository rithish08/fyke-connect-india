
import React from "react";

interface WorkerCardProps {
  name: string;
  category: string;
  skills: string[];
  rating: number;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ name, category, skills = [], rating }) => {
  return (
    <div
      className="mb-4 bg-white border border-gray-100 rounded-xl shadow p-4 flex flex-col sm:flex-row items-start sm:items-center animate-fade-in hover-scale transition-all group"
      tabIndex={0}
      role="listitem"
      aria-label={`${name}, ${category}`}
    >
      <div className="font-bold text-gray-900 text-base">{name}</div>
      <div className="text-xs text-gray-500 sm:ml-2 mt-0.5 sm:mt-0">{category}</div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1 ml-0 sm:ml-4 mt-1 sm:mt-0">
          {skills.slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="inline-block bg-sky-50 text-sky-800 font-medium px-2 py-0.5 rounded-full text-[11px] shadow-none border border-sky-200"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      <div className="ml-auto mt-2 sm:mt-0 text-yellow-600 font-bold text-xs flex items-center">
        {rating}★
      </div>
    </div>
  );
};

export default WorkerCard;
