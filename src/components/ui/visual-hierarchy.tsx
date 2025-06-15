
import React from 'react';
import { cn } from '@/lib/utils';
import { visualHierarchy } from '@/utils/visualHierarchy';

// Typography Components with Proper Hierarchy
interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export const Hero: React.FC<TypographyProps> = ({ children, className }) => (
  <h1 className={cn(visualHierarchy.typography.hero, 'text-gray-900', className)}>
    {children}
  </h1>
);

export const Heading1: React.FC<TypographyProps> = ({ children, className }) => (
  <h1 className={cn(visualHierarchy.typography.h1, 'text-gray-900', className)}>
    {children}
  </h1>
);

export const Heading2: React.FC<TypographyProps> = ({ children, className }) => (
  <h2 className={cn(visualHierarchy.typography.h2, 'text-gray-800', className)}>
    {children}
  </h2>
);

export const Heading3: React.FC<TypographyProps> = ({ children, className }) => (
  <h3 className={cn(visualHierarchy.typography.h3, 'text-gray-800', className)}>
    {children}
  </h3>
);

export const Body: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(visualHierarchy.typography.body, 'text-gray-600', className)}>
    {children}
  </p>
);

export const Caption: React.FC<TypographyProps> = ({ children, className }) => (
  <span className={cn(visualHierarchy.typography.caption, 'text-gray-500', className)}>
    {children}
  </span>
);

// Container Components with Proper Alignment
interface ContainerProps {
  children: React.ReactNode;
  size?: 'narrow' | 'content' | 'wide' | 'full';
  spacing?: 'micro' | 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({ 
  children, 
  size = 'content', 
  spacing = 'medium',
  className 
}) => (
  <div className={cn(
    visualHierarchy.containers[size],
    visualHierarchy.spacing[spacing],
    'px-4',
    className
  )}>
    {children}
  </div>
);

// Card Component with Proper Elevation and Focus
interface CardProps {
  children: React.ReactNode;
  elevation?: 'flat' | 'low' | 'medium' | 'high' | 'highest';
  interactive?: boolean;
  className?: string;
}

export const HierarchyCard: React.FC<CardProps> = ({ 
  children, 
  elevation = 'medium',
  interactive = false,
  className 
}) => (
  <div className={cn(
    'rounded-xl bg-white border border-gray-100 p-6',
    visualHierarchy.elevation[elevation],
    interactive && visualHierarchy.interactive.card,
    className
  )}>
    {children}
  </div>
);

// Button with Proper Focus States
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
}

export const HierarchyButton: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  className,
  onClick 
}) => {
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    accent: 'bg-blue-600 text-white hover:bg-blue-700',
  };

  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-xl font-medium',
        variants[variant],
        sizes[size],
        visualHierarchy.interactive.button,
        className
      )}
    >
      {children}
    </button>
  );
};
