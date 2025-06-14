
import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedWrapperProps {
  children: React.ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'bounce';
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  className?: string;
}

const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({
  children,
  variant = 'fade',
  direction = 'up',
  delay = 0,
  duration = 300,
  className
}) => {
  const getAnimationClass = () => {
    const baseClasses = 'transition-all ease-out transform';
    
    switch (variant) {
      case 'fade':
        return `${baseClasses} animate-in fade-in`;
      case 'slide':
        switch (direction) {
          case 'up':
            return `${baseClasses} animate-in slide-in-from-bottom-4`;
          case 'down':
            return `${baseClasses} animate-in slide-in-from-top-4`;
          case 'left':
            return `${baseClasses} animate-in slide-in-from-right-4`;
          case 'right':
            return `${baseClasses} animate-in slide-in-from-left-4`;
          default:
            return `${baseClasses} animate-in slide-in-from-bottom-4`;
        }
      case 'scale':
        return `${baseClasses} animate-in zoom-in-95`;
      case 'bounce':
        return `${baseClasses} animate-bounce`;
      default:
        return `${baseClasses} animate-in fade-in`;
    }
  };

  return (
    <div
      className={cn(getAnimationClass(), className)}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedWrapper;
