# EMDRise - EMDR Therapy Application

A comprehensive EMDR (Eye Movement Desensitization and Reprocessing) therapy application providing guided therapeutic sessions with professional therapist videos and advanced bilateral stimulation. Native mobile application built with React Native and Expo for iOS and Android.

## 🚀 **DEVELOPERS START HERE**

**📱 Production Mobile App Location:** `mobile-app/` directory  
**⚠️ Important:** All other directories are deprecated, backups, or documentation. Use ONLY `mobile-app/` for development and testing.

## Key Features

- **Professional Therapist Options**: Choose between Maria and Alistair virtual therapists
- **Complete EMDR Protocol**: 10-phase guided sessions with professional video narration
- **Dual Session Flow Management**:
  - **Normal Flow**: Complete sessions (Scripts 1-10) → home → new journey starts at Script 1
  - **Pause Flow**: Interrupted sessions resume at Script 5a after safe closure sequence
- **Advanced Bilateral Stimulation**: Visual dots, stereo audio, and haptic feedback for mobile devices
- **Intelligent Session Management**: Persistent pause/resume system that survives closure sequences
- **Professional Video Library**: Authentic therapist guidance for all phases including resumption videos
- **Mobile-Optimized**: React Native/Expo app with full offline functionality
- **Apple IAP Integration**: RevenueCat-powered subscription management with 7-day free trial (£9.99/month)

## Architecture

### Mobile Application (React Native + Expo)
- React Native with Expo SDK (~51.0.28)
- TypeScript with ES modules  
- Expo AV for native video playback
- AsyncStorage for session persistence
- React Navigation v6 for native navigation
- Native haptic feedback integration via Expo Haptics
- RevenueCat integration for Apple In-App Purchases
- Comprehensive offline functionality

### Backend Infrastructure
- Node.js with Express.js
- PostgreSQL with Drizzle ORM
- Neon serverless database hosting
- Supabase Authentication with Apple Sign In support
- RevenueCat for Apple IAP subscription management
- Account deletion with complete data cleanup

## Session Management

### Normal Session Flow
1. Scripts 1→2→3→4→5→6→7→8→9→10
2. Complete Session → Return to homepage
3. "Continue Your Journey" → New session starts at Script 1

### Pause/Resume Flow
1. Scripts 1→2→3→4→ **Pause Reprocessing**
2. Safe closure sequence: Scripts 9→10 → Return to homepage  
3. "Continue Your Journey" → Resume at **Script 5a** (resumption video)
4. Continue: Script 5a→5→6→7→8→9→10 → Complete session
5. Next "Continue Your Journey" → New session starts at Script 1

## 🔧 **Quick Setup for Developers**

### 1. Clone Repository
```bash
git clone [your-repo-url]
cd EMDRise
```

### 2. Navigate to Production App
```bash
cd mobile-app
```

### 3. Install & Run
```bash
npm install
npm start
```

### 4. Test on Device
- iOS: `npm run ios`
- Android: `npm run android`

## Getting Started

### Mobile Application
```bash
cd mobile-app
npm install
expo start
```

For iOS development:
```bash
cd mobile-app
npm run ios
```

For Android development:
```bash
cd mobile-app
npm run android
```

### Environment Setup
- Configure Supabase authentication
- Set up RevenueCat for Apple IAP
- Configure Apple Developer account for App Store
- Ensure video assets are hosted on Supabase storage

## EMDR Protocol Implementation

### Complete Video Library
- **Script 1**: Welcome & Introduction to EMDR
- **Script 2**: Calm Place Setup (guided visualization)
- **Script 3**: Target Memory Setup (trauma identification)
- **Script 4**: Desensitization Setup (initial processing preparation)
- **Script 5**: Reprocessing (bilateral stimulation + processing loops)
- **Script 5a**: Resumption Video (for interrupted sessions)
- **Scripts 6-7**: Installation (positive belief integration)
- **Script 8**: Body Scan (somatic awareness check)
- **Script 9**: Calm Place Return (session stabilization)
- **Script 10**: Aftercare (integration and self-care guidance)

### Bilateral Stimulation Modes
- **Visual**: Animated dot tracking across screen
- **Auditory**: Stereo audio tones alternating left/right
- **Tactile**: Haptic feedback patterns (mobile devices)

## Technical Highlights

- **Persistent Session Management**: AsyncStorage-based system with reliable pause/resume
- **Video Integration**: Seamless therapist guidance with BLS synchronization  
- **Native Mobile Experience**: Optimized specifically for iOS and Android devices with platform-specific features
- **Professional UI/UX**: Ambient therapeutic design with accessibility considerations
- **Scalable Architecture**: Microservices-ready backend with serverless database

## License

Private therapy application - All rights reserved.