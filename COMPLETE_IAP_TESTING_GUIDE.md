# Complete Apple In-App Purchase Testing Guide for EMDRise

## Overview
This guide will walk you through testing Apple In-App Purchases for your EMDRise app. We'll use multiple platforms and complete everything in the correct order.

## What You'll Need
- Mac computer (required for iOS development)
- Apple Developer Account ($99/year)
- Expo Account (free)
- RevenueCat Account (free tier available)
- iOS device or iOS Simulator

---

## PHASE 1: Apple Developer Setup (Apple Developer Portal)

### Step 1: Apple Developer Account
1. Go to https://developer.apple.com/
2. Sign in with your Apple ID
3. Enroll in Apple Developer Program ($99/year)
4. Wait for approval (can take 24-48 hours)

### Step 2: Create App in App Store Connect
1. Go to https://appstoreconnect.apple.com/
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform**: iOS
   - **Name**: EMDRise
   - **Primary Language**: English
   - **Bundle ID**: com.emdrise.app (must match your app.json)
   - **SKU**: com.emdrise.app

### Step 3: Create In-App Purchase Product
1. In App Store Connect, go to your EMDRise app
2. Click "Features" → "In-App Purchases"
3. Click "+" to create new subscription
4. Choose "Auto-Renewable Subscription"
5. Fill in:
   - **Reference Name**: EMDRise Monthly Subscription
   - **Product ID**: `com.emdrise.monthly`
   - **Subscription Group**: Create new group "EMDRise Subscriptions"
6. Add pricing: £12.99/month
7. Add localized information:
   - **Display Name**: Monthly Access
   - **Description**: Full access to EMDR therapy sessions
8. Save and submit for review (will be approved automatically for testing)

### Step 4: Create Sandbox Test Users
1. In App Store Connect, go to "Users and Access"
2. Click "Sandbox Testers"
3. Click "+" to add tester
4. Create a test Apple ID:
   - **Email**: Use a NEW email (not your main Apple ID)
   - **Password**: Create strong password
   - **Country**: United Kingdom
   - **First/Last Name**: Test User
5. **IMPORTANT**: Don't verify this email - keep it as sandbox only

---

## PHASE 2: RevenueCat Setup (RevenueCat Dashboard)

### Step 5: RevenueCat Configuration
1. Go to https://app.revenuecat.com/
2. Sign up/log in
3. Click "Create new app"
4. Fill in:
   - **App name**: EMDRise
   - **Bundle ID**: com.emdrise.app
5. Go to "App settings" → "Apple App Store"
6. Upload your App Store Connect API key:
   - In App Store Connect: Users and Access → Keys → App Store Connect API
   - Create new key with "Developer" access
   - Download the .p8 file
   - Upload to RevenueCat along with Key ID and Issuer ID

### Step 6: Import Products to RevenueCat
1. In RevenueCat dashboard, go to "Products"
2. Click "Import from App Store"
3. Select your "com.emdrise.monthly" product
4. This syncs your App Store Connect products with RevenueCat

---

## PHASE 3: Local Development Setup (Your Computer)

### Step 7: Install Development Tools
Open Terminal on your Mac and run these commands:

```bash
# Install Node.js (if not already installed)
# Download from https://nodejs.org/

# Install Xcode from Mac App Store (required for iOS development)

# Install Expo CLI globally
npm install -g @expo/cli eas-cli
```

### Step 8: Download Your Code
1. Go to your Replit project: https://replit.com/
2. Click the three dots menu → "Download as ZIP"
3. Extract the ZIP file to your Mac
4. Open Terminal and navigate to the project:
```bash
cd /path/to/your/extracted/project
```

### Step 9: Install Dependencies
```bash
# Install main project dependencies
npm install

# Go to mobile app directory and install dependencies
cd mobile-app
npm install
```

---

## PHASE 4: Expo/EAS Setup (Terminal on Your Mac)

### Step 10: Login to Expo
```bash
# Make sure you're in the mobile-app directory
cd mobile-app

# Login to Expo (create account at expo.dev if needed)
npx eas login
```

### Step 11: Configure EAS Build
1. Check that `eas.json` exists in mobile-app directory
2. If not, run: `npx eas build:configure`
3. The file should look like this:
```json
{
  "cli": {
    "version": ">= 8.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      }
    }
  }
}
```

### Step 12: Build Development Version
```bash
# This uploads your code to Expo's servers and builds an iOS app
npx eas build --platform ios --profile development

# This process will:
# 1. Ask you to connect your Apple Developer account
# 2. Generate certificates automatically
# 3. Build your app (takes 10-15 minutes)
# 4. Provide a download link for the .ipa file
```

---

## PHASE 5: Testing Setup (Your iPhone/Simulator)

### Step 13: Install the Development Build

**Option A: Physical iPhone**
1. After EAS build completes, you'll get a download link
2. Open the link on your iPhone
3. Install the development build
4. Go to Settings → General → VPN & Device Management
5. Trust the developer certificate

**Option B: iOS Simulator**
1. Open Xcode → Window → Devices and Simulators
2. Create iPhone simulator (iPhone 15 recommended)
3. Drag the downloaded .ipa file to the simulator

### Step 14: Configure Sandbox Environment
**On your test device:**
1. Go to Settings → App Store
2. Scroll down to "Sandbox Account"
3. Sign in with your sandbox test user (from Step 4)
4. **IMPORTANT**: Make sure you're NOT signed in with your real Apple ID in the main App Store section

---

## PHASE 6: Testing the IAP Flow (Your iPhone/Simulator)

### Step 15: Test Purchase Flow
1. Open your EMDRise app
2. Try to access premium features
3. The app should prompt for subscription
4. Complete the purchase using your sandbox account
5. **You won't be charged real money** - this is sandbox testing

### Step 16: Verify in RevenueCat
1. Go to RevenueCat dashboard
2. Check "Customer" section
3. You should see your test purchase appear
4. Verify subscription status shows as "active"

### Step 17: Test Subscription Management
1. In your app, try to restore purchases
2. Test canceling subscription (in device settings)
3. Verify app handles subscription status changes

---

## PHASE 7: Troubleshooting Common Issues

### If Build Fails:
- Check that your Bundle ID matches everywhere (app.json, App Store Connect, RevenueCat)
- Ensure Apple Developer account is active
- Try clearing Expo cache: `npx expo r -c`

### If IAP Doesn't Work:
- Verify you're using sandbox test user
- Check that products are approved in App Store Connect
- Ensure RevenueCat API key is correct
- Check device/simulator has internet connection

### If Purchases Don't Appear:
- Wait a few minutes for sync between Apple and RevenueCat
- Check RevenueCat dashboard for events
- Verify your app's Bundle ID matches your RevenueCat configuration

---

## PHASE 8: Going Live (After Testing)

### Step 18: Production Build
```bash
# When ready for App Store submission
npx eas build --platform ios --profile production
```

### Step 19: App Store Submission
1. Upload to App Store Connect using Transporter or Xcode
2. Complete app review information
3. Submit for review
4. Wait for Apple approval (1-7 days typically)

---

## Summary of Platforms Used:

1. **Apple Developer Portal** - App creation, IAP products, sandbox users
2. **RevenueCat Dashboard** - API keys, product sync, analytics
3. **Your Mac Terminal** - Code building, EAS commands
4. **iPhone/Simulator** - Testing the actual purchase flow
5. **Replit** - Code development and management

## Key Success Indicators:
- ✅ EAS build completes successfully
- ✅ App installs on device/simulator
- ✅ Subscription prompt appears in app
- ✅ Test purchase completes without real charges
- ✅ RevenueCat shows active subscription
- ✅ App unlocks premium features

Let me know which step you'd like to start with or if you need clarification on any part!