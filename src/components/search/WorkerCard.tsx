
import React from 'react';
import { useNavigate } from 'react-router-dom';
import WorkerAvatar from './WorkerAvatar';
import WorkerInfo from './WorkerInfo';
import WorkerActions from './WorkerActions';

interface WorkerCardProps {
  id: string | number;
  name: string;
  category: string;
  skills: string[];
  rating: number;
  completedJobs?: number;
  verificationLevel?: 'basic' | 'verified' | 'premium';
  responseTime?: string;
  distance?: string;
  hourlyRate?: number;
  isOnline?: boolean;
  profileImage?: string;
  onClick?: (worker: any) => void;
  showModal?: (worker: any) => void;
}

const WorkerCard: React.FC<WorkerCardProps> = ({
  id,
  name,
  category,
  skills = [],
  rating,
  completedJobs = 0,
  verificationLevel = 'basic',
  responseTime = '< 1hr',
  distance = '1.2 km',
  hourlyRate = 350,
  isOnline = false,
  profileImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  onClick,
}) => {
  const navigate = useNavigate();

  const handleCardClick = (e: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigate(`/worker/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(`/worker/${id}`);
    }
  };

  return (
    <div
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm w-full max-w-2xl transition-all duration-200 cursor-pointer group hover:shadow-md hover:border-gray-200 flex items-start"
      tabIndex={0}
      role="button"
      aria-label={`Open profile of ${name}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      style={{ minHeight: '130px' }}
    >
      <WorkerAvatar
        name={name}
        profileImage={profileImage}
        isOnline={isOnline}
        verificationLevel={verificationLevel}
      />
      
      <WorkerInfo
        name={name}
        category={category}
        rating={rating}
        distance={distance}
        skills={skills}
      />
      
      <WorkerActions
        id={id}
        name={name}
        hourlyRate={hourlyRate}
      />
    </div>
  );
};

export default WorkerCard;
