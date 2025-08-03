import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut as firebaseSignOut } from 'firebase/auth';

// Firebase configuration from your project
const firebaseConfig = {
  apiKey: "AIzaSyChL4wy2ppBueWjvFp6xlfy7rhA",
  authDomain: "emdrise.firebaseapp.com",
  projectId: "emdrise",
  storageBucket: "emdrise.firebasestorage.app",
  messagingSenderId: "579678539575",
  appId: "1:579678539575:web:eb952a39b0b0357fbb54b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Sign in with Google using redirect (fallback for popup issues)
export const signInWithGoogleRedirect = async () => {
  try {
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    await signInWithRedirect(auth, googleProvider);
    // Note: This redirects the page, so execution stops here
  } catch (error) {
    console.error('Error signing in with Google (redirect):', error);
    throw error;
  }
};

// Check for redirect result on page load
export const checkRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    return result?.user || null;
  } catch (error) {
    console.error('Error getting redirect result:', error);
    return null;
  }
};

// Sign in with Google (direct approach)
export const signInWithGoogle = async () => {
  try {
    // Configure Google provider settings
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
    
    // Get current domain info for debugging
    const currentDomain = window.location.hostname;
    console.log('Attempting Google Sign In from domain:', currentDomain);
    
    // Try popup first
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    
    // Handle specific error cases
    if ((error as any).code === 'auth/popup-blocked') {
      // Fallback to redirect method
      console.log('Popup blocked, trying redirect method...');
      try {
        await signInWithGoogleRedirect();
        return null; // Will be handled by redirect
      } catch (redirectError) {
        console.error('Redirect also failed:', redirectError);
        throw new Error('Google Sign In requires domain setup. Please use the TEST button below for immediate access!');
      }
    } else if ((error as any).code === 'auth/unauthorized-domain') {
      console.error('Domain not authorized:', window.location.hostname);
      throw new Error('Google Sign In requires domain setup. Please use the TEST button below for immediate access!');
    }
    
    throw new Error('Google Sign In requires domain setup. Please use the TEST button below for immediate access!');
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};