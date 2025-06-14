
import React from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Star } from 'lucide-react';

interface ProfileStatsProps {
  userRole: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userRole }) => (
  <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white flex justify-between items-center">
    <div className="flex flex-col items-center justify-center flex-1">
      <span className="flex items-center gap-1 text-blue-800 font-bold text-2xl">
        <Star className="w-6 h-6 text-blue-500 mr-1" /> 4.5
      </span>
      <span className="text-xs text-blue-600 font-medium mt-1">Rating</span>
    </div>
    <div className="h-12 w-0.5 bg-gray-100 rounded-full mx-3" />
    <div className="flex flex-col items-center justify-center flex-1">
      <span className="flex items-center gap-1 text-red-700 font-bold text-2xl">
        <span className="bg-red-50 rounded-full p-0.5 mr-1"><svg width="20" height="20" fill="none" stroke="currentColor" className="text-red-500"><path d="M10 2v5"/><path d="M10 14v1"/><path d="M7 9a3 3 0 0 1 6 0c0 2-2 4-3 4s-3-2-3-4z"/></svg></span>
        12
      </span>
      <span className="text-xs text-red-500 font-medium mt-1">{userRole === 'jobseeker' ? 'Applications' : 'Jobs Posted'}</span>
    </div>
  </ModernCard>
);

export default ProfileStats;
