/**
 * EMDRise Brand Guidelines - Mobile Implementation
 * 
 * This file contains all brand colors, typography, and styling constants
 * as defined in the EMDRise Brand Guidelines. All components MUST use
 * these constants to ensure brand compliance.
 * 
 * DO NOT use hardcoded colors anywhere else in the application.
 */

// Primary Brand Colors
export const EMDRiseColors = {
  // Primary Colors
  primaryBlue: '#1E90FF',      // hsl(217, 88%, 58%) - Main brand color
  primaryGreen: '#05A660',     // hsl(158, 92%, 40%) - Healing, therapeutic progress
  
  // Secondary Colors
  secondaryBlue: '#3B9DFF',    // hsl(212, 92%, 66%) - Hover states, secondary elements
  secondaryGreen: '#1DD1A1',   // hsl(162, 83%, 58%) - Accent highlights, success indicators
  
  // Accent Colors
  warmAccent: '#F5A623',       // hsl(41, 96%, 48%) - CTAs, notifications, warmth
  
  // Therapeutic Background Colors
  therapeuticBg: '#F8FAFC',    // hsl(210, 40%, 98%) - Main page backgrounds
  safeSpace: '#F0F7F4',        // hsl(158, 30%, 95%) - Therapy session areas
  
  // Neutral Colors
  foreground: '#1A202C',       // hsl(222, 47%, 11%) - Primary text
  muted: '#F1F5F9',           // hsl(210, 30%, 96%) - Subtle backgrounds
  border: '#E2E8F0',          // hsl(214, 32%, 91%) - Borders and dividers
  card: '#F7FAFC',            // hsl(210, 35%, 97%) - Card backgrounds
  
  // Semantic Colors
  text: {
    primary: '#1A202C',
    secondary: '#64748B',
    muted: '#94A3B8',
    white: '#FFFFFF',
  },
  
  // State Colors
  success: '#05A660',          // Primary Green for success states
  error: '#EF4444',           // Red for errors (maintaining accessibility)
  warning: '#F5A623',         // Warm Accent for warnings
  info: '#1E90FF',            // Primary Blue for information
} as const;

// Typography Scale (matching brand guidelines)
export const EMDRiseTypography = {
  fonts: {
    primary: 'Inter', // System font fallback handled by React Native
  },
  
  sizes: {
    // Heading sizes (converted from rem to React Native sp)
    heading: {
      h1: 32,        // 2rem equivalent - Page titles, main headings
      h2: 24,        // 1.5rem equivalent - Section headings, card titles
      h3: 20,        // 1.25rem equivalent - Sub-sections
      h4: 18,        // 1.125rem equivalent - Component headings
    },
    
    // Body text sizes
    body: {
      large: 18,     // 1.125rem equivalent - Large body text
      base: 16,      // 1rem equivalent - Standard body text
      small: 14,     // 0.875rem equivalent - Small text
      tiny: 12,      // 0.75rem equivalent - Captions, footnotes
    },
  },
  
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
} as const;

// Spacing Scale (matching brand guidelines)
export const EMDRiseSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
  '5xl': 64,
} as const;

// Border Radius Scale
export const EMDRiseBorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,          // Therapeutic cards standard
  '2xl': 16,
  '3xl': 24,
  full: 9999,      // Circular elements
} as const;

// Shadow Styles (matching therapeutic card design)
export const EMDRiseShadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;

// Component Style Presets
export const EMDRiseStyles = {
  // Button Styles
  buttons: {
    primary: {
      backgroundColor: EMDRiseColors.primaryBlue,
      borderRadius: EMDRiseBorderRadius.xl,
      paddingVertical: EMDRiseSpacing.lg,
      paddingHorizontal: EMDRiseSpacing.xl,
      ...EMDRiseShadows.medium,
    },
    
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: EMDRiseColors.primaryBlue,
      borderRadius: EMDRiseBorderRadius.xl,
      paddingVertical: EMDRiseSpacing.lg,
      paddingHorizontal: EMDRiseSpacing.xl,
    },
    
    therapeutic: {
      backgroundColor: EMDRiseColors.primaryGreen,
      borderRadius: EMDRiseBorderRadius.xl,
      paddingVertical: EMDRiseSpacing.lg,
      paddingHorizontal: EMDRiseSpacing.xl,
      ...EMDRiseShadows.medium,
    },
  },
  
  // Card Styles
  cards: {
    therapeutic: {
      backgroundColor: EMDRiseColors.card,
      borderRadius: EMDRiseBorderRadius.xl,
      padding: EMDRiseSpacing['2xl'],
      borderWidth: 1,
      borderColor: EMDRiseColors.border,
      ...EMDRiseShadows.medium,
    },
    
    safeSpace: {
      backgroundColor: EMDRiseColors.safeSpace,
      borderRadius: EMDRiseBorderRadius.xl,
      padding: EMDRiseSpacing['2xl'],
      borderWidth: 1,
      borderColor: EMDRiseColors.primaryGreen,
      ...EMDRiseShadows.small,
    },
  },
  
  // Container Styles
  containers: {
    main: {
      backgroundColor: EMDRiseColors.therapeuticBg,
    },
    
    section: {
      paddingVertical: EMDRiseSpacing['3xl'],
      paddingHorizontal: EMDRiseSpacing.xl,
    },
  },
} as const;

// Gradient Definitions (for use with react-native-linear-gradient)
export const EMDRiseGradients = {
  // Primary EMDR gradient (135deg from Primary Blue to Primary Green)
  emdr: {
    colors: [EMDRiseColors.primaryBlue, EMDRiseColors.primaryGreen],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  
  // Courage gradient (multi-stop)
  courage: {
    colors: [
      EMDRiseColors.primaryBlue,      // 0%
      EMDRiseColors.secondaryBlue,    // 25%
      EMDRiseColors.primaryGreen,     // 75%
      EMDRiseColors.secondaryGreen,   // 100%
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} as const;

// Accessibility Settings
export const EMDRiseAccessibility = {
  // Minimum touch target sizes (iOS/Android guidelines)
  minTouchTarget: 44,
  
  // High contrast ratios (WCAG AA compliant)
  contrast: {
    normal: 4.5,
    large: 3.0,
  },
  
  // Focus indicators
  focus: {
    borderWidth: 2,
    borderColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.md,
  },
} as const;

// Brand Compliance Utilities
export const brandCompliance = {
  /**
   * Validates if a color is from the approved EMDRise palette
   */
  isApprovedColor: (color: string): boolean => {
    const approvedColors = Object.values(EMDRiseColors).flat();
    return approvedColors.includes(color.toUpperCase());
  },
  
  /**
   * Gets the appropriate text color for a given background
   */
  getTextColor: (backgroundColor: string): string => {
    // Simplified logic - in production, this would calculate contrast ratios
    const lightBackgrounds = [
      EMDRiseColors.therapeuticBg,
      EMDRiseColors.safeSpace,
      EMDRiseColors.card,
      EMDRiseColors.muted,
    ];
    
    return lightBackgrounds.includes(backgroundColor) 
      ? EMDRiseColors.text.primary 
      : EMDRiseColors.text.white;
  },
} as const;

// Export everything as default for easy importing
export default {
  colors: EMDRiseColors,
  typography: EMDRiseTypography,
  spacing: EMDRiseSpacing,
  borderRadius: EMDRiseBorderRadius,
  shadows: EMDRiseShadows,
  styles: EMDRiseStyles,
  gradients: EMDRiseGradients,
  accessibility: EMDRiseAccessibility,
  compliance: brandCompliance,
} as const;