# EMDRise - EMDR Therapy Application

## Overview
EMDRise is a web and mobile application providing guided EMDR (Eye Movement Desensitization and Reprocessing) therapy sessions. It integrates modern web technologies with specialized EMDR protocols, featuring a virtual therapist to deliver a professional therapeutic experience. The primary focus is on delivering a comprehensive mobile application, with a web version as a future consideration.

## User Preferences
- **Communication Style**: Simple, everyday language that's non-technical and supportive
- **Development Focus**: Mobile app (React Native/Expo) as primary platform, web version secondary/future consideration
- **Feature Philosophy**: Core EMDR therapeutic workflow only - relaxation playlists and supplementary features have been definitively removed
- **Mobile Synchronization**: Update both web and mobile simultaneously to maintain feature parity

## System Architecture

### Mobile App Architecture (Primary Focus)
- **Framework**: React Native with Expo
- **Platform**: iOS and Android native apps
- **Language**: TypeScript with ES modules
- **Navigation**: React Navigation v6
- **Video Playback**: Expo AV
- **Storage**: AsyncStorage for local session persistence
- **Authentication**: Context-based auth with local storage
- **BLS System**: Native haptic feedback, stereo audio, and visual stimulation

### Web App Architecture (Future Consideration)
- **Status**: Temporarily paused - mobile app is the initial focus
- **Framework**: React 18 with TypeScript

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Authentication (migrated from Passport.js)
- **Payment Processing**: Stripe integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL adapter
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema**: Type-safe schema definitions with Zod validation

### Core EMDR Features (Production-Ready & Locked)
- **Authentication System**: Supabase-based authentication with session management
- **Video-Guided EMDR Therapy**: Complete video narration by professional therapists (Maria and Alistair) for all 10 phases of the EMDR protocol, including integrated Bilateral Stimulation (BLS)
- **Video-Guided Workflow**: Seamless progression through EMDR phases (Welcome, Calm Place Setup, Target Memory, Desensitisation, Reprocessing Loops, Installation, Body Scan, Calm Place Return, Aftercare)
- **Dual Session Flow Management**: 
  - Normal flow: Scripts 1→2→3→4→5→6→7→8→9→10→home→"Continue" starts new journey at Script 1
  - Pause flow: Scripts 1→2→3→4→pause→9→10→home→"Continue" resumes at Script 5a→5→6→7→8→9→10→home→"Continue" starts new journey at Script 1
- **Reliable Pause/Resume System**: Uses persistent localStorage flag (`emdrPauseFlag`) that survives closure sequence, ensuring paused sessions correctly resume at Script 5a
- **Script 5a Integration**: Authentic therapist videos for resuming interrupted sessions, properly integrated with BLS functionality
- **Intelligent Session Navigation**: "Continue Your Journey" button works seamlessly to detect and resume paused sessions while maintaining a clean, professional interface
- **Subscription Management**: Stripe integration for payments, 7-day free trial
- **Therapeutic Components**: Therapist-guided videos, integrated BLS (visual, auditory, tactile with haptic feedback), session note-taking (removed from core scripts per user amendment), and backward navigation within sessions
- **UI/UX**: Ambient color scheme, professional layout, EMDR Journey Timeline component, responsive button sizing, and endorsement carousel featuring organizations recommending EMDR

### Recent Changes (Aug 2025)
- **Video Loading Optimization (Aug 12, 2025)**: Stabilized EMDR video loading by implementing proper video ready states - removed preloading hacks, eliminated black frame flicker, and added minimal "Loading session..." state that only shows until video metadata is ready
- **Button Text Update (Aug 12, 2025)**: Updated all "Continue Your Journey" buttons across web and mobile apps to "Choose Therapist & Continue" with improved typography matching between logged-in and logged-out states
- **Complete Video Migration**: All EMDR therapy videos (Scripts 1-10) migrated from local files to Supabase cloud storage
- **Therapist Selection Fix**: Corrected force-override bug that was ignoring user's therapist selection
- **File Cleanup**: Removed all local video files after successful Supabase migration (1.2GB+ storage saved)
- **Enhanced User Choice**: Therapist selection now properly persists and loads selected therapist's videos
- **Cloud-First Architecture**: All video content now served from reliable cloud infrastructure
- **Complete BLS Speed System Upgrade**: Successfully implemented unified speed slider (1.0-10.0 with 0.5 increments) across ALL BLS types (visual, auditory, tapping), replacing legacy speed controls with therapeutically accurate speed mapping (1.0=4.0s/15BPM to 10.0=0.15s/400BPM), consistent default speed of 8.0 (0.54s/111BPM), session memory for speed persistence, and real-time speed adjustments during active BLS sessions
- **BLS Close Button Optimization**: Completely resolved double-click issue with immediate close functionality - implemented forceClose functions with multiple event triggers (onClick, onMouseDown, onTouchStart), aggressive animation cleanup, and immediate state reset across all BLS modals for silky smooth responsiveness
- **CRITICAL: Mobile Touch Event Fix (Aug 8, 2025)**: Resolved infinite BLS loop caused by mobile touch event bleeding where closing one BLS modal accidentally triggered other BLS buttons. Implemented `blsClosing` state with 500ms guard period, preventing accidental button activation during modal close transitions. Issue was mobile-specific touch sensitivity causing simultaneous button activations.
- **BLS Component Flashing Fix (Aug 10, 2025)**: Completely eliminated ghost flashing of BLS option boxes across ALL screens containing BLS components. Implemented comprehensive protection with immediate DOM manipulation, extended transition periods (300-500ms), CSS-based hiding with universal selectors, and automatic style restoration. Applied to main EMDR session script transitions, bilateral stimulation component state changes, and processing page grids. All BLS transitions are now seamless and professional.
- **Complete Supabase Authentication Migration (Aug 11, 2025)**: Successfully migrated entire application from Express session-based authentication to Supabase authentication system. Implemented unified `gotoAuthOrSession()` helper function for all homepage CTAs, updated auth page redirect to route to `/emdr-session` after login, integrated Supabase authentication guards in EMDR session access, and updated navigation component with comprehensive Supabase sign-out functionality including localStorage/sessionStorage cleanup. All authentication flows now use `supabase.auth.getSession()` and `supabase.auth.signInWithPassword()` for consistent user experience.
- **Focus Maintained**: Core EMDR workflow remains unchanged and production-ready

## External Dependencies

- **Stripe**: For subscription management and payment processing.
- **Neon Database**: Serverless PostgreSQL hosting.
- **Radix UI**: Accessible component primitives for UI.
- **Tailwind CSS**: Utility-first styling framework.
- **Lucide Icons**: Consistent iconography.
- **Swiper.js**: For responsive carousel implementations.
- **Expo**: React Native framework for mobile development.
- **AsyncStorage**: Local storage for mobile session persistence.