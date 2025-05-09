import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined = undefined;
let authInstance: Auth | undefined = undefined;
const googleProviderInstance = new GoogleAuthProvider(); // This can be initialized regardless

if (!firebaseConfig.apiKey) {
  console.error(
    'Firebase API key is missing. Firebase will not be initialized. ' +
    'Please check your .env file and ensure NEXT_PUBLIC_FIREBASE_API_KEY is set.'
  );
} else {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    authInstance = getAuth(app);
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    // app and authInstance will remain undefined, or Firebase services will not be functional.
  }
}

export { app, authInstance as auth, googleProviderInstance as googleProvider };
