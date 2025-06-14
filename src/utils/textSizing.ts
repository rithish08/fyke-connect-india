
export interface TextSizingOptions {
  baseSize?: number;
  minSize?: number;
  maxSize?: number;
  breakpoints?: { chars: number; size: number }[];
  unit?: 'px' | 'rem' | 'tailwind';
}

export const getResponsiveTextSize = (
  text: string, 
  options: TextSizingOptions = {}
): string => {
  const {
    baseSize = 14,
    minSize = 10,
    maxSize = 16,
    breakpoints,
    unit = 'tailwind'
  } = options;

  if (!text) return unit === 'tailwind' ? 'text-sm' : `${baseSize}px`;

  const length = text.length;
  
  // Custom breakpoints if provided
  if (breakpoints) {
    for (const bp of breakpoints.sort((a, b) => a.chars - b.chars)) {
      if (length <= bp.chars) {
        return unit === 'tailwind' ? getTailwindClass(bp.size) : `${bp.size}px`;
      }
    }
    return unit === 'tailwind' ? getTailwindClass(minSize) : `${minSize}px`;
  }

  // Default scaling logic for different text lengths
  let size = baseSize;
  if (length <= 6) size = maxSize;
  else if (length <= 12) size = baseSize;
  else if (length <= 20) size = Math.max(baseSize - 1, minSize + 2);
  else if (length <= 30) size = Math.max(baseSize - 2, minSize + 1);
  else size = minSize;

  return unit === 'tailwind' ? getTailwindClass(size) : `${size}px`;
};

const getTailwindClass = (size: number): string => {
  if (size >= 18) return 'text-lg';
  if (size >= 16) return 'text-base';
  if (size >= 14) return 'text-sm';
  if (size >= 12) return 'text-xs';
  return 'text-xs';
};

export const getResponsiveContainerWidth = (text: string, minWidth = 60, maxWidth = 120): number => {
  const baseWidth = Math.max(minWidth, Math.min(text.length * 8, maxWidth));
  return baseWidth;
};

// New utility for dynamic padding based on text length
export const getResponsivePadding = (text: string): string => {
  const length = text.length;
  if (length <= 8) return 'px-3 py-1.5';
  if (length <= 15) return 'px-2.5 py-1';
  if (length <= 25) return 'px-2 py-1';
  return 'px-1.5 py-0.5';
};

// New utility for flexible container classes
export const getFlexibleContainerClass = (text: string, baseClass = ''): string => {
  const length = text.length;
  let widthClass = 'min-w-0 max-w-full';
  
  if (length <= 10) widthClass = 'min-w-[60px] max-w-[100px]';
  else if (length <= 20) widthClass = 'min-w-[80px] max-w-[140px]';
  else if (length <= 30) widthClass = 'min-w-[100px] max-w-[180px]';
  else widthClass = 'min-w-[120px] max-w-[200px]';
  
  return `${baseClass} ${widthClass} truncate`.trim();
};
