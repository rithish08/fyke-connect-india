
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
    }, 1500); // Reduced from 2000ms to 1500ms for faster loading

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center px-4">
          <span 
            className="mx-auto font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            style={{ letterSpacing: ".03em", fontFamily: "Inter, sans-serif" }}
          >
            fyke
          </span>
          <div className="text-base font-semibold tracking-wide text-gray-700 mt-1">gig economy platform</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-purple-50 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center animate-pulse px-4">
        <span 
          className="mx-auto font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          style={{ letterSpacing: ".03em", fontFamily: "Inter, sans-serif" }}
        >
          fyke
        </span>
        <div className="text-lg font-bold tracking-wide text-gray-800 mt-2">gig economy platform</div>
      </div>
    </div>
  );
};

export default SplashScreen;
