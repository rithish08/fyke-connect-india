
import React from 'react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';

interface ProfileSkillsProps {
  userRole: string;
  skills: string[];
  isEditing: boolean;
}

const ProfileSkills: React.FC<ProfileSkillsProps> = ({ userRole, skills, isEditing }) => {
  if (userRole !== 'jobseeker') return null;

  return (
    <ModernCard className="p-6 rounded-2xl shadow border border-gray-100 bg-white">
      <span className="text-base font-semibold text-gray-900 mb-2 block">Skills</span>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-gray-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full shadow-none border border-gray-200"
          >
            {skill}
          </span>
        ))}
        <Button variant="outline" size="sm" disabled={!isEditing} className="rounded-full border-blue-100 bg-white hover:bg-blue-50 text-blue-700 font-semibold text-xs shadow-none">
          + Add Skill
        </Button>
      </div>
    </ModernCard>
  );
};

export default ProfileSkills;
