
import React from "react";
import { Button } from "@/components/ui/button";

// Pass children for label/icon, className to adjust width/spacing.
// Sticky above bottom nav and always at the bottom with safe padding.
// Props: disabled, onClick, className, children (button text)
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
  // Safe area padding for iOS/Android notch/home indicator
  return (
    <div
      className={`
        fixed left-0 right-0 bottom-[56px] z-40
        w-full max-w-2xl mx-auto
        px-4 pb-[env(safe-area-inset-bottom,20px)] pt-1
        pointer-events-none
        transition-all
      `}
    >
      <div
        className={`
          pointer-events-auto bg-white/85 backdrop-blur-md
          rounded-2xl shadow-lg mb-3
          border border-gray-100
          p-0
        `}
      >
        <Button
          className={`w-full h-12 rounded-2xl font-semibold text-base transition-colors 
            bg-blue-600 hover:bg-blue-700 text-white
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
