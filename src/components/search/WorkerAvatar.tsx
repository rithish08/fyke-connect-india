
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface WorkerAvatarProps {
  name: string;
  profileImage: string;
  isOnline: boolean;
  verificationLevel: string;
}

const WorkerAvatar: React.FC<WorkerAvatarProps> = ({
  name,
  profileImage,
  isOnline,
  verificationLevel
}) => {
  return (
    <div className="flex flex-col justify-start items-center pr-3 pt-1">
      <div className="relative">
        <Avatar className="h-14 w-14 rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <AvatarImage src={profileImage} alt={name} className="object-cover h-14 w-14 rounded-lg" />
          <AvatarFallback className="bg-blue-300 text-white font-bold text-sm rounded-lg">
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white z-40" />
        )}
        {verificationLevel !== 'basic' && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white flex items-center justify-center z-40">
            <CheckCircle className="w-3 h-3 text-white" fill="currentColor" />
          </span>
        )}
      </div>
    </div>
  );
};

export default WorkerAvatar;
