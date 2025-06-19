
import React, { useEffect, useState } from 'react';
import { useLocalization } from '@/contexts/LocalizationContext';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const { t } = useLocalization();

  useEffect(() => {
    // Animate progress bar
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 10;
      });
    }, 150);

    // Hide splash screen after animation
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-50 flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
        <div className="text-center px-4">
          <div className="mb-6">
            <span 
              className="mx-auto font-extrabold text-5xl md:text-6xl tracking-tight text-white"
              style={{ letterSpacing: ".03em", fontFamily: "Inter, sans-serif" }}
            >
              fyke
            </span>
            <div className="text-lg font-semibold tracking-wide text-blue-100 mt-2">
              {t('app.tagline', 'Connect. Work. Succeed.')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="text-center px-4">
        <div className="mb-8">
          <div className="mb-4">
            <span 
              className="mx-auto font-extrabold text-5xl md:text-6xl tracking-tight text-white animate-pulse"
              style={{ letterSpacing: ".03em", fontFamily: "Inter, sans-serif" }}
            >
              fyke
            </span>
          </div>
          <div className="text-lg font-semibold tracking-wide text-blue-100 mb-6">
            {t('app.tagline', 'Connect. Work. Succeed.')}
          </div>
          
          {/* Progress Bar */}
          <div className="w-48 mx-auto">
            <div className="bg-blue-500/30 rounded-full h-1">
              <div 
                className="bg-white rounded-full h-1 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-blue-100 text-sm mt-3">
              {t('common.loading', 'Loading')}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
