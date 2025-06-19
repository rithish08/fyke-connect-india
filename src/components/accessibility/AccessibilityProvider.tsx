
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityContextType {
  announceMessage: (message: string) => void;
  focusElement: (elementId: string) => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const announceMessage = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const focusElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
    }
  };

  useEffect(() => {
    // Apply accessibility settings to document
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [highContrast, fontSize]);

  return (
    <AccessibilityContext.Provider value={{
      announceMessage,
      focusElement,
      highContrast,
      setHighContrast,
      fontSize,
      setFontSize
    }}>
      {children}
    </AccessibilityContext.Provider>
  );
};
