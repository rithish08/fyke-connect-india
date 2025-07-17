
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
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-transparent pointer-events-none flex items-center justify-center">
      <div className="w-full max-w-lg mx-auto px-4 pb-4 pointer-events-auto">
        <Button
          className={`w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500/80 to-blue-700/80 backdrop-blur-md shadow-2xl hover:from-blue-600/90 hover:to-blue-800/90 disabled:bg-gray-200 text-white font-semibold transition-all duration-300 text-lg ${className}`}
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
    </div>
  );
};

export default StickyFooterButton;
