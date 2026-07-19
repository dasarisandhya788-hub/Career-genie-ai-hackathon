import { db } from "./config";
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * Creates a new user profile document in Firestore under the 'users' collection
 * using the user's Firebase Authentication UID.
 * 
 * @param {string} uid - Firebase Auth User ID
 * @param {string} email - User's email address
 * @param {string} name - User's display name
 */
export const createUserProfile = async (uid, email, name) => {
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, {
    name,
    email,
    createdAt: serverTimestamp(),
    progress: 0,
    careerGoal: "",
    completedTasks: []
  });
};

/**
 * Retrieves the user profile document from Firestore.
 * 
 * @param {string} uid - Firebase Auth User ID
 * @returns {Promise<object|null>} The user profile data, or null if it does not exist
 */
export const getUserProfile = async (uid) => {
  const userDocRef = doc(db, "users", uid);
  const docSnap = await getDoc(userDocRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
};

/**
 * Updates an existing user's profile in Firestore.
 * 
 * @param {string} uid - Firebase Auth User ID
 * @param {object} updates - Key-value pairs to update on the user document
 */
export const updateUserProfile = async (uid, updates) => {
  const userDocRef = doc(db, "users", uid);
  await updateDoc(userDocRef, updates);
};
