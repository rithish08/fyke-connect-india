
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
        <div className="text-center px-4">
          <img 
            src="/lovable-uploads/95579b46-46db-46cc-a5d9-82155bddfc21.png" 
            alt="fyke logo"
            className="w-48 sm:w-56 md:w-64 h-auto mx-auto mb-2"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center animate-pulse px-4">
        <img 
          src="/lovable-uploads/95579b46-46db-46cc-a5d9-82155bddfc21.png" 
          alt="fyke logo"
          className="w-48 sm:w-56 md:w-64 h-auto mx-auto mb-2"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
