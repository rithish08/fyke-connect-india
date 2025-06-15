
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AestheticCard } from './aesthetic-card';

interface ElegantModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const ElegantModal: React.FC<ElegantModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  className
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <AestheticCard 
        variant="elevated" 
        className={cn(
          "w-full max-w-md max-h-[85vh] overflow-y-auto animate-scale-in",
          className
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        {children}
      </AestheticCard>
    </div>
  );
};

export default ElegantModal;
