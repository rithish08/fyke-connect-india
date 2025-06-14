
import React from "react";
import TrustScore from "@/components/trust/TrustScore";
import SkillBadge from "@/components/verification/SkillBadge";

interface WorkerCardProps {
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs?: number;
  verificationLevel?: 'basic' | 'verified' | 'premium';
  responseTime?: string;
}

const WorkerCard: React.FC<WorkerCardProps> = ({ 
  name, 
  category, 
  skills = [], 
  rating,
  completedJobs = 0,
  verificationLevel = 'basic',
  responseTime = '< 1hr'
}) => {
  return (
    <div
      className="mb-4 bg-white border border-gray-100 rounded-xl shadow p-4 animate-fade-in hover-scale transition-all group"
      tabIndex={0}
      role="listitem"
      aria-label={`${name}, ${category}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-bold text-gray-900 text-base">{name}</div>
          <div className="text-xs text-gray-500 mt-0.5">{category}</div>
        </div>
        <div className="text-right">
          <div className="text-yellow-600 font-bold text-xs flex items-center">
            {rating}★
          </div>
        </div>
      </div>

      <TrustScore
        score={rating}
        verificationLevel={verificationLevel}
        completedJobs={completedJobs}
        responseTime={responseTime}
        className="mb-3"
      />

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 3).map((skill, idx) => (
            <SkillBadge
              key={idx}
              skill={skill}
              level={idx === 0 ? 'expert' : 'intermediate'}
              verified={idx < 2}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerCard;
