# EMDRise Brand Guidelines

## Overview
EMDRise is a professional EMDR therapy application that provides guided eye movement desensitization and reprocessing sessions. Our brand embodies trust, healing, professionalism, and therapeutic support through a carefully designed visual identity that conveys both clinical expertise and emotional safety.

## Brand Mission
"Empowering healing through accessible, professional EMDR therapy guided by virtual experts."

## Core Brand Values
- **Professional Expertise**: Clinical-grade therapeutic guidance
- **Therapeutic Safety**: Creating safe spaces for emotional healing
- **Accessibility**: EMDR therapy available when and where needed
- **Trust**: Reliable, secure, and confidential therapeutic support
- **Hope**: Supporting users through their healing journey

---

## Color Palette

### Primary Colors
- **Primary Blue**: `hsl(217, 88%, 58%)` (#1E90FF)
  - Usage: Main brand color, headings, primary buttons, logo text
  - Represents: Trust, stability, professionalism
  
- **Primary Green**: `hsl(158, 92%, 40%)` (#05A660)
  - Usage: Success states, therapeutic elements, accent colors
  - Represents: Healing, growth, therapeutic progress

### Secondary Colors
- **Secondary Blue**: `hsl(212, 92%, 66%)` (#3B9DFF)
  - Usage: Hover states, secondary elements
  - Complements primary blue with lighter tone
  
- **Secondary Green**: `hsl(162, 83%, 58%)` (#1DD1A1)
  - Usage: Accent highlights, success indicators
  - Softer complement to primary green

### Accent Colors
- **Warm Accent**: `hsl(41, 96%, 48%)` (#F5A623)
  - Usage: Call-to-action elements, important notifications, warmth
  - Represents: Support, encouragement, guidance

### Therapeutic Background Colors
- **Therapeutic Background**: `hsl(210, 40%, 98%)` (#F8FAFC)
  - Usage: Main page backgrounds, clean surfaces
  - Creates calming, clinical environment
  
- **Safe Space**: `hsl(158, 30%, 95%)` (#F0F7F4)
  - Usage: Therapy session areas, safe interaction zones
  - Represents emotional safety and therapeutic containment

### Neutral Colors
- **Foreground**: `hsl(222, 47%, 11%)` (#1A202C)
- **Muted**: `hsl(210, 30%, 96%)` (#F1F5F9)
- **Border**: `hsl(214, 32%, 91%)` (#E2E8F0)
- **Card**: `hsl(210, 35%, 97%)` (#F7FAFC)

---

## Typography

### Font Family
**Primary**: Inter (system-ui, sans-serif fallback)
- Professional, clean, highly readable
- Excellent for both digital interfaces and therapeutic content

### Heading Styles
- **H1 (ny-heading)**: 
  - Size: 2.5rem (md: 3rem)
  - Weight: Bold (700)
  - Line Height: Tight
  - Usage: Page titles, main headings

- **H2 (ny-subheading)**:
  - Size: 1.5rem (md: 1.875rem)
  - Weight: Semibold (600)
  - Line Height: Snug
  - Usage: Section headings, card titles

### Brand Voice & Tone
- **Professional**: Clinical expertise without intimidation
- **Supportive**: Encouraging and empathetic
- **Clear**: Simple, direct communication
- **Respectful**: Acknowledging user courage and journey
- **Hopeful**: Focused on healing and progress

---

## Logo Usage

### Logo Variants
The EMDRise logo is available in multiple variants optimized for different contexts:

#### Web Application
- **Hero**: 128px height (main landing areas)
- **Header**: 100px height (navigation bars)
- **Mobile**: 48px height (mobile navigation)
- **Footer**: 40px height (footer areas)

#### Mobile Application
- **Hero**: 128x128px (onboarding, main screens)
- **Header**: 80x80px (app navigation)
- **Mobile**: 48x48px (compact views)
- **Footer**: 40x40px (secondary placements)

### Logo Guidelines
- Always maintain proper aspect ratio
- Ensure sufficient clear space around the logo
- Logo file: `/public/emdrise-logo.svg` (web), `emdrise-logo.png` (mobile)
- Alternative text: "EMDRise logo"

### Logo Accompanying Text (Mobile)
- **Brand Name**: "EMDRise" (Bold, #0077D9)
- **Tagline**: "Healing Together" (Regular, #0077D9)

---

## Visual Elements & Patterns

### Gradients
- **EMDR Gradient**: Linear gradient from Primary Blue to Primary Green (135deg)
  - Usage: Hero sections, call-to-action buttons
  - CSS: `background: linear-gradient(135deg, var(--primary-blue), var(--primary-green))`

- **Courage Gradient**: Multi-stop gradient
  - Primary Blue (0%) → Secondary Blue (25%) → Primary Green (75%) → Secondary Green (100%)
  - Usage: Inspirational sections, progress indicators

### Card Design
- **Therapeutic Cards**: 
  - Background: Card color with subtle border
  - Border radius: 12px (rounded-xl)
  - Shadow: Subtle with hover elevation
  - Usage: Content containers, session cards

### Interactive Elements

#### Buttons
- **Primary**: EMDR gradient background, white text
- **Secondary**: Border with primary colors, colored text
- **Hover States**: Subtle elevation and color intensification

#### EMDR Phase Indicators
Color-coded circular indicators for therapy phases:
- **Phases 1-2**: Primary Blue (preparation, assessment)
- **Phase 3**: Primary Green (activation, desensitization)
- **Phase 4**: Secondary Blue (installation)
- **Phases 5-7**: Warm Accent (body scan, closure, evaluation)

### Animations
- **Therapeutic Pulse**: Gentle 2-second fade for calming effect
- **Bilateral Indicators**: Gradient pulse for EMDR stimulation
- **Transitions**: Smooth, respectful timing (no jarring movements)

---

## Layout Principles

### Spacing & Rhythm
- **Container Max Width**: 4xl (896px) for optimal reading
- **Section Spacing**: Consistent 2rem (32px) vertical rhythm
- **Card Padding**: 2rem internal padding for comfortable content

### Responsive Design
- **Mobile-First**: Optimized for therapy sessions on personal devices
- **Tablet**: Comfortable viewing for extended sessions
- **Desktop**: Professional interface for broader content

### Accessibility
- **High Contrast**: All text meets WCAG AA standards
- **Focus States**: Clear keyboard navigation indicators  
- **Screen Reader**: Semantic HTML with proper ARIA labels
- **Therapeutic Consideration**: Non-triggering visual patterns

---

## Content Strategy

### Messaging Hierarchy
1. **Safety First**: Emergency resources and professional guidance
2. **Therapeutic Value**: Evidence-based EMDR protocols
3. **User Empowerment**: Tools for self-directed healing
4. **Professional Support**: Expert-guided experiences

### Content Tone
- Use "you" to maintain personal connection
- Acknowledge user courage and strength
- Provide clear, step-by-step guidance
- Offer hope while maintaining realistic expectations
- Include appropriate disclaimers and safety information

---

## Platform-Specific Applications

### Web Platform
- **Framework**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query
- **Responsive**: Mobile-first responsive design
- **Performance**: Optimized loading for therapy content

### Mobile Platform  
- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **Video**: Expo AV for therapeutic content
- **Storage**: AsyncStorage for session persistence
- **Payments**: RevenueCat + Apple IAP

---

## Brand Extensions

### Email Communications
- Clean, therapeutic design
- Primary blue headers with warm accent CTAs
- Professional yet supportive tone
- Clear therapeutic disclaimers

### Legal Documents
- Consistent EMDRise branding
- Professional layout with blue headings
- Clear, accessible language
- Updated company information: GC Psychotherapy

### Marketing Materials
- Hero imagery focusing on healing and progress
- Testimonials emphasizing safety and effectiveness
- Professional credentials and therapeutic expertise
- Clear pricing: £9.99/month after 7-day free trial

---

## Technical Implementation

### CSS Custom Properties
```css
:root {
  --primary-blue: hsl(217, 88%, 58%);
  --secondary-blue: hsl(212, 92%, 66%);
  --primary-green: hsl(158, 92%, 40%);
  --secondary-green: hsl(162, 83%, 58%);
  --warm-accent: hsl(41, 96%, 48%);
  --therapeutic-bg: hsl(210, 40%, 98%);
  --safe-space: hsl(158, 30%, 95%);
}
```

### Component Classes
```css
.emdr-gradient { /* Primary brand gradient */ }
.therapeutic-card { /* Content card styling */ }
.safe-space-bg { /* Therapeutic background */ }
.courage-gradient { /* Inspirational gradient */ }
.therapeutic-pulse { /* Calming animation */ }
```

---

## Brand Compliance

### Do's
✅ Use approved color palette consistently  
✅ Maintain logo aspect ratios and clear space  
✅ Follow typography hierarchy  
✅ Use therapeutic, supportive language  
✅ Ensure accessibility standards  
✅ Include appropriate medical disclaimers  

### Don'ts
❌ Modify logo colors or proportions  
❌ Use unapproved color combinations  
❌ Create anxiety-inducing visual patterns  
❌ Make medical claims beyond scope  
❌ Use triggering or harmful imagery  
❌ Compromise user safety for design  

---

## Contact
For brand guideline questions or approvals:
**support@emdrise.com**

*Last updated: September 6, 2025*
*Company: GC Psychotherapy, United Kingdom*