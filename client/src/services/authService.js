import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

/**
 * Initiates Google Sign-In via Firebase Auth Popup
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Firebase Google Sign-In Error:', error);
    return { success: false, error: error.message || 'Google Sign-In failed' };
  }
};

/**
 * Signs out current authenticated user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Firebase Sign-Out Error:', error);
    return { success: false, error: error.message || 'Sign-Out failed' };
  }
};

/**
 * Attaches a real-time listener for Firebase Auth state changes
 * @param {Function} callback - Callback function receiving current user or null
 */
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, callback);
};
