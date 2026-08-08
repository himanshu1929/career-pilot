import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBEKoZ4gTnHOjS3-6_gVLd0GBwKh9egmdA",
  authDomain: "career-pilot-2df66.firebaseapp.com",
  projectId: "career-pilot-2df66",
  storageBucket: "career-pilot-2df66.firebasestorage.app",
  messagingSenderId: "124418199026",
  appId: "1:124418199026:web:9f8cf5c09342523492af6b"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Export Modular SDK Services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
