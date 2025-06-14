
import React from 'react';
import { Button } from '@/components/ui/button';
import { ModernCard } from '@/components/ui/modern-card';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "📭",
  title,
  description,
  actionText,
  onAction,
  className = ""
}) => {
  return (
    <ModernCard className={`p-8 text-center ${className}`}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mx-auto">
          {actionText}
        </Button>
      )}
    </ModernCard>
  );
};

export default EmptyState;
