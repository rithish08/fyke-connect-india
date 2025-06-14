
export interface TextSizingOptions {
  baseSize?: number;
  minSize?: number;
  maxSize?: number;
  breakpoints?: { chars: number; size: number }[];
  unit?: 'px' | 'rem' | 'text-xs' | 'text-sm' | 'text-base';
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
    unit = 'px'
  } = options;

  if (!text) return `${baseSize}${unit}`;

  const length = text.length;
  
  // Custom breakpoints if provided
  if (breakpoints) {
    for (const bp of breakpoints.sort((a, b) => a.chars - b.chars)) {
      if (length <= bp.chars) {
        return unit === 'px' ? `${bp.size}px` : getTailwindClass(bp.size);
      }
    }
    return unit === 'px' ? `${minSize}px` : getTailwindClass(minSize);
  }

  // Default scaling logic
  let size = baseSize;
  if (length <= 8) size = maxSize;
  else if (length <= 15) size = baseSize;
  else if (length <= 25) size = baseSize - 2;
  else if (length <= 35) size = baseSize - 3;
  else size = minSize;

  return unit === 'px' ? `${size}px` : getTailwindClass(size);
};

const getTailwindClass = (size: number): string => {
  if (size >= 16) return 'text-base';
  if (size >= 14) return 'text-sm';
  if (size >= 12) return 'text-xs';
  return 'text-xs';
};

export const getResponsiveContainerWidth = (text: string, minWidth = 60, maxWidth = 120): number => {
  const baseWidth = Math.max(minWidth, Math.min(text.length * 8, maxWidth));
  return baseWidth;
};
