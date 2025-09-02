# Complete Local EAS Build Testing Guide for Windows

## Overview
This guide will walk you through building and testing your EMDRise iOS app with Apple In-App Purchases on your Windows computer using Expo's cloud build service.

**Total Time Required:** ~45 minutes
- Setup: 10 minutes
- Build: 20 minutes (cloud build time)
- Testing: 15 minutes

---

## STEP 1: Download Your Project from GitHub (5 minutes)

### 1.1 Download from GitHub
1. **Open your browser** and go to: https://github.com/brightblu73/emdrise-clean
2. **Click the green "Code" button**
3. **Select "Download ZIP"**
4. **Extract the ZIP file** to a folder like `C:\EMDRise\`

### 1.2 Verify Download
Your extracted folder should contain:
- `mobile-app/` folder
- `client/` folder
- `server/` folder
- `package.json`
- Other project files

---

## STEP 2: Install Required Software (5 minutes)

### 2.1 Install Node.js
1. **Go to:** https://nodejs.org/
2. **Download the LTS version** (recommended for most users)
3. **Run the installer** with default settings
4. **Restart your computer** after installation

### 2.2 Verify Installation
1. **Open Command Prompt** (Press Windows + R, type `cmd`, press Enter)
2. **Run these commands** to verify:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.17.0)

---

## STEP 3: Navigate to Mobile App Directory (1 minute)

### 3.1 Open Command Prompt
1. **Press Windows + R**
2. **Type `cmd`** and press Enter

### 3.2 Navigate to Project
```bash
# Replace C:\EMDRise with your actual extraction path
cd C:\EMDRise\emdrise-clean-main\mobile-app
```

### 3.3 Verify You're in Right Location
```bash
dir
```
You should see files like: `app.json`, `package.json`, `App.tsx`, `eas.json`

---

## STEP 4: Install Dependencies (3 minutes)

### 4.1 Install Node Modules
```bash
npm install
```
This will download all required packages. It may take 2-3 minutes.

### 4.2 Verify Installation Success
You should see:
- A `node_modules/` folder created
- No error messages
- "added X packages" at the end

---

## STEP 5: Login to Expo (2 minutes)

### 5.1 Login Command
```bash
npx eas login
```

### 5.2 Enter Your Credentials
When prompted, enter:
- **Email:** `graham.cottrell.73@gmail.com`
- **Password:** `CheckNotOnAWS@12`

### 5.3 Verify Login Success
```bash
npx eas whoami
```
Should show: `emdrise`

---

## STEP 6: Start the EAS Build (2 minutes)

### 6.1 Initiate iOS Build
```bash
npx eas build --platform ios --profile development
```

### 6.2 Follow the Prompts
The build process will ask you to:
1. **Connect your Apple Developer account** - follow the browser prompts
2. **Sign in with your Apple ID** (the one used for Developer account)
3. **Grant EAS permissions** to manage certificates

### 6.3 Build Started Confirmation
You'll see:
- "Build started" message
- A build URL (save this!)
- Estimated completion time (~15-20 minutes)

---

## STEP 7: Monitor Build Progress (20 minutes)

### 7.1 Track Build Status
The command line will show:
- Build queue position
- Build progress updates
- Estimated time remaining

### 7.2 Alternative: Web Dashboard
You can also monitor at: https://expo.dev/accounts/emdrise/projects/emdrise/builds

### 7.3 Build Completion
When complete, you'll receive:
- ✅ Build successful message
- **Download URL for your .ipa file**
- QR code for easy download

---

## STEP 8: Download Your iOS App (2 minutes)

### 8.1 Save the Download Link
Copy the .ipa download URL from the build output.

### 8.2 Test the Download
Click the link to verify the .ipa file downloads successfully.

---

## STEP 9: Test on iPhone (15 minutes)

### 9.1 Borrow an iPhone
You'll need access to an iPhone for about 15 minutes.

### 9.2 Configure Sandbox Environment
**On the iPhone:**
1. Go to **Settings → App Store**
2. Scroll to **"Sandbox Account"**
3. Sign out of any existing sandbox account
4. Sign in with: `emdrise.test-1@gmail.com` / `EMDRise123`
5. **Important:** Make sure you're NOT signed in with this account in the main App Store

### 9.3 Install Your App
1. **Open Safari** on the iPhone
2. **Go to your .ipa download URL**
3. **Tap "Install"**
4. **Go to Settings → General → VPN & Device Management**
5. **Find your developer certificate**
6. **Tap "Trust [Your Developer Name]"**

### 9.4 Test the IAP Flow
1. **Open EMDRise app**
2. **Navigate to premium features**
3. **Try to subscribe** - should show Apple's payment sheet
4. **Complete purchase** with sandbox account
5. **Verify app unlocks** premium features

### 9.5 Test Edge Cases
1. **Force close the app** and reopen - should stay subscribed
2. **Try "Restore Purchases"** option
3. **Check subscription in iPhone Settings → Apple ID → Subscriptions**

---

## STEP 10: Verify in RevenueCat (5 minutes)

### 10.1 Check Customer Data
1. **Go to:** https://app.revenuecat.com/
2. **Navigate to your EMDRise project**
3. **Go to "Customers" section**
4. **Look for your test purchase**

### 10.2 Verify Events
1. **Go to "Events" section**
2. **Check for purchase events**
3. **Verify subscription status shows as "Active"**

---

## SUCCESS INDICATORS

### ✅ Build Success
- EAS build completes without errors
- .ipa file downloads successfully
- No certificate or signing issues

### ✅ App Installation Success
- App installs on iPhone without errors
- Developer certificate is trusted
- App launches normally

### ✅ IAP Integration Success
- Subscription prompt appears
- Apple payment sheet shows
- Purchase completes without real charges
- App unlocks premium features
- RevenueCat shows active subscription

---

## TROUBLESHOOTING

### Build Fails
```bash
# Clear cache and retry
npx expo r -c
npx eas build --platform ios --profile development --clear-cache
```

### App Won't Install
- Ensure iPhone allows apps from unknown developers
- Check that developer certificate is trusted
- Try downloading on cellular data instead of WiFi

### IAP Doesn't Work
- Verify sandbox user is signed in correctly in Settings → App Store → Sandbox Account
- Ensure you're NOT signed in with sandbox account in main App Store
- Wait a few minutes and try again (Apple's sandbox can be slow)

### RevenueCat Shows No Data
- Wait 2-3 minutes for sync between Apple and RevenueCat
- Check that your Bundle ID matches exactly: `com.emdrise.app`
- Verify API key is correct in your code

---

## WHAT YOUR BUILD INCLUDES

Your iOS app will have:
- ✅ Complete EMDR therapy workflow
- ✅ RevenueCat IAP integration with API key: `appl_xewZcRiyLfkBnmDYaTktVHghPKz`
- ✅ Apple In-App Purchase for product: `com.emdrise.monthly`
- ✅ Sandbox testing capability
- ✅ Production-ready subscription handling

---

## NEXT STEPS AFTER SUCCESSFUL TESTING

### 1. Production Build
When ready for App Store submission:
```bash
npx eas build --platform ios --profile production
```

### 2. App Store Submission
- Upload to App Store Connect
- Complete app review information
- Submit for Apple review (1-7 days)

### 3. Go Live
- Release to real users
- Monitor RevenueCat analytics
- Handle real subscriptions and revenue

---

## SUMMARY TIMELINE

- **Minutes 1-10:** Download, install Node.js, navigate to project
- **Minutes 11-15:** Install dependencies, login to Expo
- **Minutes 16-35:** Start build, wait for cloud compilation
- **Minutes 36-50:** Download app, test on iPhone
- **Minutes 51-55:** Verify RevenueCat integration

**Total: ~55 minutes for complete end-to-end testing**

Your Apple Developer, App Store Connect, and RevenueCat configurations are already perfect. This local build approach will give you a fully functional iOS app with working In-App Purchases for testing.

Ready to begin? Start with Step 1!