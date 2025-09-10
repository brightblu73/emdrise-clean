// EMDRise Brand Colors & Design System
export const EMDRiseColors = {
  // Primary Colors
  primaryBlue: '#2563EB',      // hsl(217, 88%, 58%)
  primaryGreen: '#05A660',     // hsl(158, 92%, 40%)
  
  // Secondary Colors
  secondaryBlue: '#3B82F6',    // hsl(212, 92%, 66%)
  secondaryGreen: '#22C55E',   // hsl(162, 83%, 58%)
  
  // Accent Color
  warmAccent: '#F59E0B',       // hsl(41, 96%, 48%)
  
  // Therapeutic Backgrounds
  therapeuticBg: '#F8FAFC',    // Light therapeutic background
  safeSpace: '#F1F5F9',       // Safe space background
  
  // Additional colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

export const EMDRiseGradients = {
  primary: ['#2563EB', '#05A660'], // Primary blue to green
  secondary: ['#3B82F6', '#22C55E'], // Secondary blue to green
};

export const EMDRiseSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const EMDRiseBorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const EMDRiseShadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const EMDRiseTypography = {
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const EMDRiseStyles = {
  therapeuticCard: {
    backgroundColor: EMDRiseColors.therapeuticBg,
    borderRadius: EMDRiseBorderRadius.lg,
    ...EMDRiseShadows.md,
  },
  primaryButton: {
    backgroundColor: EMDRiseColors.primaryBlue,
    borderRadius: EMDRiseBorderRadius.md,
    paddingVertical: EMDRiseSpacing.md,
    paddingHorizontal: EMDRiseSpacing.lg,
  },
  primaryButtonText: {
    color: EMDRiseColors.white,
    fontSize: EMDRiseTypography.fontSize.base,
    fontWeight: EMDRiseTypography.fontWeight.semibold,
    textAlign: 'center' as const,
  },
};