
import { getResponsiveTextSize, TextSizingOptions } from './textSizing';

export interface LocalizedTextSizingOptions extends TextSizingOptions {
  language?: string;
  maxCharsBeforeResize?: number;
}

// Language-specific character multipliers for better text sizing
const LANGUAGE_MULTIPLIERS = {
  'en': 1.0,
  'hi': 1.2,   // Hindi characters tend to be wider
  'ta': 1.3,   // Tamil has complex characters
  'te': 1.3,   // Telugu has complex characters
  'bn': 1.2,   // Bengali has complex characters
  'mr': 1.2,   // Marathi similar to Hindi
  'kn': 1.3,   // Kannada has complex characters
  'ml': 1.4    // Malayalam has the most complex characters
};

export const getLocalizedTextSize = (
  text: string,
  language: string = 'en',
  options: LocalizedTextSizingOptions = {}
): string => {
  const {
    baseSize = 14,
    minSize = 10,
    maxSize = 16,
    maxCharsBeforeResize = 20,
    unit = 'tailwind'
  } = options;

  if (!text) return unit === 'tailwind' ? 'text-sm' : `${baseSize}px`;

  // Calculate effective length based on language
  const multiplier = LANGUAGE_MULTIPLIERS[language as keyof typeof LANGUAGE_MULTIPLIERS] || 1.0;
  const effectiveLength = Math.round(text.length * multiplier);

  // Use responsive sizing with adjusted length
  return getResponsiveTextSize(text, {
    baseSize,
    minSize,
    maxSize,
    unit,
    breakpoints: [
      { chars: Math.round(6 * multiplier), size: maxSize },
      { chars: Math.round(12 * multiplier), size: baseSize },
      { chars: Math.round(maxCharsBeforeResize * multiplier), size: Math.max(baseSize - 1, minSize + 2) },
      { chars: Math.round(30 * multiplier), size: Math.max(baseSize - 2, minSize + 1) }
    ]
  });
};

export const getLocalizedPadding = (text: string, language: string = 'en'): string => {
  const multiplier = LANGUAGE_MULTIPLIERS[language as keyof typeof LANGUAGE_MULTIPLIERS] || 1.0;
  const effectiveLength = Math.round(text.length * multiplier);
  
  if (effectiveLength <= 8) return 'px-3 py-2';
  if (effectiveLength <= 15) return 'px-2.5 py-1.5';
  if (effectiveLength <= 25) return 'px-2 py-1';
  return 'px-1.5 py-0.5';
};

export const getLocalizedContainerClass = (
  text: string, 
  language: string = 'en',
  baseClass: string = ''
): string => {
  const multiplier = LANGUAGE_MULTIPLIERS[language as keyof typeof LANGUAGE_MULTIPLIERS] || 1.0;
  const effectiveLength = Math.round(text.length * multiplier);
  
  let widthClass = 'min-w-0 max-w-full';
  
  if (effectiveLength <= 10) widthClass = 'min-w-[60px] max-w-[120px]';
  else if (effectiveLength <= 20) widthClass = 'min-w-[80px] max-w-[160px]';
  else if (effectiveLength <= 30) widthClass = 'min-w-[100px] max-w-[200px]';
  else widthClass = 'min-w-[120px] max-w-[240px]';
  
  return `${baseClass} ${widthClass} truncate`.trim();
};

// Utility for navigation items with dynamic sizing
export const getNavItemClasses = (text: string, language: string = 'en', isActive: boolean = false) => {
  const textSize = getLocalizedTextSize(text, language, {
    baseSize: 10,
    minSize: 8,
    maxSize: 11,
    maxCharsBeforeResize: 12
  });
  
  const padding = getLocalizedPadding(text, language);
  
  return {
    textSize,
    padding,
    containerClass: getLocalizedContainerClass(text, language, 'truncate text-center')
  };
};
