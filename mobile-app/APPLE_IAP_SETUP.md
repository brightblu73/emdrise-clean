# Apple In-App Purchase Setup Guide

## Overview
This guide will help you set up Apple In-App Purchases (IAP) with RevenueCat for EMDRise mobile app.

## Prerequisites
- Apple Developer Account ($99/year)
- Xcode installed on Mac
- App Store Connect access
- Banking/tax information submitted to Apple

## Phase 1: Apple Developer Setup (YOU NEED TO DO THIS)

### 1. App Store Connect Setup
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to **My Apps** → **EMDRise** (or create new app)
3. Fill in app information:
   - **Bundle ID**: `com.emdrise.app` (matches app.json)
   - **App Name**: EMDRise
   - **SKU**: Any unique identifier

### 2. Create Subscription Group
1. In App Store Connect → **Features** → **In-App Purchases**
2. Click **Manage** next to Subscription Groups
3. Create new group:
   - **Reference Name**: EMDRise Subscription Group
   - **App Store Display Name**: EMDRise Pro

### 3. Create Subscription Product
1. Inside the subscription group, click **Create Subscription**
2. Configure subscription:
   - **Product ID**: `emdrise_monthly_subscription` (remember this!)
   - **Reference Name**: EMDRise Monthly
   - **Review Notes**: Monthly subscription for EMDR therapy access
   - **Cleared for Sale**: Yes

### 4. Configure Free Trial
1. In the subscription settings:
   - **Subscription Duration**: 1 month
   - **Free Trial**: 7 days
   - **Introductory Offer**: 7 days free, then regular pricing

### 5. Set Pricing
1. Choose your price tier (recommended: $12.99/month)
2. Set availability in desired countries
3. **Important**: All required metadata must be filled for ALL enabled localizations

### 6. Enable In-App Purchase Capability
1. Go to [Apple Developer Portal](https://developer.apple.com/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Find your App ID (`com.emdrise.app`)
4. Edit → Enable **In-App Purchase** capability
5. Save changes

## Phase 2: RevenueCat Setup (YOU NEED TO DO THIS)

### 1. Create RevenueCat Account
1. Go to [RevenueCat](https://app.revenuecat.com/)
2. Sign up for free account
3. Create new project: **EMDRise**

### 2. Configure App
1. Add new app in RevenueCat dashboard
2. **Platform**: iOS
3. **Bundle ID**: `com.emdrise.app`
4. **App Store Connect API Key**: Upload your API key from App Store Connect

### 3. Create Products
1. Go to **Products** in RevenueCat
2. **Import from App Store Connect** (recommended)
3. Or manually create:
   - **Identifier**: `emdrise_monthly_subscription`
   - **Type**: Subscription

### 4. Configure Entitlements
1. Go to **Entitlements**
2. Create entitlement: **pro**
3. Attach it to your subscription product

### 5. Get API Keys
1. Go to **API Keys** in RevenueCat
2. Copy **iOS API Key** (starts with `appl_`)
3. Copy **Android API Key** if you plan Android support

## Phase 3: Mobile App Configuration (I'VE DONE THIS)

✅ **Already Completed:**
- Added RevenueCat SDK to package.json
- Created RevenueCat service integration
- Built subscription management UI
- Added EAS Build configuration
- Created subscription hooks and components

### Environment Variables Needed
Create `mobile-app/.env` file:
```
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=appl_your_ios_key_here
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=goog_your_android_key_here
```

## Phase 4: Build and Test (NEXT STEPS)

### 1. Install Dependencies
```bash
cd mobile-app
npm install
```

### 2. Create EAS Development Build
```bash
# Install EAS CLI globally
npm install -g @expo/cli eas-cli

# Initialize EAS project
eas init

# Create development build for iOS
eas build --profile development --platform ios

# This creates a custom app you can install on your iPhone for testing
```

### 3. Testing Checklist
- [ ] Test subscription purchase with Sandbox account
- [ ] Test 7-day free trial flow
- [ ] Test restore purchases
- [ ] Test subscription status checking
- [ ] Verify receipt validation works

### 4. App Store Submission Prep
- [ ] Screenshots for App Store
- [ ] App description and keywords  
- [ ] Privacy policy URL
- [ ] Submit for review with subscription enabled

## Important Notes

### Apple Review Requirements
- Must clearly explain subscription terms
- Must provide easy cancellation method
- Must respect user privacy
- Cannot mention other payment methods

### RevenueCat Benefits
- **Free up to $2.5k monthly revenue**
- Handles receipt validation automatically
- Provides analytics and user insights
- Cross-platform support (iOS + Android)
- Webhooks for backend integration

### Timeline Estimate
- **Apple setup**: 2-3 hours
- **RevenueCat setup**: 1 hour  
- **Testing**: 1-2 days
- **App Store review**: 1-7 days

## Support Resources
- [RevenueCat Documentation](https://docs.revenuecat.com/)
- [Apple In-App Purchase Guide](https://developer.apple.com/in-app-purchase/)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

## Next Steps for You
1. Complete Apple Developer setup (Phase 1)
2. Set up RevenueCat account (Phase 2)  
3. Provide me with the RevenueCat API keys
4. I'll help you build and test the app

This replaces the entire Stripe integration with Apple-compliant IAP system!