
import React from 'react';
import { Button } from '@/components/ui/button';

interface FloatingEditButtonProps {
  isEditing: boolean;
  setIsEditing: (b: boolean) => void;
}

const FloatingEditButton: React.FC<FloatingEditButtonProps> = ({ isEditing, setIsEditing }) => (
  <Button
    variant="ghost"
    size="lg"
    onClick={() => setIsEditing(!isEditing)}
    className="fixed top-7 right-6 z-40 bg-white border border-gray-200 shadow rounded-full text-blue-700 hover:bg-blue-50"
  >
    {isEditing ? "Cancel" : "Edit"}
  </Button>
);

export default FloatingEditButton;
