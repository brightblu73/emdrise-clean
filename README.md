# EMDRise - EMDR Therapy Application

A comprehensive EMDR (Eye Movement Desensitization and Reprocessing) therapy application providing guided therapeutic sessions with professional therapist videos and advanced bilateral stimulation. Mobile-first design with web platform support.

## Key Features

- **Automatic Therapist Selection**: Streamlined experience with Alistair as the default virtual therapist
- **Complete EMDR Protocol**: 10-phase guided sessions with professional video narration
- **Dual Session Flow Management**:
  - **Normal Flow**: Complete sessions (Scripts 1-10) → home → new journey starts at Script 1
  - **Pause Flow**: Interrupted sessions resume at Script 5a after safe closure sequence
- **Advanced Bilateral Stimulation**: Visual dots, stereo audio, and haptic feedback for mobile devices
- **Intelligent Session Management**: Persistent pause/resume system that survives closure sequences
- **Professional Video Library**: Authentic therapist guidance for all phases including resumption videos
- **Mobile-Optimized**: React Native/Expo app with full offline functionality
- **Subscription Platform**: Stripe integration with 7-day free trial

## Architecture

### Mobile App (Primary Platform)
- React Native with Expo SDK
- TypeScript with ES modules  
- Expo AV for native video playback
- AsyncStorage for session persistence
- Native haptic feedback integration
- Comprehensive offline functionality

### Web Platform 
- React 18 with TypeScript
- Vite build system with HMR
- Tailwind CSS with shadcn/ui components
- TanStack Query for state management
- Responsive design for all devices

### Backend Infrastructure
- Node.js with Express.js
- PostgreSQL with Drizzle ORM
- Neon serverless database hosting
- Session-based authentication with bcrypt
- Stripe payment processing

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

## Getting Started

### Web Platform
```bash
npm install
npm run dev
```

### Mobile App  
```bash
cd mobile-app
npm install
expo start
```

### Environment Setup
- Configure PostgreSQL database connection
- Set up Stripe payment keys
- Ensure video assets are properly hosted

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

- **Persistent Session Management**: localStorage-based system with reliable pause/resume
- **Video Integration**: Seamless therapist guidance with BLS synchronization  
- **Cross-Platform**: Shared codebase between web and mobile with platform-specific optimizations
- **Professional UI/UX**: Ambient therapeutic design with accessibility considerations
- **Scalable Architecture**: Microservices-ready backend with serverless database

## License

Private therapy application - All rights reserved.