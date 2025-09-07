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

### UI/UX Decisions
- **EMDRise Brand Identity**: Professional therapeutic design using established color palette (Primary Blue #1E90FF, Primary Green #05A660, therapeutic backgrounds)
- **Layout**: Responsive, accessible design with EMDR Journey Timeline, therapeutic cards, and professional spacing
- **Endorsements**: Carousel showcasing organizational EMDR endorsements with consistent brand styling
- **Logo Implementation**: Consistent `<Logo />` component usage across all pages and contexts
- **Brand Compliance**: All visual elements follow EMDRise Brand Guidelines (EMDRise-Brand-Guidelines.md)

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