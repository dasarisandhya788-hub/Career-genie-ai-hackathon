// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check if environment variables are missing or set to placeholder defaults
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCrYgflZH3VT82fcj8dS-Oq_PtvezMx9Ew";

const isConfigMissing =
  !apiKey ||
  apiKey === "YOUR_API_KEY";

let app;
let analytics;
let auth;
let db;

if (!isConfigMissing) {
  const firebaseConfig = {
    apiKey: apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "career-genie-ai.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "career-genie-ai",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "career-genie-ai.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "220598246502",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:220598246502:web:e2513fa0754b5eecaee1a7",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-QZCGLFXBR8"
  };

  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== "undefined") {
      try {
        analytics = getAnalytics(app);
      } catch (e) {}
    }
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.error("Firebase initialization failed:", err);
  }
}

// Export instances and validation flag so components can handle missing config states
export { app, analytics, auth, db, isConfigMissing };
export default app;