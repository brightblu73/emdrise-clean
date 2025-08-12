# EMDRise Mobile App

A React Native mobile application for EMDR therapy sessions with video-guided therapeutic protocols.

## Features

- **Native Mobile Experience**: Optimized for iOS and Android
- **Dual Therapist Support**: Choose between Maria and Alistair
- **Video-Guided Sessions**: Complete EMDR protocol with therapist videos
- **Bilateral Stimulation**: Visual, auditory, and tapping BLS modes
- **Offline Capability**: Local storage for session data
- **Authentication**: Secure user login and session management

## Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Installation

1. Navigate to the mobile app directory:
   ```bash
   cd mobile-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Run on your preferred platform:
   - iOS: `npm run ios`
   - Android: `npm run android`
   - Web: `npm run web`

## Project Structure

```
mobile-app/
├── src/
│   ├── components/
│   │   ├── VideoPlayer.tsx      # Video playback component
│   │   └── BLSComponent.tsx     # Bilateral stimulation
│   ├── screens/
│   │   ├── HomeScreen.tsx       # App home screen
│   │   ├── LoginScreen.tsx      # Authentication
│   │   ├── TherapistSelectionScreen.tsx
│   │   └── EMDRSessionScreen.tsx
│   └── providers/
│       ├── AuthProvider.tsx     # Authentication context
│       └── EMDRProvider.tsx     # EMDR session management
├── assets/
│   └── videos/                  # Therapist video files
├── App.tsx                      # Main app component
└── package.json
```

## Key Technologies

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **React Navigation**: Screen navigation
- **Expo AV**: Video and audio playback
- **AsyncStorage**: Local data persistence
- **TypeScript**: Type safety and development experience

## Development Notes

- Videos are stored in `assets/videos/` directory
- Session data is persisted locally using AsyncStorage
- Authentication uses simple credential validation (expandable)
- BLS components include visual, auditory, and tactile stimulation

## Video Assets

All EMDR script videos are now hosted on Supabase cloud storage:
- Scripts 1-10 for both Maria and Alistair therapists
- Videos delivered via secure HTTPS URLs from Supabase storage
- No local video files required for the mobile app

Video naming convention: `{therapist}-script{number}-{name}.mp4`

## Deployment

For production deployment:

1. Build the app:
   ```bash
   expo build
   ```

2. Submit to app stores:
   ```bash
   expo submit
   ```

## Testing

Authentication system requires proper credentials for access.

## Next Steps

1. Connect to production backend API
2. Add real authentication system
3. Implement push notifications
4. Add offline video caching
5. Submit to app stores