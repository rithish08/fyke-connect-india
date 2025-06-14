
import React, { useState } from 'react';
import { ModernCard } from '@/components/ui/modern-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit3, Check, X } from 'lucide-react';

interface EditableProfileCardProps {
  title: string;
  children: React.ReactNode;
  editContent: React.ReactNode;
  onSave: () => void;
  canEdit?: boolean;
  className?: string;
}

const EditableProfileCard: React.FC<EditableProfileCardProps> = ({
  title,
  children,
  editContent,
  onSave,
  canEdit = true,
  className = ""
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <ModernCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {canEdit && !isEditing && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
          >
            <Edit3 className="w-4 h-4" />
          </Button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 p-2"
            >
              <Check className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
      {isEditing ? editContent : children}
    </ModernCard>
  );
};

export default EditableProfileCard;
