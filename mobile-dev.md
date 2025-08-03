# EMDRise Mobile Development Guide

## 🚀 Primary Platform: React Native Mobile App

This project is **mobile-first**. The React Native app in the `mobile-app/` folder is the primary platform.

### Quick Start for Mobile Development

1. **Navigate to mobile app:**
   ```bash
   cd mobile-app
   ```

2. **Start the Expo development server:**
   ```bash
   npx expo start
   ```

3. **Run on device/simulator:**
   - **Physical Device (Recommended):** Scan QR code with Expo Go app
   - **iOS Simulator:** Press `i` in terminal or run `npx expo start --ios`
   - **Android Emulator:** Press `a` in terminal or run `npx expo start --android`

### Mobile App Features

#### ✅ Complete EMDR Therapy System
- **Therapist Selection**: Choose between Maria and Alistair
- **10-Script Video Protocol**: Complete therapeutic progression
- **Native Video Playback**: Optimized for mobile with Expo AV
- **BLS Integration**: Visual, auditory, and tapping bilateral stimulation

#### ✅ Mobile-Specific Enhancements
- **Haptic Feedback**: Different vibration patterns for left/right BLS
- **AsyncStorage**: Local session persistence
- **Portrait Video**: Optimized 9:16 aspect ratio
- **Native Navigation**: React Navigation stack
- **Touch Interactions**: Smooth mobile gestures

#### ✅ Bilateral Stimulation (BLS)
- **Visual BLS**: Animated ball with haptic feedback
- **Auditory BLS**: Stereo audio with Web Audio API + vibration
- **Tapping BLS**: Hand icons with double-tap haptic patterns
- **Haptic Toggle**: Enable/disable vibration feedback

### Project Structure

```
mobile-app/
├── App.tsx                     # Main app entry point
├── src/
│   ├── components/
│   │   ├── BLSComponent.tsx    # Bilateral stimulation system
│   │   └── VideoPlayer.tsx     # Native video player
│   ├── screens/
│   │   ├── EMDRSessionScreen.tsx # Main therapy session
│   │   ├── HomeScreen.tsx      # Landing/therapist selection
│   │   └── LoginScreen.tsx     # Authentication
│   └── providers/
│       └── AuthProvider.tsx    # Context-based auth
└── assets/
    └── videos/                 # Therapist video library
```

### Development Status

- ✅ **Architecture**: Complete React Native/Expo setup
- ✅ **Authentication**: Working login system
- ✅ **Video System**: All 10 scripts for both therapists
- ✅ **BLS System**: Enhanced with haptic feedback
- ✅ **Navigation**: Full script progression
- ✅ **Storage**: AsyncStorage integration

### Web App Status

The web version (`client/` folder) is currently **paused** and serves as:
- Development reference
- Future consideration for web platform
- Testing ground for features before mobile implementation

### Next Steps for Mobile

1. **App Store Preparation**: Build production versions
2. **Testing**: Comprehensive device testing
3. **Deployment**: Submit to iOS App Store and Google Play Store

The mobile app provides the complete EMDRise experience with native performance and enhanced therapeutic features.