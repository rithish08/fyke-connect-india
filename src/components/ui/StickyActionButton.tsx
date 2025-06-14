
import React from "react";
import { cn } from "@/lib/utils";

interface StickyActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  show?: boolean;
  children: React.ReactNode;
}

const StickyActionButton: React.FC<StickyActionButtonProps> = ({
  show = true,
  className,
  children,
  ...props
}) => {
  if (!show) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 w-full z-40 flex justify-center pointer-events-none
        px-2 pb-4
        transition-all
        "
      style={{
        // Safe area compatibility for iOS notch
        paddingBottom: "max(env(safe-area-inset-bottom), 1rem)"
      }}
    >
      <div
        className="
          w-full max-w-2xl pointer-events-auto
          shadow-xl rounded-2xl
          bg-white/70 dark:bg-gray-900/70
          backdrop-blur-[18px]
          border border-gray-200 dark:border-gray-800
          flex items-center justify-center
          animate-fade-in
        "
        style={{
          minHeight: 56,
          boxShadow: `0 6px 32px 0 rgba(23,36,61,0.10)`
        }}
      >
        <button
          className={cn(
            "w-full h-14 rounded-2xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500",
            "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg active:scale-98",
            props.disabled
              ? "opacity-60 cursor-not-allowed"
              : "hover:shadow-xl hover:scale-[1.01]",
            className
          )}
          {...props}
        >
          {children}
        </button>
      </div>
    </div>
  );
};

export default StickyActionButton;
