
import React from 'react';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectionButtonProps {
  label: string;
  description?: string;
  icon?: React.ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  className?: string;
}

const SelectionButton: React.FC<SelectionButtonProps> = ({
  label,
  description,
  icon,
  selected,
  disabled = false,
  onClick,
  className
}) => {
  return (
    <button
      type="button"
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all duration-300",
        selected
          ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
          : disabled
          ? "border-gray-200 text-gray-400 cursor-not-allowed"
          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 hover:shadow-md",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <span className="text-2xl">{icon}</span>}
          <div>
            <div className="font-semibold text-gray-900">{label}</div>
            {description && (
              <div className="text-sm text-gray-600">{description}</div>
            )}
          </div>
        </div>
        {selected && (
          <CheckCircle className="w-6 h-6 text-blue-500" />
        )}
      </div>
    </button>
  );
};

export default SelectionButton;
