# EMDRise Mobile App

A professional EMDR (Eye Movement Desensitization and Reprocessing) therapy application built with React Native and Expo SDK 53. This mobile app provides guided EMDR sessions with professional therapist videos, bilateral stimulation, and comprehensive session management.

## Features

### 🧠 Complete EMDR Protocol
- **10 EMDR Scripts**: Full therapeutic protocol from introduction to aftercare
- **Script 5a**: Special resumption video for paused sessions
- **Professional Therapist Videos**: Choice between Maria and Alistair therapists
- **Session Management**: Pause, resume, and progress tracking

### 🎯 Bilateral Stimulation Options
- **Visual BLS**: Moving dot animation with eye tracking
- **Auditory BLS**: Bilateral audio tones (headphones recommended)
- **Haptic BLS**: Alternating vibration patterns
- **Customizable Duration**: Adjustable session lengths

### 💙 Therapeutic Features
- **SUDS/VOC Ratings**: Subjective Units of Disturbance and Validity of Cognition tracking
- **Body Scan**: Guided body awareness and tension release
- **Calm Place Setup**: Safe space visualization
- **Target Memory Processing**: Structured memory work
- **Session Notes**: Personal reflection and progress tracking

### 🔐 Subscription & Security
- **RevenueCat IAP**: Apple In-App Purchases integration
- **7-Day Free Trial**: No commitment trial period
- **£12.99/month**: Professional therapy access
- **Subscription Gating**: Secure content protection
- **Supabase Authentication**: Secure user management with Apple Sign In

### 📱 Mobile-Native Experience
- **React Native**: Native iOS/Android performance
- **Expo SDK 53**: Latest mobile development framework
- **Offline Capable**: AsyncStorage for session persistence
- **EMDRise Branding**: Professional therapeutic design
- **Responsive UI**: Optimized for all device sizes

## Technical Architecture

### Frontend Stack
- **React Native** with TypeScript
- **Expo SDK 53** for development and deployment
- **React Navigation v6** for native navigation
- **AsyncStorage** for local data persistence
- **Expo AV** for video playback
- **Expo Haptics** for bilateral stimulation

### Backend Services
- **Supabase**: Authentication, database, and video storage
- **RevenueCat**: Subscription management and Apple IAP
- **Neon Database**: PostgreSQL for user data

### Key Dependencies
```json
{
  "expo": "~53.0.0",
  "react-native": "0.76.1",
  "react-native-purchases": "^8.1.0",
  "@supabase/supabase-js": "^2.39.0",
  "expo-av": "~14.0.7",
  "expo-haptics": "~13.0.1"
}
```

## Project Structure

```
new-mobile-app/
├── App.tsx                          # Main app entry point
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── VideoPlayer.tsx         # Custom video player with controls
│   │   └── BLSComponent.tsx        # Bilateral stimulation implementation
│   ├── screens/                    # Main app screens
│   │   ├── HomeScreen.tsx          # Landing page with therapist selection
│   │   ├── LoginScreen.tsx         # Authentication screen
│   │   ├── SubscriptionScreen.tsx  # Subscription and trial management
│   │   └── EMDRSessionScreen.tsx   # Main EMDR therapy session
│   ├── providers/                  # React context providers
│   │   ├── AuthProvider.tsx        # Authentication state management
│   │   └── EMDRProvider.tsx        # EMDR session state management
│   ├── services/                   # External service integrations
│   │   ├── supabase.ts            # Supabase client configuration
│   │   └── RevenueCat.ts          # RevenueCat subscription service
│   ├── hooks/                     # Custom React hooks
│   │   └── useRevenueCat.ts       # RevenueCat subscription hook
│   ├── navigation/                # Navigation configuration
│   │   └── AppNavigator.tsx       # Main app navigation stack
│   ├── constants/                 # App constants and configuration
│   │   └── branding.ts            # EMDRise brand colors and styles
│   └── utils/                     # Utility functions
├── assets/                        # Static assets (images, icons)
├── app.json                       # Expo configuration
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio
- Apple Developer Account (for App Store deployment)

### Installation
```bash
cd new-mobile-app
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure Supabase credentials
3. Set up RevenueCat API keys
4. Configure Apple Developer settings

### Running the App
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## Deployment

### Apple App Store
1. **EAS Build**: Use Expo Application Services for native builds
2. **Bundle ID**: `com.emdrise.app`
3. **IAP Products**: Configure `com.emdrise.monthly` in App Store Connect
4. **RevenueCat Setup**: Link App Store Connect to RevenueCat dashboard

### Configuration Required
- **Apple Developer Account**: Active membership required
- **App Store Connect**: IAP product configuration
- **RevenueCat Dashboard**: IAP and subscription analytics setup
- **Supabase Project**: User authentication and video storage

## Core Features Implementation

### Authentication Flow
1. **Home Screen**: Therapist selection and trial signup
2. **Login Screen**: Email/password and Apple Sign In
3. **Subscription Screen**: 7-day trial with £12.99/month pricing
4. **Session Access**: Subscription verification before EMDR content

### EMDR Session Flow
1. **Script 1**: Welcome and EMDR introduction
2. **Script 2**: Calm place visualization setup
3. **Script 3**: Target memory identification and setup
4. **Script 4**: Desensitization preparation
5. **Script 5**: Active reprocessing with bilateral stimulation
6. **Script 5a**: Resumption video (if session was paused)
7. **Script 6-7**: Installation of positive beliefs
8. **Script 8**: Body scan for remaining disturbances
9. **Script 9**: Return to calm place for closure
10. **Script 10**: Aftercare and session completion

### Bilateral Stimulation Types
- **Visual**: Animated dot moving horizontally across screen
- **Auditory**: Alternating left/right audio tones (requires headphones)
- **Haptic**: Alternating vibration patterns using device haptics

## Security & Privacy

### Data Protection
- **Local Storage**: Session data stored in AsyncStorage
- **Supabase RLS**: Row Level Security for user data protection
- **RevenueCat**: Secure subscription and payment processing
- **No PHI Storage**: Personal health information not stored locally

### Subscription Security
- **Gated Content**: All EMDR sessions require active subscription
- **Server Validation**: RevenueCat validates subscription status
- **Trial Management**: 7-day trial period with automatic conversion

## Support & Documentation

### EMDR Protocol Compliance
- Based on standard 8-phase EMDR protocol
- Professional therapist guidance videos
- Proper bilateral stimulation implementation
- Session safety and grounding features

### Therapeutic Guidelines
- Not a substitute for professional mental health care
- Users encouraged to work with licensed therapists
- Crisis support resources and disclaimers included
- Proper informed consent and safety protocols

---

**EMDRise Mobile** - Professional EMDR therapy in your own space.
Built with ❤️ for healing and recovery.