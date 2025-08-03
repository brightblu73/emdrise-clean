# EMDRise Project Backup Instructions

## Current Project Status
- Date: July 15, 2025
- Status: Fully functional EMDR therapy app with therapist selection
- Key Features: Maria/Alistair therapist videos, mobile app, BLS integration

## Manual Backup Methods

### Method 1: Download Key Files
Important files to save separately:
- `package.json` - Project dependencies
- `replit.md` - Project documentation and preferences
- `client/src/pages/home.tsx` - Main therapist selection page
- `shared/schema.ts` - Database schema
- `mobile-app/` folder - React Native mobile app
- `client/src/assets/maria-headshot.jpg` - Actual therapist photo
- `client/src/assets/alistair-headshot.jpg` - Actual therapist photo

### Method 2: Fork/Duplicate in Replit
1. Look for "Fork" option in Replit interface
2. Create duplicate project with different name
3. Both projects will exist independently

### Method 3: Export Project
1. File menu → Export as ZIP (if available)
2. Download to device for offline backup

## Recovery Instructions
If main project is lost:
1. Create new Replit project
2. Upload backed up files
3. Run `npm install` to restore dependencies
4. Restore database with `npm run db:push`

## Current Architecture
- Web app: React + TypeScript + Vite
- Mobile app: React Native + Expo  
- Backend: Node.js + Express + PostgreSQL
- Authentication: Passport.js with sessions
- Therapist videos: Maria and Alistair welcome scripts