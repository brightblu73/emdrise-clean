# Starting EMDRise Mobile App

## Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally
- iOS Simulator or Android emulator (optional)
- Physical device with Expo Go app (recommended)

### Installation Steps

1. **Navigate to mobile app directory:**
   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device/simulator:**
   - **Physical Device (Recommended):**
     - Install Expo Go app from App Store/Play Store
     - Scan QR code from terminal
   
   - **iOS Simulator:**
     ```bash
     npm run ios
     ```
   
   - **Android Emulator:**
     ```bash
     npm run android
     ```

### Features to Test

#### 1. **Authentication Flow**
- Test login with valid user credentials
- Experience the complete authentication journey

#### 2. **Therapist Selection**
- Choose between Maria (female) and Alistair (male)
- View detailed therapist profiles and specialties
- Notice the selection persistence across sessions

#### 3. **EMDR Session Experience**
- **Video-Guided Sessions**: Watch therapist introduction videos
- **Script Progression**: Experience the 10-script EMDR protocol
- **BLS Testing**: Test all three bilateral stimulation modes

#### 4. **Haptic Feedback (NEW)**
- **Visual BLS**: Feel different vibration patterns for left/right
- **Auditory BLS**: Gentle synchronized haptic feedback
- **Tapping BLS**: Enhanced double-tap patterns
- **Haptic Toggle**: Enable/disable haptic feedback
- **Platform-Specific**: Different patterns for iOS/Android

### Mobile-Specific Features

#### **Native Performance**
- Smooth video playback with portrait optimization
- Responsive touch interactions
- Device-specific haptic patterns

#### **Offline Capability**
- Local session storage with AsyncStorage
- Therapist preferences persistence
- Session progress tracking

#### **Device Integration**
- Vibration patterns for bilateral stimulation
- Platform-specific haptic feedback
- Native navigation and gestures

### Testing the Haptic Feedback

1. **Start any BLS mode** (Visual, Auditory, or Tapping)
2. **Feel the vibrations** - different patterns for left/right sides
3. **Toggle haptic feedback** using the phone icon button
4. **Experience the differences**:
   - Visual: Light pulse (left) vs stronger pulse (right)
   - Auditory: Synchronized gentle vibrations with audio
   - Tapping: Double-tap patterns with varying intensity

### Troubleshooting

#### **Common Issues:**
- **Metro bundler issues**: Clear cache with `npm start --clear`
- **Dependency conflicts**: Run `npm install --legacy-peer-deps`
- **Device connection**: Ensure device and computer are on same network

#### **Haptic Feedback Not Working:**
- Check if device supports vibration
- Ensure haptic feedback is enabled in device settings
- Test with different BLS modes

### Development Notes

- **Hot Reload**: Changes auto-refresh in development
- **Debugging**: Use Expo DevTools for debugging
- **Logs**: Check Metro bundler logs for errors
- **Assets**: Videos stored in `assets/videos/` directory

### Next Steps for Production

1. **Backend Integration**: Connect to production API
2. **App Store Preparation**: Build for iOS App Store
3. **Play Store Preparation**: Build for Google Play Store
4. **Testing**: Comprehensive device testing
5. **Deployment**: Submit to app stores

The mobile app provides a complete EMDR therapy experience with native performance and gentle haptic feedback for enhanced bilateral stimulation guidance.