
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
          <img 
            src="/lovable-uploads/40cea67e-eb44-489e-8b99-b85acc26c4e4.png" 
            alt="fyke logo"
            className="w-32 h-auto mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center animate-pulse">
        <img 
          src="/lovable-uploads/40cea67e-eb44-489e-8b99-b85acc26c4e4.png" 
          alt="fyke logo"
          className="w-32 h-auto mx-auto"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
