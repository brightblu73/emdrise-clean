# EMDRise Web Development Guide

## 🚀 Primary Platform: React Web Application

This project is **web-first**. The React web app in the `client/` folder is the single source of truth and primary platform.

### Quick Start for Web Development

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - **Local Development:** Open browser to the provided Replit URL
   - **Mobile Testing:** Access the same URL on mobile devices
   - **PWA Installation:** Install as a Progressive Web App for mobile app-like experience

3. **Production build:**
   ```bash
   npm run build
   npm start
   ```

### Web App Features

#### ✅ Complete EMDR Therapy System
- **Therapist Selection**: Choose between Maria and Alistair
- **10-Script Video Protocol**: Complete therapeutic progression
- **HTML5 Video Playback**: Cross-platform video streaming
- **BLS Integration**: Visual, auditory, and tapping bilateral stimulation

#### ✅ Web-Specific Enhancements
- **Responsive Design**: Optimized for all screen sizes
- **Local Storage**: Browser-based session persistence
- **Progressive Web App**: Mobile app-like experience
- **Touch & Click Support**: Smooth interactions across devices
- **Cross-Platform**: Works on any device with a modern browser

#### ✅ Bilateral Stimulation (BLS)
- **Visual BLS**: Animated elements with device vibration support
- **Auditory BLS**: Stereo audio with Web Audio API
- **Tapping BLS**: Interactive elements for all input methods
- **Device Capabilities**: Leverages available device features (vibration, audio)

### Project Structure

```
client/
├── src/
│   ├── App.tsx                    # Main app entry point
│   ├── components/
│   │   ├── BLSComponent.tsx       # Bilateral stimulation system
│   │   └── ui/                    # UI component library
│   ├── pages/
│   │   ├── EMDRSession.tsx        # Main therapy session
│   │   ├── Home.tsx               # Landing/therapist selection
│   │   └── Login.tsx              # Authentication
│   ├── lib/
│   │   └── supabase.ts            # Supabase client
│   └── assets/
│       └── videos/                # Therapist video library
server/
├── index.ts                   # Express server
└── routes.ts                  # API routes
```

### Development Status

- ✅ **Architecture**: Complete React/Vite/Express setup
- ✅ **Authentication**: Supabase integration with Apple Sign-In
- ✅ **Video System**: All 10 scripts for both therapists
- ✅ **BLS System**: Web-optimized with device capability detection
- ✅ **Navigation**: Full script progression with Wouter routing
- ✅ **Storage**: Local storage integration
- ✅ **Payments**: Stripe integration for subscriptions

### Mobile Deployment Strategy

The web app serves as the foundation for:
- **Immediate Use**: Full-featured Progressive Web App
- **Future Mobile**: Native mobile deployment via Ionic Capacitor
- **Cross-Platform**: Single codebase for web and mobile

### Next Steps

1. **PWA Enhancement**: Improve offline capabilities
2. **Mobile Optimization**: Fine-tune responsive design
3. **Capacitor Integration**: Prepare for native mobile deployment
4. **App Store Preparation**: Build native versions when ready

The web app provides the complete EMDRise experience with cross-platform compatibility and future mobile deployment readiness.