# EMDRise - EMDR Therapy Application

## Overview
EMDRise is a web and mobile application offering guided EMDR (Eye Movement Desensitization and Reprocessing) therapy sessions. Its core purpose is to provide a professional therapeutic experience through a virtual therapist, integrating modern web technologies with specialized EMDR protocols. The project's primary ambition is to deliver a comprehensive mobile application, with a web version as a secondary consideration for future development.

## User Preferences
- **Communication Style**: Simple, everyday language that's non-technical and supportive
- **Development Focus**: Mobile app (React Native/Expo) as primary platform, web version secondary/future consideration
- **Feature Philosophy**: Core EMDR therapeutic workflow only - relaxation playlists and supplementary features have been definitively removed
- **Mobile Synchronization**: Update both web and mobile simultaneously to maintain feature parity

## EMDRise Branding Standards
**MANDATORY**: All new features, iterations, and changes must automatically incorporate EMDRise branding guidelines:

### Color System (CSS Variables - ALWAYS USE)
- **Primary Colors**: `--primary-blue` (hsl(217, 88%, 58%)), `--primary-green` (hsl(158, 92%, 40%))
- **Secondary Colors**: `--secondary-blue` (hsl(212, 92%, 66%)), `--secondary-green` (hsl(162, 83%, 58%))
- **Accent**: `--warm-accent` (hsl(41, 96%, 48%)) for CTAs and notifications
- **Therapeutic Backgrounds**: `--therapeutic-bg`, `--safe-space` for calm, clinical environments

### Tailwind Classes (USE THESE)
- `text-primary-blue`, `bg-primary-green`, `border-secondary-blue`, `text-primary-green`
- NEVER use: generic `blue-600`, `green-500`, `blue-50` or hardcoded hex values

### Component Standards
- **Logo**: Always use `<Logo variant="hero|header|mobile|footer" />` component
- **Gradients**: Use `emdr-gradient` class or CSS `linear-gradient(135deg, var(--primary-blue), var(--primary-green))`
- **Cards**: Apply `therapeutic-card` class for consistent styling
- **Buttons**: Primary buttons use EMDR gradient, secondary use brand color borders
- **Typography**: Headings in `text-primary-blue`, supporting text in appropriate brand colors

### Brand Voice & Standards
- **Professional yet supportive** tone in all UI text
- **Therapeutic safety** as priority in design decisions
- **Clinical credibility** through consistent professional styling
- **Hope and healing** reflected in color choices and interactions

### Development Rules
1. **NO exceptions** - every new element must use EMDRise brand colors
2. **CSS Variables first** - reference `--primary-blue` etc., not hardcoded values
3. **Component consistency** - use established patterns from existing components
4. **Brand audit required** - verify all changes against brand guidelines before implementation

## System Architecture

### Mobile-First Architecture (PRIMARY)
**IMPORTANT**: As of the latest migration, the `mobile-app` folder is the SOLE source of truth for EMDRise. The web client has been deprecated in favor of native mobile development.

### UI/UX Decisions
- **EMDRise Brand Identity**: Professional therapeutic design using established color palette (Primary Blue #1E90FF, Primary Green #05A660, therapeutic backgrounds)
- **Mobile-Native Design**: React Native components with therapeutic styling, custom therapist avatars, and mobile-optimized layouts
- **Navigation**: React Navigation v6 with stack-based navigation for seamless mobile UX
- **Logo Implementation**: React Native `<Logo />` component with variant support (header, hero, mobile, footer)
- **Brand Compliance**: All mobile components follow EMDRise Brand Guidelines with native styling

### Technical Implementations
- **Mobile Application Structure**:
    - **Main App**: `mobile-app/App.tsx` with AuthProvider and AppNavigator
    - **Authentication**: Mobile Supabase integration with AsyncStorage persistence and Apple Sign In support
    - **EMDR Session Management**: Mobile-optimized session hooks with AsyncStorage-based state persistence
    - **Navigation**: Dedicated AppNavigator with screens for Home, Login, TherapistSelection, EMDRSession, Subscription
    - **RevenueCat Integration**: Native iOS/Android In-App Purchase handling via RevenueCat SDK

- **Core EMDR Features** (Mobile-Native):
    - **Video-Guided Therapy**: Expo AV video player with professional therapist content for all 10 EMDR protocol phases
    - **Session Flow Management**: AsyncStorage-based pause/resume functionality with Script 5a continuation support
    - **Mobile BLS System**: Native haptic feedback via Expo Haptics, stereo audio, and visual stimulation optimized for mobile devices
    - **Subscription Management**: Apple In-App Purchases via RevenueCat with 7-day free trial support
    - **Cloud-First Architecture**: Video content served from Supabase cloud storage, optimized for mobile streaming

### System Design Choices
- **Primary Platform**: Mobile application (iOS and Android native apps) via `mobile-app/` folder
- **Mobile Framework**: React Native with Expo (~51.0.28), TypeScript, ES modules
- **Mobile Navigation**: React Navigation v6 with stack navigator
- **Video Playback**: Expo AV for mobile-optimized video streaming
- **Local Storage**: AsyncStorage for session persistence, therapist selection, and auth state
- **Authentication**: Mobile AuthProvider with Supabase backend integration
- **Payment Processing**: RevenueCat for Apple In-App Purchases and subscription management
- **Development Workflow**: Mobile app located in `mobile-app/` directory with Expo CLI for development and EAS for builds

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