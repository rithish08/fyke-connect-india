
import React from "react";
import { Button } from "@/components/ui/button";

interface StickyActionButtonProps {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const StickyActionButton: React.FC<StickyActionButtonProps> = ({
  disabled,
  onClick,
  children,
  className,
  style
}) => {
  return (
    <div
      className={`
        fixed left-0 right-0 bottom-0 z-40
        w-full max-w-2xl mx-auto
        px-4 py-4 pb-[env(safe-area-inset-bottom,20px)]
        pointer-events-none
        transition-all
        bg-gradient-to-t from-white via-white/95 to-transparent
      `}
      style={{
        ...style,
      }}
    >
      <div
        className={`
          pointer-events-auto bg-white/95 backdrop-blur-md
          rounded-2xl shadow-lg
          border border-gray-100
          p-1
        `}
        style={{
          boxShadow: "0 8px 30px 0 rgba(0,0,0,.12)",
        }}
      >
        <Button
          className={`w-full h-12 rounded-xl font-semibold text-base transition-colors 
            bg-blue-600 hover:bg-blue-700 text-white
            disabled:bg-gray-300 disabled:text-gray-500
            ${className || ""}
          `}
          disabled={disabled}
          onClick={onClick}
          tabIndex={0}
        >
          {children}
        </Button>
      </div>
    </div>
  );
};

export default StickyActionButton;
