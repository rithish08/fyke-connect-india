
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

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center">
          <span 
            className="font-bold text-6xl text-black tracking-tight"
            style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
          >
            fyke
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <span 
          className="font-bold text-6xl text-black tracking-tight"
          style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
        >
          fyke
        </span>
      </div>
    </div>
  );
};

export default SplashScreen;
