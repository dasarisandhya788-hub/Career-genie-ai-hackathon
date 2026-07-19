// Import the functions you need from the SDKs you need
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrYgflZH3VT82fcj8dS-Oq_PtvezMx9Ew",
  authDomain: "career-genie-ai.firebaseapp.com",
  projectId: "career-genie-ai",
  storageBucket: "career-genie-ai.firebasestorage.app",
  messagingSenderId: "220598246502",
  appId: "1:220598246502:web:e2513fa0754b5eecaee1a7",
  measurementId: "G-QZCGLFXBR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);