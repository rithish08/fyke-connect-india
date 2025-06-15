
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow fade out animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center">
          <h1 className="text-6xl font-black tracking-tight text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
            fyke
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center animate-pulse">
        <h1 className="text-6xl font-black tracking-tight text-gray-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
          fyke
        </h1>
      </div>
    </div>
  );
};

export default SplashScreen;
