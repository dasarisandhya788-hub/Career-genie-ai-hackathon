// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check if environment variables are missing or set to placeholder defaults
const isConfigMissing =
  !import.meta.env.VITE_FIREBASE_API_KEY ||
  import.meta.env.VITE_FIREBASE_API_KEY === "YOUR_API_KEY" ||
  !import.meta.env.VITE_FIREBASE_PROJECT_ID ||
  import.meta.env.VITE_FIREBASE_PROJECT_ID === "YOUR_PROJECT_ID";

let app;
let analytics;
let auth;
let db;

if (!isConfigMissing) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "career-compass-ai-5c7ab.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "career-compass-ai-5c7ab",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "career-compass-ai-5c7ab.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "705666857860",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:705666857860:web:0a4b14ec5552339f71b8db",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QLMJX3KDSN"
  };

  // Initialize Firebase instances
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
  auth = getAuth(app);
  db = getFirestore(app);
}

// Export instances and validation flag so components can handle missing config states
export { app, analytics, auth, db, isConfigMissing };
export default app;