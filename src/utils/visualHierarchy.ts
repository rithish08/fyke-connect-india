
// Visual Hierarchy Utility System
export const visualHierarchy = {
  // Typography Scale with Visual Weight
  typography: {
    hero: 'text-4xl md:text-6xl font-bold leading-tight tracking-tight',
    h1: 'text-3xl md:text-4xl font-bold leading-tight',
    h2: 'text-2xl md:text-3xl font-semibold leading-snug',
    h3: 'text-xl md:text-2xl font-semibold leading-snug',
    h4: 'text-lg md:text-xl font-medium leading-normal',
    body: 'text-base leading-relaxed',
    small: 'text-sm leading-normal',
    caption: 'text-xs leading-tight',
  },

  // Spacing Scale for Consistent Rhythm
  spacing: {
    micro: 'space-y-1',
    tiny: 'space-y-2',
    small: 'space-y-4',
    medium: 'space-y-6',
    large: 'space-y-8',
    xlarge: 'space-y-12',
    xxlarge: 'space-y-16',
  },

  // Container Widths for Content Hierarchy
  containers: {
    narrow: 'max-w-md mx-auto',
    content: 'max-w-2xl mx-auto',
    wide: 'max-w-4xl mx-auto',
    full: 'max-w-6xl mx-auto',
  },

  // Contrast and Focus States
  contrast: {
    primary: 'bg-gray-900 text-white',
    secondary: 'bg-gray-100 text-gray-900',
    accent: 'bg-blue-600 text-white',
    muted: 'bg-gray-50 text-gray-600',
    inverse: 'bg-white text-gray-900',
  },

  // Focus and Interactive States
  interactive: {
    button: 'transition-all duration-200 hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200',
    card: 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
    link: 'transition-colors duration-200 hover:text-blue-600 focus:text-blue-600',
  },

  // Elevation System for Depth
  elevation: {
    flat: 'shadow-none',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg',
    highest: 'shadow-xl',
  },
};

// Common Mistakes to Avoid Utility
export const designMistakes = {
  // Avoid these patterns
  avoid: {
    poorContrast: 'text-gray-400 on bg-gray-300', // Too low contrast
    tooManyFonts: 'mixing multiple font families',
    inconsistentSpacing: 'random margins and padding',
    weakHierarchy: 'similar font sizes for different importance levels',
    poorAlignment: 'centered text with left-aligned elements',
  },

  // Use these instead
  correct: {
    goodContrast: 'text-gray-900 on bg-white or text-white on bg-gray-900',
    consistentTypography: 'single font family with proper scale',
    systematicSpacing: 'using design tokens for consistent rhythm',
    clearHierarchy: 'distinct sizes and weights for content levels',
    purposefulAlignment: 'consistent alignment throughout the design',
  },
};
