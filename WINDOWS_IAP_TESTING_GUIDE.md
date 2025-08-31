# Apple In-App Purchase Testing Guide (Windows/Non-Mac Users)

## Overview
This guide shows you how to test Apple In-App Purchases for your EMDRise app WITHOUT needing a Mac computer. We'll use cloud-based solutions and Expo's online build service.

## What You'll Need
- Windows laptop/PC (what you have)
- Apple Developer Account ($99/year)
- Expo Account (free)
- RevenueCat Account (free tier available)
- iPhone or access to iOS Simulator online

---

## PHASE 1: Apple Developer Setup (Web Browser)

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
   - **Bundle ID**: com.emdrise.app
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
8. Save (will be approved automatically for testing)

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

## PHASE 2: RevenueCat Setup (Web Browser)

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

---

## PHASE 3: Replit Development (In Your Browser)

### Step 7: Create Expo Account
1. Go to https://expo.dev/signup
2. Create a free account
3. Remember your login credentials

### Step 8: Configure EAS in Replit
**This is where we'll do everything in your Replit environment:**

1. Open your Replit project
2. I'll help you set up the EAS configuration properly
3. We'll use Expo's cloud build service (no Mac needed!)

---

## PHASE 4: Cloud Building (Expo EAS)

### Step 9: EAS Build Setup in Replit
I'll help you configure this properly in your Replit environment. The key advantage is that **Expo's servers will build your iOS app in the cloud** - you don't need a Mac!

### Step 10: Authenticate and Build
We'll use Expo's web-based authentication flow to connect your account and trigger the cloud build.

---

## PHASE 5: Testing Options (No Mac Required)

### Option A: Physical iPhone Testing
1. Borrow an iPhone from a friend/family member for 30 minutes
2. Install your test build
3. Test the purchase flow
4. Return the phone (your subscription testing is complete)

### Option B: Online iOS Simulator
1. Use services like:
   - BrowserStack (paid but has free trial)
   - Appetize.io (online iOS simulator)
   - TestFlight (Apple's beta testing platform)

### Option C: Partner with Someone Who Has a Mac
1. Send your built .ipa file to someone with a Mac
2. They can test it on their iOS simulator
3. They report back the results

---

## PHASE 6: Hybrid Approach (Recommended)

### The Smart Way to Test Without a Mac:
1. **Use Expo EAS cloud builds** (no Mac needed for building)
2. **Test on a physical iPhone** (borrow one for testing)
3. **Use web-based tools** for everything else
4. **Monitor results in RevenueCat dashboard** (web-based)

---

## Key Advantages of This Approach:

✅ **No Mac required** - Expo builds everything in the cloud  
✅ **Use your Windows laptop** for all development  
✅ **Minimal iPhone access needed** - just for final testing  
✅ **Full IAP functionality** - same results as Mac-based development  
✅ **Cost effective** - no need to buy a Mac  

---

## Next Steps:

1. **Start with Apple Developer account** (takes 24-48 hours for approval)
2. **Set up RevenueCat account** (can do immediately)
3. **Let me configure EAS in your Replit** (we can do this now)
4. **Build using Expo's cloud service** (when Apple account is ready)
5. **Arrange iPhone testing** (borrow device for 30 minutes)

Would you like me to start configuring the EAS build setup in your Replit environment right now? This way, when your Apple Developer account is approved, we'll be ready to build immediately.