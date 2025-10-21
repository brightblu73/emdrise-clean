# EMDRise - EMDR Therapy Application

## Overview
EMDRise is a web and mobile application offering guided EMDR (Eye Movement Desensitization and Reprocessing) therapy sessions. Its core purpose is to provide a professional therapeutic experience through a virtual therapist, integrating modern web technologies with specialized EMDR protocols. The project's primary ambition is to deliver a comprehensive mobile application, with a web version as a secondary consideration for future development.

## User Preferences
- **Communication Style**: Simple, everyday language that's non-technical and supportive
- **Development Focus**: Web app as the single source of truth, with future mobile deployment via Ionic Capacitor
- **Feature Philosophy**: Core EMDR therapeutic workflow only - relaxation playlists and supplementary features have been definitively removed
- **Platform Strategy**: Web-first development with PWA capabilities, preparing for native mobile deployment

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

### Web-First Architecture (PRIMARY)
**IMPORTANT**: As of the latest migration, the web app in the `client/` folder is the SOLE source of truth for EMDRise. The `mobile-app/` folder is obsolete and no longer used. All development focuses on the web application, which will serve as the foundation for future mobile deployment via Ionic Capacitor.

### UI/UX Decisions
- **EMDRise Brand Identity**: Professional therapeutic design using established color palette (Primary Blue #1E90FF, Primary Green #05A660, therapeutic backgrounds)
- **Responsive Web Design**: React components with therapeutic styling, custom therapist avatars, and mobile-optimized responsive layouts
- **Navigation**: Wouter routing for seamless single-page application experience
- **Logo Implementation**: React `<Logo />` component with variant support (header, hero, mobile, footer)
- **Brand Compliance**: All components follow EMDRise Brand Guidelines with responsive web styling

### Technical Implementations
- **Web Application Structure**:
    - **Main App**: `client/src/App.tsx` with routing and authentication providers
    - **Authentication**: Supabase integration with local storage persistence and Apple Sign In support
    - **EMDR Session Management**: React hooks with local storage-based state persistence
    - **Navigation**: Wouter routing with pages for Home, Login, TherapistSelection, EMDRSession, Subscription
    - **Payment Integration**: Stripe integration for subscription management

- **Core EMDR Features** (Web-Optimized):
    - **Video-Guided Therapy**: HTML5 video player with professional therapist content for all 10 EMDR protocol phases
    - **Session Flow Management**: Local storage-based pause/resume functionality with Script 5a continuation support
    - **Web BLS System**: Web APIs for vibration, stereo audio, and visual stimulation optimized for all devices (configured for 30 sets per BLS cycle via centralized `client/src/lib/blsConfig.ts`)
    - **Subscription Management**: Stripe-powered subscriptions with 7-day free trial support
    - **Cloud-First Architecture**: Video content served from Supabase cloud storage, optimized for web streaming

### System Design Choices
- **Primary Platform**: Web application with PWA capabilities via `client/` folder
- **Web Framework**: React 18 with Vite, TypeScript, ES modules
- **Navigation**: Wouter for lightweight client-side routing
- **Video Playback**: HTML5 video for cross-platform streaming
- **Local Storage**: Browser localStorage for session persistence, therapist selection, and auth state
- **Authentication**: React AuthProvider with Supabase backend integration
- **Payment Processing**: Stripe for web-based subscription management
- **Development Workflow**: Web app located in `client/` directory with Vite dev server for development and production builds
- **Future Mobile**: Foundation prepared for native mobile deployment via Ionic Capacitor

## External Dependencies

- **Stripe**: For web-based subscription management and payment processing.
- **Supabase**: Provides authentication, database, and cloud storage services.
- **Apple Developer Account**: Necessary for Apple Sign In capabilities and future mobile app deployment.
- **Neon Database**: Hosts the serverless PostgreSQL database.
- **Radix UI**: Used for accessible UI component primitives.
- **Tailwind CSS**: Utilized as the utility-first styling framework.
- **Lucide Icons**: Provides a consistent iconography set.
- **Swiper.js**: Integrated for responsive carousel implementations.
- **Vite**: The build tool and development server for the web application.
- **Browser LocalStorage**: Employed for local data persistence in the web application.