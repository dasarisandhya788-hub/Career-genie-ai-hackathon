import { auth } from "./config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from "firebase/auth";
import { createUserProfile } from "./firestoreService";

/**
 * Registers a new user with email and password, updates their display name,
 * and initializes a Firestore profile document.
 * 
 * @param {string} email 
 * @param {string} password 
 * @param {string} name 
 * @returns {Promise<User>} Firebase Auth User object
 */
export const registerUser = async (email, password, name) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please check your Firebase environment configuration.");
  }
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Set the profile display name in Firebase Auth
  await updateProfile(user, { displayName: name });
  
  // Create their profile record in Firestore
  await createUserProfile(user.uid, email, name);
  
  return user;
};

/**
 * Log in an existing user using email and password.
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<User>} Firebase Auth User object
 */
export const loginUser = async (email, password) => {
  if (!auth) {
    throw new Error("Firebase Auth is not initialized. Please check your Firebase environment configuration.");
  }
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

/**
 * Logs out the current user.
 */
export const logoutUser = async () => {
  if (!auth) return;
  await signOut(auth);
};
