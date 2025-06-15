
import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  icon: string;
  color: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CategoryIcon: React.FC<CategoryIconProps> = ({ 
  icon, 
  color, 
  size = 'md',
  className 
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-3xl'
  };

  return (
    <div className={cn(
      "rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg",
      color,
      sizes[size],
      className
    )}>
      <span className="text-white">{icon}</span>
    </div>
  );
};

export default CategoryIcon;
