# EMDRise - EMDR Therapy Application

A comprehensive EMDR (Eye Movement Desensitization and Reprocessing) therapy application providing guided therapeutic sessions with professional therapist videos and advanced bilateral stimulation. Modern web application built with React, TypeScript, and advanced PWA capabilities that will serve as the foundation for future mobile deployment via Ionic Capacitor.

## 🚀 **DEVELOPERS START HERE**

**🌐 Production Web App Location:** `client/` directory  
**⚠️ Important:** The web app is the single source of truth. The `mobile-app/` directory is obsolete and no longer used. Use ONLY the web app for development and testing.

## Key Features

- **Professional Therapist Options**: Choose between Maria and Alistair virtual therapists
- **Complete EMDR Protocol**: 10-phase guided sessions with professional video narration
- **Dual Session Flow Management**:
  - **Normal Flow**: Complete sessions (Scripts 1-10) → home → new journey starts at Script 1
  - **Pause Flow**: Interrupted sessions resume at Script 5a after safe closure sequence
- **Advanced Bilateral Stimulation**: Visual dots, stereo audio, and haptic feedback for mobile devices
- **Intelligent Session Management**: Persistent pause/resume system that survives closure sequences
- **Professional Video Library**: Authentic therapist guidance for all phases including resumption videos
- **Mobile-Ready**: Progressive Web App with responsive design, optimized for mobile deployment via Capacitor
- **Apple IAP Integration**: RevenueCat-powered subscription management with 7-day free trial (£9.99/month)

## Architecture

### Web Application (React + TypeScript + Vite)
- Modern React 18 with TypeScript and ES modules  
- Vite for fast development and optimized builds
- HTML5 video for cross-platform video playback
- Local storage for session persistence
- Wouter for lightweight client-side routing
- Web APIs for device capabilities (vibration, audio)
- Stripe integration for payment processing
- Progressive Web App capabilities for mobile-like experience

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

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access Application
- Open browser to the provided Replit URL
- Test on mobile devices via the web URL
- PWA installation available for mobile app-like experience

## Getting Started

### Web Application
```bash
npm install
npm run dev
```

For production build:
```bash
npm run build
npm start
```

### Environment Setup
- Configure Supabase authentication
- Set up Stripe for payment processing
- Configure Apple Sign-In for web authentication
- Ensure video assets are hosted on Supabase storage
- Future mobile deployment via Ionic Capacitor

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

- **Persistent Session Management**: Local storage-based system with reliable pause/resume
- **Video Integration**: Seamless therapist guidance with BLS synchronization  
- **Cross-Platform Web Experience**: Responsive design optimized for all devices with PWA capabilities
- **Professional UI/UX**: Ambient therapeutic design with accessibility considerations
- **Scalable Architecture**: Microservices-ready backend with serverless database
- **Mobile Deployment Ready**: Foundation prepared for native mobile apps via Ionic Capacitor

## License

Private therapy application - All rights reserved.