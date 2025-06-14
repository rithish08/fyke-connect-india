
import React from 'react';
import { Trophy, Star, Target, Gift } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface UserLevelProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  badges: string[];
  completedJobs: number;
}

const UserLevel = ({ 
  currentLevel, 
  currentXP, 
  nextLevelXP, 
  badges, 
  completedJobs 
}: UserLevelProps) => {
  const progressPercentage = (currentXP / nextLevelXP) * 100;
  
  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Master Professional';
    if (level >= 7) return 'Expert Worker';
    if (level >= 5) return 'Skilled Professional';
    if (level >= 3) return 'Rising Star';
    return 'New Worker';
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'from-purple-500 to-pink-500';
    if (level >= 7) return 'from-yellow-400 to-orange-500';
    if (level >= 5) return 'from-green-400 to-blue-500';
    if (level >= 3) return 'from-blue-400 to-purple-500';
    return 'from-gray-400 to-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getLevelColor(currentLevel)} flex items-center justify-center`}>
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Level {currentLevel}</h3>
            <p className="text-sm text-gray-600">{getLevelTitle(currentLevel)}</p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800">
          <Target className="w-4 h-4 mr-1" />
          {completedJobs} Jobs
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress to Level {currentLevel + 1}</span>
          <span>{currentXP}/{nextLevelXP} XP</span>
        </div>
        <Progress value={progressPercentage} className="h-3" />
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 flex items-center">
          <Star className="w-4 h-4 mr-2 text-yellow-500" />
          Recent Achievements
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {badges.slice(0, 6).map((badge, index) => (
            <div key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 p-2 rounded-lg text-center">
              <div className="text-lg mb-1">🏆</div>
              <div className="text-xs font-medium text-gray-700">{badge}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <Gift className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Complete 2 more jobs to unlock Premium features!
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserLevel;
