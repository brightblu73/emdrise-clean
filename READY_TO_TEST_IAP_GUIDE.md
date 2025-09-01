# EMDRise IAP Testing - Ready to Execute Guide

Based on your configuration document, everything is properly set up! Here's your step-by-step testing process using your existing accounts and configurations.

## Your Current Setup ✅
- **Apple Developer**: Bundle ID `com.emdrise.app`, App ID `6751441976`
- **App Store Connect**: Product ID `com.emdrise.monthly` 
- **Sandbox User**: `emdrise.test-1@gmail.com` / `EMDRise123`
- **RevenueCat**: API Key `appl_xewZcRiyLfkBnmDYaTktVHghPKz`
- **Expo Account**: `graham.cottrell.73@gmail.com` / `emdriseUsername`

---

## STEP 1: EAS Authentication (In Replit Terminal)

Open the **Console tab** in your Replit and run these commands:

```bash
# Navigate to mobile app directory
cd mobile-app

# Login to your Expo account
npx eas login
```

**When prompted:**
- Email: `graham.cottrell.73@gmail.com`
- Password: `CheckNotOnAWS@12`

---

## STEP 2: Connect Apple Developer Account

```bash
# This will prompt you to connect your Apple Developer account
npx eas device:create
```

**Follow the prompts:**
1. Choose "iOS"
2. It will open a browser to connect your Apple Developer account
3. Sign in with your Apple ID (the one used for Developer account)
4. Grant EAS permission to manage certificates

---

## STEP 3: Build Development Version

```bash
# Build your iOS app with IAP integration
npx eas build --platform ios --profile development
```

**What happens:**
- Uploads your code to Expo's build servers
- Automatically generates iOS certificates
- Builds the app with RevenueCat integration
- Takes about 10-15 minutes
- Provides download link when complete

---

## STEP 4: Download and Install (iPhone Required)

**You'll need to borrow an iPhone for about 30 minutes:**

1. **Download the build:**
   - EAS will provide a download link
   - Open this link on the iPhone's Safari browser
   - Tap "Install" 

2. **Trust the developer:**
   - Go to Settings → General → VPN & Device Management
   - Find your developer certificate
   - Tap "Trust"

3. **Configure Sandbox:**
   - Go to Settings → App Store
   - Scroll to "Sandbox Account" section
   - Sign in with: `emdrise.test-1@gmail.com` / `EMDRise123`
   - **Important**: Make sure you're NOT signed into the main App Store with this test account

---

## STEP 5: Test the Purchase Flow

1. **Open EMDRise app** on the iPhone

2. **Navigate to subscription prompt:**
   - Try to access premium EMDR features
   - The app should show subscription options

3. **Attempt purchase:**
   - Tap "Subscribe" or equivalent button
   - Apple's payment sheet should appear
   - Complete purchase with sandbox account
   - **No real money will be charged**

4. **Verify success:**
   - App should unlock premium features
   - You should see confirmation

---

## STEP 6: Monitor in RevenueCat (Web Browser)

1. **Go to RevenueCat Dashboard:**
   - https://app.revenuecat.com/
   - Navigate to your EMDRise project

2. **Check Customer Activity:**
   - Go to "Customers" section
   - Look for your test user
   - Verify subscription shows as "Active"

3. **Check Events:**
   - Go to "Events" section
   - You should see purchase events
   - Verify RevenueCat received the purchase data

---

## STEP 7: Test Edge Cases

**While you still have the iPhone:**

1. **Test Restore Purchases:**
   - Delete and reinstall the app
   - Try "Restore Purchases" option
   - Should unlock premium features without repurchasing

2. **Test Subscription Management:**
   - Go to iPhone Settings → Apple ID → Subscriptions
   - Find EMDRise subscription
   - Try canceling (this is sandbox, so it's safe)
   - Return to app and verify it handles cancellation

---

## STEP 8: Verify Complete Integration

**Success indicators:**
- ✅ App prompts for subscription
- ✅ Purchase completes without real charges
- ✅ App unlocks premium features
- ✅ RevenueCat shows active subscription
- ✅ Restore purchases works
- ✅ Cancellation handling works

---

## Troubleshooting Common Issues

### If Build Fails:
```bash
# Clear cache and try again
cd mobile-app
npx expo r -c
npx eas build --platform ios --profile development --clear-cache
```

### If App Won't Install:
- Make sure iPhone allows installation from unknown developers
- Check that you trusted the certificate in Settings
- Try downloading on cellular data instead of WiFi

### If Purchase Doesn't Work:
- Verify sandbox user is signed in correctly
- Check that you're NOT signed in with real Apple ID in main App Store
- Wait a few minutes and try again (Apple's sandbox can be slow)

### If RevenueCat Doesn't Show Purchase:
- Wait 2-3 minutes for data sync
- Check that API key is correct
- Verify Bundle ID matches exactly across all platforms

---

## Next Steps After Testing

Once testing is successful:

1. **Production Build:**
   ```bash
   npx eas build --platform ios --profile production
   ```

2. **App Store Submission:**
   - Submit to App Store for review
   - Usually takes 1-7 days for approval

3. **Go Live:**
   - Release to real users
   - Monitor RevenueCat analytics
   - Handle real subscriptions

---

## Timeline Estimate

- **EAS Setup**: 10 minutes
- **Build Time**: 15 minutes
- **iPhone Testing**: 15 minutes
- **Total**: About 40 minutes

Ready to start? Begin with **STEP 1** in your Replit Console tab!