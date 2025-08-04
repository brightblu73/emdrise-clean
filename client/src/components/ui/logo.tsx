
import React from 'react';

interface LogoProps {
  variant?: 'header' | 'hero' | 'footer' | 'mobile';
  className?: string;
  showText?: boolean;
}

export function Logo({ variant = 'header', className = '', showText = true }: LogoProps) {
  // Use the streamlined EMDRise logo from public folder
  const logoSrc = "/emdrise-logo.svg"; 

  // Simplified approach - use inline styles to ensure sizing works
  const getLogoStyles = () => {
    switch (variant) {
      case 'hero':
        return { height: '128px', width: 'auto' };
      case 'header':
        return { height: '80px', width: 'auto' };
      case 'mobile':
        return { height: '48px', width: 'auto' };
      case 'footer':
        return { height: '40px', width: 'auto' };
      default:
        return { height: '60px', width: 'auto' };
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'hero':
        return { display: 'flex', alignItems: 'center', padding: '16px' };
      case 'header':
        return { display: 'flex', alignItems: 'center', paddingLeft: '16px', height: '60px' };
      case 'mobile':
        return { display: 'flex', alignItems: 'center', paddingLeft: '12px', height: '50px' };
      case 'footer':
        return { display: 'flex', alignItems: 'center', paddingLeft: '8px', height: '40px' };
      default:
        return { display: 'flex', alignItems: 'center', paddingLeft: '16px', height: '60px' };
    }
  };

  if (!showText) {
    // Return just the image for backwards compatibility
    return (
      <img 
        src={logoSrc}
        alt="EMDRise logo" 
        style={{...getLogoStyles(), objectFit: 'contain', maxWidth: 'none'}}
        className={className}
      />
    );
  }

  return (
    <div style={getContainerStyles()} className={className}>
      <img 
        src={logoSrc}
        alt="EMDRise logo" 
        style={{...getLogoStyles(), objectFit: 'contain', maxWidth: 'none'}}
        className=""
      />
    </div>
  );
}
