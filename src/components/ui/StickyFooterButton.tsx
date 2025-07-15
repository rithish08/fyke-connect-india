
import React from "react";
import { Button } from "@/components/ui/button";

interface StickyFooterButtonProps {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

const StickyFooterButton: React.FC<StickyFooterButtonProps> = ({
  disabled,
  onClick,
  children,
  className = "",
  isLoading = false
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/70 backdrop-blur-lg shadow-2xl border-t border-gray-200/50 p-4 rounded-b-2xl flex items-center justify-center">
      <Button
        className={`w-full h-14 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 text-lg ${className}`}
        disabled={disabled || isLoading}
        onClick={onClick}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Processing...</span>
          </div>
        ) : (
          children
        )}
      </Button>
    </div>
  );
};

export default StickyFooterButton;
