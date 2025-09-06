# EMDRise - EMDR Therapy Application

## Overview
EMDRise is a web and mobile application offering guided EMDR (Eye Movement Desensitization and Reprocessing) therapy sessions. Its core purpose is to provide a professional therapeutic experience through a virtual therapist, integrating modern web technologies with specialized EMDR protocols. The project's primary ambition is to deliver a comprehensive mobile application, with a web version as a secondary consideration for future development.

## User Preferences
- **Communication Style**: Simple, everyday language that's non-technical and supportive
- **Development Focus**: Mobile app (React Native/Expo) as primary platform, web version secondary/future consideration
- **Feature Philosophy**: Core EMDR therapeutic workflow only - relaxation playlists and supplementary features have been definitively removed
- **Mobile Synchronization**: Update both web and mobile simultaneously to maintain feature parity

## System Architecture

### UI/UX Decisions
- **Color Scheme**: Ambient and professional.
- **Layout**: Professional and responsive with components like EMDR Journey Timeline and responsive button sizing.
- **Endorsements**: Features a carousel for organizational recommendations of EMDR.

### Technical Implementations
- **Core EMDR Features**:
    - **Authentication**: Supabase-based with session management and secure account deletion. Includes Apple Sign In.
    - **Video-Guided Therapy**: Professional therapist videos for all 10 EMDR protocol phases, including integrated Bilateral Stimulation (BLS).
    - **Session Flow Management**: Supports both normal progression and reliable pause/resume functionality, ensuring sessions can be interrupted and resumed accurately at the correct phase (Script 5a).
    - **Intelligent Session Navigation**: "Continue Your Journey" button seamlessly detects and resumes paused sessions.
    - **Subscription Management**: Integrates Apple In-App Purchases via RevenueCat, offering a 7-day free trial.
    - **Therapeutic Components**: Therapist-guided videos, integrated BLS (visual, auditory, tactile with haptic feedback), and backward navigation within sessions.
    - **BLS System**: Native haptic feedback, stereo audio, and visual stimulation with a unified, therapeutically accurate speed slider (1.0-10.0) across all BLS types. Includes session memory for speed persistence and real-time adjustments.
    - **Cloud-First Architecture**: All video content is served from Supabase cloud storage.

### System Design Choices
- **Primary Platform**: Mobile application (iOS and Android native apps).
- **Mobile Framework**: React Native with Expo, TypeScript, ES modules.
- **Mobile Navigation**: React Navigation v6.
- **Video Playback**: Expo AV.
- **Local Storage**: AsyncStorage for local session persistence.
- **Authentication**: Context-based auth with local storage for mobile, Supabase for backend.
- **Backend**: Node.js with Express.js, TypeScript, ES modules.
- **Database**: PostgreSQL with Drizzle ORM, using Neon serverless PostgreSQL for connection pooling. Type-safe schema definitions with Zod validation.
- **Payment Processing**: Apple In-App Purchases via RevenueCat.
- **Architectural Principle**: Focus on mobile-first development, ensuring core EMDR workflow is production-ready and stable.

## External Dependencies

- **RevenueCat**: For Apple In-App Purchase subscription management and analytics.
- **Supabase**: Provides authentication, database, and cloud storage services.
- **Apple Developer Account**: Necessary for App Store IAP integration and Apple Sign In capabilities.
- **Neon Database**: Hosts the serverless PostgreSQL database.
- **Radix UI**: Used for accessible UI component primitives.
- **Tailwind CSS**: Utilized as the utility-first styling framework.
- **Lucide Icons**: Provides a consistent iconography set.
- **Swiper.js**: Integrated for responsive carousel implementations.
- **Expo**: The framework used for React Native mobile development.
- **AsyncStorage**: Employed for local data persistence in the mobile application.