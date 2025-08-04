
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface LogoProps {
  variant?: 'header' | 'hero' | 'footer' | 'mobile';
  showText?: boolean;
  style?: any;
}

export function Logo({ variant = 'header', showText = true, style }: LogoProps) {
  const logoSrc = require('../assets/emdrise-logo.png'); // We'll need to add this asset

  const getLogoStyles = () => {
    switch (variant) {
      case 'hero':
        return { height: 128, width: 128 };
      case 'header':
        return { height: 80, width: 80 };
      case 'mobile':
        return { height: 48, width: 48 };
      case 'footer':
        return { height: 40, width: 40 };
      default:
        return { height: 60, width: 60 };
    }
  };

  const getContainerStyles = () => {
    switch (variant) {
      case 'hero':
        return { ...styles.container, padding: 16 };
      case 'header':
        return { ...styles.container, paddingLeft: 16, height: 60 };
      case 'mobile':
        return { ...styles.container, paddingLeft: 12, height: 50 };
      case 'footer':
        return { ...styles.container, paddingLeft: 8, height: 40 };
      default:
        return { ...styles.container, paddingLeft: 16, height: 60 };
    }
  };

  if (!showText) {
    return (
      <Image 
        source={logoSrc}
        style={[getLogoStyles(), { resizeMode: 'contain' }, style]}
      />
    );
  }

  return (
    <View style={[getContainerStyles(), style]}>
      <Image 
        source={logoSrc}
        style={[getLogoStyles(), { resizeMode: 'contain' }]}
      />
      <View style={styles.textGroup}>
        <Text style={styles.logoText}>EMDRise</Text>
        <Text style={styles.logoTagline}>Healing Together</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGroup: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0077D9',
  },
  logoTagline: {
    fontSize: 12,
    color: '#0077D9',
    fontWeight: '400',
  },
});
