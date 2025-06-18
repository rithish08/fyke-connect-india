
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // Use "fyke" text logo styled
  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center px-4">
          <span 
            className="mx-auto font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-black"
            style={{ letterSpacing: ".03em", fontFamily: "Inter, sans-serif" }}
          >fyke</span>
          <div className="text-base font-semibold tracking-wide text-gray-700 mt-1">gig economy platform</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center animate-pulse px-4">
        <span 
          className="mx-auto font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight text-black"
          style={{ letterSpacing: ".03em", fontFamily: "Inter, sans-serif" }}
        >fyke</span>
        <div className="text-lg font-bold tracking-wide text-gray-800 mt-2">gig economy platform</div>
      </div>
    </div>
  );
};

export default SplashScreen;
