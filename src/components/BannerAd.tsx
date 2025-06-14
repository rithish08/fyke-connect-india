
import React from "react";

const BannerAd = ({
  text = "Ad: Unlock Fyke Pro to secure more jobs and premium support!",
  onClose,
}: {
  text?: string;
  onClose?: () => void;
}) => (
  <div className="relative flex items-center justify-between bg-yellow-100 rounded-xl px-4 py-2 text-xs font-semibold text-yellow-700 my-2 max-w-2xl mx-auto shadow-md">
    <span>{text}</span>
    {onClose && (
      <button
        className="ml-3 px-1 rounded-full hover:bg-yellow-200 text-yellow-600"
        aria-label="Close Ad"
        onClick={onClose}
      >
        ✕
      </button>
    )}
  </div>
);

export default BannerAd;
