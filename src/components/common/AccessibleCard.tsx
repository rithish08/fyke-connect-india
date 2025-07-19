import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface AccessibleCardProps {
  children: React.ReactNode;
  className?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  tabIndex?: number;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const AccessibleCard: React.FC<AccessibleCardProps> = ({
  children,
  className = '',
  role = 'article',
  ariaLabel,
  ariaDescribedBy,
  tabIndex = 0,
  onClick,
  onKeyDown,
  ...props
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
    onKeyDown?.(e);
  };

  return (
    <Card
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      tabIndex={onClick ? tabIndex : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`${className} ${onClick ? 'cursor-pointer hover:shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all' : ''}`}
      {...props}
    >
      {children}
    </Card>
  );
};

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };