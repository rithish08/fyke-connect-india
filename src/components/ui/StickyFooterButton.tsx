
import React from "react";
import { Button } from "@/components/ui/button";

// Simple sticky bottom action button, always visible.
interface StickyFooterButtonProps {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}
const StickyFooterButton: React.FC<StickyFooterButtonProps> = ({
  disabled, onClick, children, className = ""
}) => (
  <div
    className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center
    pb-[env(safe-area-inset-bottom,16px)] bg-gradient-to-t from-white/95 to-transparent pointer-events-none"
    style={{ minHeight: 74 }}
  >
    <div className="w-full max-w-lg px-4 pt-2 pb-4 pointer-events-auto">
      <Button
        disabled={disabled}
        onClick={onClick}
        className={`w-full h-14 rounded-2xl font-semibold text-lg shadow-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-700 hover:to-blue-700
          disabled:from-gray-300 disabled:to-gray-300 ${className}`}
      >
        {children}
      </Button>
    </div>
  </div>
);
export default StickyFooterButton;
